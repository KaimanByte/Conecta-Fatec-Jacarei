| ID | Atividade | Pontuação | Requisito Atendido |
|---|-----------|:---------:|-------------------|
| T01 | Modelar diagrama de navegação (nós, subnós e fluxos) | 3 | RF01 |
| T02 | Criar DDL das tabelas de nós de navegação no PostgreSQL | 2 | RF01, RF02 |
| T03 | Implementar API REST de consulta de nós (GET /nodes) | 3 | RF01 |
| T04 | Implementar lógica de navegação condicional no backend | 5 | RF01 |
| T05 | Desenvolver componente de chatbot no frontend (React/TS) | 8 | RF01 |
| T06 | Integrar componente de chatbot com a API de nós | 3 | RF01 |
| T07 | Implementar fallback de navegação (caminho sem resposta) | 2 | RF01 |
| T08 | Criar DDL das tabelas de documentos, chunks e metadados | 3 | RF02 |
| T09 | Popular banco com amostra de documentos oficiais (DML) | 3 | RF02 |
| T10 | Implementar indexação de trechos (chunks) com metadados | 5 | RF02 |
| T11 | Implementar API de consulta de trechos (GET /chunks) | 3 | RF02 |
| T12 | Implementar exibição de trecho de evidência no frontend | 3 | RF02 |
| T13 | Criar DDL da tabela de usuários com campo de role | 2 | RF03, RF09 |
| T14 | Popular banco com usuários de teste para cada role (DML) | 1 | RF03 |
| T15 | Implementar endpoint de login (POST /auth/login) | 3 | RF09 |
| T16 | Implementar geração e assinatura de JWT (user ID, role, expiração) | 3 | RF09, RNF08 |
| T17 | Implementar logout no frontend (remoção do token) | 1 | RF09 |
| T18 | Armazenar senhas com hash bcrypt | 2 | RF09, RNF09 |
| T19 | Configurar variáveis de ambiente para chaves sensíveis | 1 | RNF09 |
| T20 | Implementar middleware de autenticação JWT no backend | 3 | RF11, RNF08 |
| T21 | Implementar middleware de autorização por role (RBAC) | 3 | RF10 |
| T22 | Mapear e proteger todas as rotas administrativas | 2 | RF10, RF11 |
| T23 | Retornar HTTP 401 para token ausente e 403 para role incorreta | 2 | RF10, RF11 |
| T24 | Implementar guard de rotas no frontend por role | 2 | RF03, RF10 |
| T25 | Desenvolver tela de login (React/TS) | 2 | RF09 |
| T26 | Criar DDL da tabela de perguntas encaminhadas à secretaria | 2 | RF05 |
| T27 | Implementar endpoint de envio de pergunta (POST /questions) | 3 | RF05 |
| T28 | Desenvolver formulário de envio de pergunta no frontend | 3 | RF05 |
| T29 | Implementar validação de e-mail e texto no formulário | 2 | RF05 |
| T30 | Exibir confirmação visual após envio da pergunta | 1 | RF05 |
| T31 | Implementar endpoint de listagem de perguntas (GET /questions) | 2 | RF06 |
| T32 | Implementar endpoint de atualização de status (PATCH /questions/:id) | 2 | RF06 |
| T33 | Desenvolver tela de gestão de perguntas para Secretária | 5 | RF06 |
| T34 | Implementar filtro por status na listagem de perguntas | 2 | RF06 |
| T35 | Criar DDL da tabela de avaliações de satisfação | 1 | RF07 |
| T36 | Implementar endpoint de registro de avaliação (POST /ratings) | 2 | RF07 |
| T37 | Desenvolver componente de avaliação no frontend (Gostei/Não gostei) | 2 | RF07 |
| T38 | Garantir registro único de avaliação por atendimento | 2 | RF07 |
| T39 | Criar DDL da tabela de logs de atendimento | 2 | RF08 |
| T40 | Implementar registro automático de log a cada interação | 3 | RF08 |
| T41 | Vincular pergunta e avaliação ao log do atendimento | 2 | RF08 |
| T42 | Implementar endpoint de consulta de logs (GET /logs) | 2 | RF08 |
| T43 | Desenvolver tela de visualização de logs para Administrador | 5 | RF04, RF08 |
| T44 | Implementar CRUD de nós de navegação no backend | 5 | RF04 |
| T45 | Desenvolver tela de gestão de nós no frontend (Admin) | 5 | RF04 |
| T46 | Implementar CRUD de documentos oficiais no backend | 5 | RF04 |
| T47 | Desenvolver tela de gestão de documentos no frontend (Admin) | 5 | RF04 |
| T48 | Implementar CRUD de usuários Secretária Acadêmica no backend | 3 | RF04 |
| T49 | Desenvolver tela de gestão de usuários no frontend (Admin) | 3 | RF04 |
| T50 | Implementar registro de auditoria de ações do administrador | 3 | RF04, RF08 |
| T51 | Configurar container Docker para o PostgreSQL | 2 | RNF05 |
| T52 | Configurar container Docker para o backend (Node.js/TS) | 2 | RNF05 |
| T53 | Configurar container Docker para o frontend (React/TS) | 2 | RNF05 |
| T54 | Criar arquivo docker-compose.yml com os três containers | 3 | RNF06 |
| T55 | Validar inicialização do ambiente com comando único | 1 | RNF06 |
| T56 | Garantir responsividade da interface em mobile e desktop | 3 | RNF01 |
| T57 | Validar tempos de resposta das principais rotas da API | 2 | RNF02 |
| T58 | Escrever documento de visão geral do projeto | 2 | RNF03 |
| T59 | Elaborar modelo de dados (DER/diagrama de tabelas) | 3 | RNF03 |
| T60 | Descrever arquitetura do sistema | 2 | RNF03 |
| T61 | Documentar rotas e endpoints da API | 3 | RNF03 |
| T62 | Elaborar Diagrama de Casos de Uso (UML) | 2 | RNF04 |
| T63 | Elaborar Diagrama de Classes (UML) | 3 | RNF04 |
| T64 | Elaborar Diagrama de Sequência (UML) | 3 | RNF04 |
| T65 | Elaborar Diagrama de Componentes (UML) | 2 | RNF04 |
| T66 | Criar README principal na raiz do repositório | 1 | RNF07 |
| T67 | Criar README específico para cada pasta principal | 2 | RNF07 |
| T68 | Escrever instruções de execução do projeto | 1 | RNF07 |