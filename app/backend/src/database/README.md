# Scripts SQL do banco de dados

Esta pasta documenta os comandos SQL explícitos do banco relacional utilizado pelo projeto Conecta Fatec Jacareí.

A aplicação continua utilizando Sequelize em runtime para criação, sincronização e manipulação dos dados durante a execução local. Mesmo assim, os scripts desta pasta foram adicionados para deixar claras as operações DDL e DML exigidas na avaliação da disciplina de Banco de Dados Relacional.

## Arquivos

- `01_schema.sql`: define os comandos DDL principais, incluindo criação de tipos, tabelas, chaves primárias e chaves estrangeiras.
- `02_seed.sql`: define comandos DML de carga inicial, com usuário administrativo e registros mínimos de exemplo.
- `03_indexes_constraints.sql`: define índices explícitos para consultas frequentes e reforça a otimização inicial do modelo.

## Observações

Os nomes das tabelas e colunas seguem a estrutura atualmente gerada pelos models Sequelize do projeto. Por isso, algumas tabelas utilizam nomes com letras maiúsculas e aspas, como `"Users"` e `"Nodes"`.

As tabelas de documentos oficiais, chunks e metadados de fonte não foram incluídas porque essa funcionalidade foi retirada do escopo final do projeto após alinhamento com o professor e com o cliente.

## Ordem sugerida para execução manual

```sql
\i 01_schema.sql
\i 02_seed.sql
\i 03_indexes_constraints.sql
```

Em ambiente Docker/local, o fluxo principal do projeto permanece sendo executado pelo backend com Sequelize.
