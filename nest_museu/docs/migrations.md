# Migrations do PostgreSQL

## Fonte e ordem

A baseline foi derivada do DDL enviado em 24/09/2026, com 27 tabelas, seus índices, enums e relacionamentos. O SQL antigo em `src/migrations/database_original.sql` fica apenas como referência histórica e não deve ser executado junto com as migrations.

1. `InitialMuseum1789600000000`: cria a estrutura anterior à alteração de mídias em um banco vazio. Em banco existente, compara colunas, tipos, defaults, nulabilidade, constraints, índices e enums com uma estrutura de referência descartável. Só adota a baseline se corresponder ao DDL anterior ou posterior à migration de mídias. Nesse segundo caso, exige também o registro original de `IndependentMedia` no histórico.
2. `IndependentMedia1789674000000`: migration histórica mantida sem alteração. Desvincula a obrigatoriedade de obra e adiciona os metadados dos arquivos.
3. `AlignSessionsAndDocuments1790200000000`: mantém IDs inteiros e `id_user` de sessões, amplia `token` para `text`, adiciona `device`, `device_name`, `is_valid`, `last_used_at`, corrige a FK de documentos para `prints` do mesmo schema e cadastra os cinco perfis que ainda não existirem, sem trocar IDs ou vínculos.

A entidade `Session`, a constante de coluna e os métodos que recebem o ID foram alinhados ao identificador inteiro já usado no PostgreSQL. Não há conversão destrutiva de IDs para UUID. Cookies, guards JWT e demais regras de autenticação não são corrigidos por estas migrations.

## Configuração

Configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` e `DB_SCHEMA` no `.env` do backend. `DB_SCHEMA` é obrigatório e deve ser um identificador simples (por exemplo, `museu`). Nunca versione credenciais.

O banco PostgreSQL precisa existir. O comando `migration:run` cria o schema configurado se ele não existir. A conta de migrations precisa poder criar schemas de referência e alterar os objetos do museu. Não é imposta a propriedade do schema ao usuário `admin` do DDL original.

`synchronize` permanece desligado. A CLI usa PostgreSQL, a mesma estratégia de nomes da aplicação e uma lista explícita de entidades ativas, evitando as classes antigas duplicadas. Ainda é necessário revisar qualquer SQL produzido por `migration:generate`: diferenças de modelos de outros módulos não devem resultar em remoção automática de dados do DDL.

## Banco existente

1. Faça um backup completo e restaurável, incluindo o schema do museu e eventuais objetos referenciados em `public`. Pare as gravações da aplicação durante a atualização.
2. Execute, a partir da pasta `nest_museu`:

```powershell
npm run migration:show
npm run migration:check
npm run migration:run
npm run migration:show
```

`show` é somente leitura e não cria tabela de histórico. `check` verifica a adoção da baseline e os vínculos de documentos; usa uma estrutura de referência em uma transação descartada, não registra migrations nem insere dados do museu. Não é um teste completo do login nem uma simulação de todas as regras da aplicação.

`run` aplica todas as pendentes em uma transação. Não use `--fake`, não apague o histórico existente e não execute o DDL exportado manualmente. A adoção da baseline é feita pela própria migration, depois da verificação, mesmo quando a migration de mídias tem um registro mais antigo na tabela de histórico.

Se houver divergência estrutural, a operação falha e informa o objeto. Se `documents.id_print` não existir no `prints` do museu ou corresponder a conteúdo diferente em outro schema, a correção também é bloqueada. Reconcilie esses casos antes de tentar novamente; o processo não apaga documentos para forçar a migração.

## Banco vazio

Crie o banco PostgreSQL, configure o `.env` e execute `npm run migration:run`. A base completa e os perfis serão criados; não são criadas contas de usuário nem senhas padrão. Um segundo `migration:run` não reaplica migrations já registradas.

## Validação e reversão

```powershell
npm run build
npm run test:migrations
```

Os testes usam schemas `museum_mig_test_*` isolados no PostgreSQL configurado e os removem ao final. Cobrem criação do zero, adoção antes/depois das mídias, preservação de dados, gravação pelo repositório TypeORM de sessões, execução repetida e bloqueio de divergências/referências inválidas. Não executam `synchronize` nem usam registros reais do museu.

`npm run migration:revert` existe, mas as novas migrations bloqueiam reversões que eliminariam tabelas, metadados ou vínculos. Prefira uma migration corretiva; em caso de recuperação, restaure o backup. O rollback automático da transação em caso de erro continua ativo.

Para uma distribuição compilada, o build inclui o SQL da baseline em `dist/database/baseline`. As migrations podem ser descobertas pelo DataSource compilado. O fluxo npm documentado usa `ts-node` e os arquivos de origem, portanto execute-o no ambiente de deploy que contenha as dependências de desenvolvimento, antes de iniciar o backend.
