# Arquivos do museu

Os novos uploads são gravados diretamente no disco pelo Multer, sem carregar o arquivo inteiro na memória. A pasta padrão é `<pasta do usuário do servidor>/museu-storage/files`, fora do repositório.

Para escolher outra pasta, configure no `.env` do backend:

```dotenv
# Windows (caminho absoluto)
MEDIA_STORAGE_ROOT=C:/Users/hugop/museu-storage
# Exemplo Linux: MEDIA_STORAGE_ROOT=/srv/museu-storage
```

A conta que executa o backend precisa ter permissão de escrita nessa pasta. A aplicação recusa caminhos relativos ou dentro do repositório. No servidor definitivo, configure essa variável com o caminho do disco daquele servidor.

## Banco e arquivos antigos

```powershell
cd C:\Users\hugop\projeto_museu\nest_museu
npm run migration:run
npm run media:migrate-local
npm run start:dev
```

A migração usa o PostgreSQL e `DB_SCHEMA` configurados no `.env`. Ela mantém a tabela `artwork_media` e os IDs existentes, torna `id_artwork` e `media_type` opcionais, adiciona `original_name`, `mime_type` e `size_bytes`, e troca a exclusão em cascata por `SET NULL`. A coluna antiga `file_data` é preservada, mas não é usada pelos novos uploads.

O script de arquivos antigos copia os arquivos encontrados em `uploads/artworks` para a pasta externa e só então atualiza as URLs. Pode ser executado novamente; URLs já migradas são ignoradas. Os originais permanecem como cópia de segurança. Registros com arquivos ausentes são informados e preservados. Ele não exporta conteúdo antigo de `file_data`.

## Testar pelo Swagger

Abra `http://localhost:5000/docs` e procure **Arquivos do Museu**.

1. Abra **POST `/api/v1/files/upload-multiple`** e clique em **Try it out**.
2. Deixe `idArtwork`, `mediaType` e `isMain` vazios para arquivos independentes e sem classificação.
3. Em `files`, selecione vários arquivos. Dependendo da versão do Swagger, use **Add item** para acrescentar seletores.
4. Clique em **Execute**. `dados` retorna uma lista com um cadastro por arquivo.

Também há **POST `/api/v1/files/upload`**, com o campo único `file`. Os metadados opcionais vão nos parâmetros da URL; o corpo é `multipart/form-data`. A rota antiga `/api/v1/artwork_media` continua disponível.

O banco guarda URLs relativas à origem do backend, por exemplo `/media/files/uuid.jpeg`. Para abrir, acrescente o endereço do backend: `http://localhost:5000/media/files/uuid.jpeg`. O cliente não precisa conhecer o caminho físico do disco.

## Classificação e vínculo posterior

Use **PATCH `/api/v1/files/{id}/metadata`**, enviando somente os campos a alterar:

```json
{ "mediaType": "imagem", "idArtwork": 1, "isMain": false }
```

`mediaType` é uma classificação opcional do museu; `mimeType` é o tipo técnico recebido no upload. Um lote pode misturar imagens, documentos e vídeos. Se informar classificação ou obra no upload múltiplo, esses valores se aplicam ao lote inteiro.

O cadastro continua podendo se vincular a uma obra por vez. Excluir uma obra não apaga os arquivos: a exclusão física remove o vínculo, e a exclusão lógica preserva a mídia. Excluir a mídia pela API continua sendo exclusão lógica, com restauração disponível; não remove o conteúdo do disco. Substituição binária e exclusão física de arquivos não fazem parte desta etapa.

O POST JSON `/api/v1/files` é mantido por compatibilidade e apenas cadastra metadados/URL: para enviar conteúdo, use as rotas de upload.

## Verificação automatizada

```powershell
npm run build
npm run test:media
```

Os testes usam o PostgreSQL configurado, criam um schema aleatório `media_test_*` e uma pasta temporária, removidos ao final. A conta do banco precisa poder criar schemas. Eles verificam a migração, a documentação Swagger, upload múltiplo, conteúdo servido por HTTP, classificação, falhas de persistência/validação e preservação das mídias na exclusão de obras. Nenhum cadastro do schema do museu é usado nos testes.
