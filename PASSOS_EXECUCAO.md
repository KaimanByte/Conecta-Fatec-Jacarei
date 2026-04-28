# Passo a Passo para Execução do Projeto Chatbot Acadêmico

## Pré-requisitos
- **Docker e Docker Compose** instalados e rodando.
- **Node.js (v20+)** e **npm** (para desenvolvimento local ou instalação manual).
- Editor de texto (VS Code recomendado).

**Nota:** O projeto está em desenvolvimento (veja [TODO.md](TODO.md)). Algumas funcionalidades podem estar incompletas.

## 1. Método Recomendado: Docker Compose (Completo e Isolado)

1. Abra o terminal na pasta raiz do projeto:
   ```
   cd "c:/Users/jpkar/Documents/Fatec Matérias/2 Periodo/ABP/chatbot-academico"
   ```

2. Copie e configure o arquivo de ambiente:
   ```
   copy .env.example .env
   ```
   - Abra `.env` e configure:
     - Credenciais do banco (DB_HOST=postgres, DB_NAME=chatbot_academico, DB_USER=postgres, DB_PASSWORD=postgres).
     - `JWT_SECRET=sua_chave_secreta_aqui` (gere uma forte, ex: use `openssl rand -hex 32`).
     - Outras vars se necessário (veja .env.example).

3. Construa e execute os serviços:
   ```
   docker compose up --build
   ```
   - Isso inicia:
     | Serviço | Porta | Descrição |
     |---------|-------|-----------|
     | frontend | http://localhost:3000 | Interface React do Chatbot |
     | backend | http://localhost:3001 | API Node.js/Express |
     | postgres | 5432 | Banco de dados PostgreSQL |

4. Acesse:
   - **Frontend/Chatbot:** [http://localhost:3000](http://localhost:3000)
   - **API Docs (se disponível):** [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

5. Para parar: `Ctrl+C` ou `docker compose down`. Para limpar volumes (reset DB): `docker compose down -v`.

## 2. Método Alternativo: Desenvolvimento Local (Sem Docker)

1. Inicie o PostgreSQL localmente (DB: chatbot_academico, user: postgres, pw: postgres).

2. Backend:
   ```
   cd backend
   npm install
   copy ..\chatbot-academico\.env.example .env  # configure .env
   npm run dev  # ou npm run build && npm start
   ```

3. Frontend (nova aba):
   ```
   cd frontend
   npm install
   npm run dev
   ```

## 3. Comandos Úteis
- Backend DB sync (dev): `cd backend && npm run db:sync` (cuidado: force=true apaga dados!).
- Logs: `docker compose logs -f backend` ou `docker compose logs -f`.
- Rebuild: `docker compose up --build --force-recreate`.

## 4. Solução de Problemas
- **Portas ocupadas:** Mude ports no `docker-compose.yml`.
- **DB conexão falha:** Verifique .env e `docker compose logs postgres`.
- **Dependências:** `npm ci` em backend/frontend para instalação limpa.
- **Projeto incompleto:** Complete tarefas em [TODO.md](TODO.md).

## Estrutura do Projeto
```
chatbot-academico/
├── backend/     # Node/TS/Express/Sequelize
├── frontend/    # React/Vite/Tailwind
├── docker-compose.yml
├── .env.example
├── README.md
└── TODO.md
```

Veja [README.md](README.md) para mais detalhes.
