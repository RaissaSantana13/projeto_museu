import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class IndependentMedia1789674000000 implements MigrationInterface {
  private tableName(queryRunner: QueryRunner): string {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ||
      'public';
    return `${schema}.artwork_media`;
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    const name = this.tableName(queryRunner);
    const table = await queryRunner.getTable(name);
    if (!table) throw new Error(`Tabela ${name} não encontrada`);
    for (const field of ['id_artwork', 'media_type']) {
      const column = table.findColumnByName(field);
      if (!column) throw new Error(`Coluna ${field} não encontrada`);
      const updated = column.clone();
      updated.isNullable = true;
      await queryRunner.changeColumn(name, column, updated);
    }
    const current = await queryRunner.getTable(name);
    for (const fk of current!.foreignKeys.filter((key) =>
      key.columnNames.includes('id_artwork'),
    )) {
      await queryRunner.dropForeignKey(name, fk);
      await queryRunner.createForeignKey(
        name,
        new TableForeignKey({ ...fk, onDelete: 'SET NULL' }),
      );
    }
    await queryRunner.addColumns(name, [
      new TableColumn({
        name: 'original_name',
        type: 'text',
        isNullable: true,
      }),
      new TableColumn({
        name: 'mime_type',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({ name: 'size_bytes', type: 'bigint', isNullable: true }),
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const name = this.tableName(queryRunner);
    const table = await queryRunner.getTable(name);
    if (!table) throw new Error(`Tabela ${name} não encontrada`);
    // PostgreSQL recusará o rollback se existirem arquivos independentes.
    // Nenhum registro é apagado para forçar a reversão.
    for (const field of ['id_artwork', 'media_type']) {
      const column = table.findColumnByName(field)!;
      const updated = column.clone();
      updated.isNullable = false;
      await queryRunner.changeColumn(name, column, updated);
    }
    const current = await queryRunner.getTable(name);
    for (const fk of current!.foreignKeys.filter((key) =>
      key.columnNames.includes('id_artwork'),
    )) {
      await queryRunner.dropForeignKey(name, fk);
      await queryRunner.createForeignKey(
        name,
        new TableForeignKey({ ...fk, onDelete: 'CASCADE' }),
      );
    }
    await queryRunner.dropColumns(name, [
      'original_name',
      'mime_type',
      'size_bytes',
    ]);
  }
}
