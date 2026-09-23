/* Copia uploads antigos para fora do repositório e atualiza URLs.
 * Os originais são preservados. Execute depois de npm run migration:run. */
require('dotenv').config({ quiet: true });
const { Client } = require('pg');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { randomUUID } = require('node:crypto');

async function main() {
  const root =
    process.env.MEDIA_STORAGE_ROOT || path.join(os.homedir(), 'museu-storage');
  if (!path.isAbsolute(root))
    throw new Error('MEDIA_STORAGE_ROOT deve ser absoluto');
  const repository = path.resolve(__dirname, '../..');
  const relative = path.relative(repository, path.resolve(root));
  if (
    !relative ||
    (!relative.startsWith('..' + path.sep) && !path.isAbsolute(relative))
  ) {
    throw new Error('O armazenamento deve ficar fora do repositório');
  }
  const destination = path.join(root, 'files');
  await fs.mkdir(destination, { recursive: true });
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  await client.connect();
  const schema = (process.env.DB_SCHEMA || 'public').replaceAll('"', '""');
  const table = `"${schema}"."artwork_media"`;
  try {
    const { rows } = await client.query(
      `SELECT id_media, url FROM ${table} WHERE url LIKE '/uploads/artworks/%' OR url LIKE 'uploads/artworks/%'`,
    );
    let migrated = 0;
    for (const row of rows) {
      const name = row.url.replace(/^\/?uploads\/artworks\//, '');
      if (!name || path.basename(name) !== name || name.includes('\\')) {
        console.log(`Mídia ${row.id_media}: caminho inválido, ignorada`);
        continue;
      }
      const source = path.resolve(__dirname, '../uploads/artworks', name);
      let stat;
      try {
        stat = await fs.stat(source);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        console.log(
          `Mídia ${row.id_media}: arquivo de origem ausente, URL preservada`,
        );
        continue;
      }
      if (!stat.isFile()) continue;
      const extension =
        /\.[a-zA-Z0-9]{1,10}$/.exec(name)?.[0].toLowerCase() || '';
      const filename = `${randomUUID()}${extension}`;
      const target = path.join(destination, filename);
      await fs.copyFile(source, target, fs.constants.COPYFILE_EXCL);
      try {
        const result = await client.query(
          `UPDATE ${table} SET url=$1, size_bytes=$2 WHERE id_media=$3 AND url=$4`,
          [
            `/media/files/${filename}`,
            String(stat.size),
            row.id_media,
            row.url,
          ],
        );
        if (!result.rowCount) {
          await fs.unlink(target);
          continue;
        }
        migrated++;
      } catch (error) {
        await fs.unlink(target);
        throw error;
      }
    }
    console.log(
      `${migrated} arquivo(s) copiado(s) para ${destination}. Originais preservados.`,
    );
  } finally {
    await client.end();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
