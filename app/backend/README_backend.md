# Backend

## Responsabilidade da pasta

A pasta `app/backend` contém a API HTTP do sistema de autoatendimento. Este módulo concentra as regras de negócio, autenticação, autorização, persistência de dados e integração entre o frontend e o banco PostgreSQL.

O backend é responsável por:

- autenticar usuários administrativos com JWT;
- proteger rotas administrativas por perfil de acesso;
- gerenciar nós da árvore de atendimento;
- registrar logs de interação e navegação;
- receber e administrar dúvidas enviadas pelos usuários;
- inicializar dados básicos do sistema;
- expor endpoints consumidos pelo frontend.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Sequelize
- PostgreSQL
- JWT
- bcrypt
- Zod
- Swagger
- Vitest

## Organização interna

```text
app/backend/
├── src/                         # Código-fonte principal da API
│   ├── config/                  # Configurações de banco, seed e Swagger
│   ├── controllers/             # Camada de entrada das requisições HTTP
│   ├── database/                # Scripts SQL de schema, seed, índices e constraints
│   ├── errors/                  # Classes e estruturas de erro da aplicação
│   ├── middleware/              # Middlewares de autenticação, autorização e validação
│   ├── models/                  # Models Sequelize e relacionamentos
│   ├── routes/                  # Definição das rotas HTTP da API
│   ├── services/                # Regras de negócio e orquestração dos casos de uso
│   ├── utils/                   # Utilitários auxiliares
│   ├── index.ts                 # Ponto de configuração da aplicação Express
│   └── server.ts                # Inicialização do servidor HTTP
├── tests/                       # Testes automatizados
├── Dockerfile                   # Build e execução do backend em container
├── package.json                 # Dependências e scripts do backend
├── tsconfig.json                # Configuração TypeScript
└── vitest.config.ts             # Configuração dos testes
```

## Camadas principais

- `routes`: definem os endpoints disponíveis.
- `controllers`: recebem requisições, validam entradas e encaminham o fluxo.
- `services`: concentram regras de negócio e operações principais.
- `models`: representam as entidades persistidas no PostgreSQL.
- `middleware`: executam autenticação, autorização e validação antes dos controllers.
- `database`: documenta e versiona scripts SQL usados como referência da estrutura relacional.

## Variáveis de ambiente

As variáveis de ambiente são carregadas a partir dos arquivos `.env` usados no projeto e pelo `docker-compose.yml`. Entre as principais variáveis estão:

```text
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
JWT_SECRET
JWT_EXPIRES_IN
FRONTEND_URL
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
```

## Scripts úteis

Executar em desenvolvimento:

```bash
npm run dev
```

Gerar build TypeScript:

```bash
npm run build
```

Executar build gerado:

```bash
npm start
```

Sincronizar banco via Sequelize:

```bash
npm run db:sync
```

## Execução com Docker Compose

No fluxo principal do projeto, o backend é executado junto ao banco, pgAdmin e frontend a partir da pasta `app`:

```bash
cd app
docker compose up --build -d
```

Após a inicialização, a API fica disponível em:

```text
http://localhost:3001
```

Endpoint de verificação:

```text
http://localhost:3001/health
```
