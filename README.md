# Autoatendimento Secretaria Acadêmica - Fatec Jacareí

<p align="center">
  <img src="./arquivos/imagens/LogoKaymanByte.png"
       alt="Sai fora"
       style="max-width: 260px; width: 60%; height: auto;">
</p>

<p align="center">
  <a href="#descrição-do-projeto">Sobre o Projeto</a> |
  <a href="#entregas-de-sprints">Entrega de Sprints</a> |
  <a href="#recursos-do-produto">Engenharia de Software</a> |
  <a href="#equipe">Nossa Equipe</a>
</p>

## Descrição do Projeto

A Secretaria Acadêmica da Fatec Jacareí recebe diariamente um grande volume de dúvidas recorrentes de alunos e interessados externos, o que gera sobrecarga operacional, aumento no tempo de resposta e risco de inconsistências nas orientações — especialmente em períodos críticos como rematrícula, trancamentos e exames finais.

Para resolver esse problema, desenvolvemos uma aplicação web de autoatendimento baseada em um chatbot conversacional. O sistema guia o usuário por uma árvore de navegação estruturada com menus e perguntas guiadas, cobrindo os temas mais frequentes: horários de aulas, calendário acadêmico, estágio supervisionado, dispensas e aproveitamento de disciplinas, e estrutura curricular dos cursos.

Ao final de cada atendimento, o sistema apresenta uma resposta objetiva e padronizada, acompanhada — quando aplicável — de um trecho extraído diretamente de documentos oficiais como o Regulamento Geral das Fatecs, o Manual de Estágio, o Calendário Acadêmico e os PPCs dos cursos. Essa abordagem garante rastreabilidade, confiabilidade da informação e redução de ambiguidades no atendimento.

<a id="sprint"></a>
## Entregas de Sprints

Todas as entregas serão realizadas conforme os prazos acordados com o cliente. Para cada ciclo de desenvolvimento, será gerado um relatório completo por sprint e uma planilha de tarefas, na aba **Tasks**. A relação detalhada das sprints e tarefas é apresentada abaixo.

<div align="center">

| Sprint | Entrega       | Status |                 Relatório                  |                Apresentação                |
|------: |---------------|:------:|:------------------------------------------:|:------------------------------------------:|
| 1      | 📅 04/05/2026 | ✅     | [Sprint Review](./arquivos/produto/sprints/Sprint1) | - |
| 2      | 📅 Em definição | 🚧     | - | - |
| 3      | 📅 Em definição | `—`     | - | - |

</div>

**Legenda:**
- ✅ **Finalizada**
- 🚧 **Em Progresso**
- `—` **Não iniciado**

## Recursos do Produto 

- **Backlog do Produto com DoD e DoR:** [Acesse aqui](./arquivos/produto/BacklogProduto.md)
Detalhamento completo dos requisitos funcionais e não funcionais do projeto, incluindo User Stories, critérios de entrada (DoR) e critérios de conclusão (DoD) de cada requisito.
- **Backlog das Sprints:** [Acesse aqui](./arquivos/produto/sprints/BacklogSprints.md)
Lista completa de tasks do projeto, com identificador, descrição da atividade, pontuação em Fibonacci e rastreabilidade com os requisitos atendidos.
- **Diagrama de Casos de Uso:** [Acesse aqui](./arquivos/produto/diagramas/CasoUso.png)  
Representação visual das interações entre os atores do sistema e as principais funcionalidades da aplicação.


## Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + TypeScript + Express + JWT
- Banco de Dados: PostgreSQL
- Orquestração: Docker Compose

## Equipe

| Nome | Função | GitHub | LinkedIn |
|------|--------|--------|----------|
| Thiago Guedes | Product Owner | [Github](https://github.com/Thiago-Tolosa) | [LinkedIn](https://www.linkedin.com/in/thiago-guedes-4965b0390?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
| João Pedro | Scrum Master | [Github](https://github.com/JoaoPedroLuvisariSeveriano) | [LinkedIn](https://www.linkedin.com/in/jo%C3%A3o-pedro-luvisari-severiano-bb1aa9303/) |
| Erick Rost | Desenvolvedor | [Github](https://github.com/erickrost) | [LinkedIn](https://www.linkedin.com/in/erick-rost/) |
| Vitória Vargas | Desenvolvedor | [Github](https://github.com/vitvargas) | [LinkedIn](http://www.linkedin.com/in/vit%C3%B3ria-barbara-vargas-9b920b351) |
| Rafael Melo | Desenvolvedor | [Github](https://github.com/RafaelPMR) | [LinkedIn](https://www.linkedin.com/in/rafael-prado-de-melo-raimundo-55a150144?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app) |
| Gabriel Oliveira | Desenvolvddor  | [Github](https://github.com/GabrielOlsa) | [LinkedIn](https://www.linkedin.com/in/gabriel-oliveira-96013138b?utm_source=share_via&utm_content=profile&utm_medium=member_android) |


## Estrutura

- `backend/`: API HTTP com autenticação JWT, RBAC e módulos de negócio
- `frontend/`: Interface React para navegação do autoatendimento
- `database/`: DDL/DML (schema e seed)

## Como subir a aplicação com Docker Compose

Pré-requisitos:

- Docker Engine e Docker Compose instalados.

Passo a passo:

1. Confira ou ajuste as variáveis no arquivo `.env` na raiz do repositório.
2. Suba todos os containers:
   ```bash
   docker compose up --build -d
   ```
3. Verifique se os serviços estão em execução:
   ```bash
   docker compose ps
   ```
4. Para acompanhar logs:
   ```bash
   docker compose logs -f
   ```
5. Para parar o ambiente:
   ```bash
   docker compose down
   ```

## URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- pgAdmin: `http://localhost:5050`
- Healthcheck backend: `http://localhost:3000/health`

## Banco via Rede Interna

- A comunicação ocorre pela rede interna Docker `internal_net` (host `postgres`).
- Para administração do banco, utilize o pgAdmin.
- Configuração no pgAdmin:
  - Host: `postgres`
  - Port: `5432`
  - User: `secretaria_user`
  - Password: `secretaria_pass`
- Para acesso direto no host (ex.: DBeaver/psql), use:
  - Host: `localhost`
  - Port: `5433` (ou valor de `POSTGRES_PORT`)

## Usuários iniciais (seed)

- Admin: `admin@fatec.sp.gov.br` / `Admin@123`
- Secretária: `secretaria@fatec.sp.gov.br` / `Secretaria@123`



