# Backlog por Sprint — Autoatendimento Secretaria Acadêmica Fatec Jacareí

> **3 sprints · 60 tasks**

---

## Sprint 1 — MVP completo (chatbot do aluno + painel da secretária + login simples)

> Objetivo: aluno navega pelo chatbot, envia pergunta quando não acha o que quer e avalia o atendimento. Secretária consegue fazer login e visualizar e gerenciar as perguntas recebidas.

**Total Sprint 1: 51 pts**


| ID | Atividade | Pontos | Área | Requisito |
|----|-----------|:------:|------|-----------|
| T01 | Fazer o wireframe da tela inicial do chatbot (lista de opções principais) | 2 | Design | RF01 |
| T02 | Fazer o wireframe dos submenus do chatbot (navegação passo a passo) | 2 | Design | RF01 |
| T03 | Fazer o wireframe da tela de resposta final do chatbot | 1 | Design | RF01 |
| T04 | Fazer o wireframe do formulário para enviar pergunta à secretaria | 1 | Design | RF05 |
| T05 | Fazer o wireframe do botão de avaliação (Gostei / Não gostei) | 1 | Design | RF07 |
| T06 | Fazer o wireframe da tela de login | 1 | Design | RF09 |
| T07 | Fazer o wireframe do painel da secretária (lista de perguntas recebidas) | 2 | Design | RF06 |
| T11 | Definir as cores, fontes e estilos do projeto no Figma (design system básico) | 3 | Design | RNF01 |
| T13 | Validar os wireframes com o grupo e ajustar conforme feedback | 1 | Design | RNF01 |
| T14 | Criar a rota GET para listar os nós de navegação | 2 | Backend | RF01 |
| T15 | Criar as rotas POST, PUT e DELETE para gerenciar nós de navegação | 3 | Backend | RF01, RF04 |
| T19 | Criar a rota POST para receber e salvar a pergunta do aluno | 2 | Backend | RF05 |
| T20 | Criar a rota GET para listar as perguntas (para a secretária) | 2 | Backend | RF06 |
| T21 | Criar a rota PATCH para atualizar o status de uma pergunta | 2 | Backend | RF06 |
| T22 | Criar a rota POST para salvar a avaliação de satisfação | 2 | Backend | RF07 |
| T26 | Configurar variáveis de ambiente (.env) para dados sensíveis | 1 | Backend | RNF09 |
| T34 | Criar o componente de chatbot que mostra as opções do menu principal | 3 | Frontend | RF01 |
| T35 | Fazer o chatbot navegar pelos submenus conforme a escolha do aluno | 3 | Frontend | RF01 |
| T36 | Mostrar a resposta final ao aluno no chatbot | 2 | Frontend | RF01 |
| T37 | Criar o formulário para o aluno enviar pergunta à secretaria | 2 | Frontend | RF05 |
| T38 | Mostrar confirmação visual depois que o aluno enviar a pergunta | 1 | Frontend | RF05 |
| T39 | Criar o componente de avaliação (Gostei / Não gostei) no fim do atendimento | 2 | Frontend | RF07 |
| T40 | Criar a tela de login com campos de usuário e senha | 2 | Frontend | RF09 |
| T43 | Criar a lista de perguntas recebidas no painel da secretária | 3 | Frontend | RF06 |
| T44 | Criar o botão para a secretária atualizar o status de uma pergunta | 2 | Frontend | RF06 |
| T50 | Desenhar o diagrama de casos de uso | 3 | UML | RNF04 |


---

## Sprint 2 — Painel do administrador + autenticação + responsividade + protótipo Figma

> Objetivo: autenticação real funcionando, administrador consegue gerenciar nós e usuários e sistema funciona bem no celular.

**Total Sprint 2: 44 pts**


| ID | Atividade | Pontos | Área | Requisito |
|----|-----------|:------:|------|-----------|
| T08 | Fazer o wireframe do painel do administrador — parte de nós de navegação | 2 | Design | RF04 |
| T09 | Fazer o wireframe do painel do administrador — parte de documentos | 2 | Design | RF04 |
| T10 | Fazer o wireframe do painel do administrador — parte de usuários e logs | 2 | Design | RF04, RF08 |
| T12 | Montar o protótipo navegável no Figma com o fluxo completo do aluno | 3 | Design | RF01–RF07 |
| T23 | Criar o serviço que grava o log de cada atendimento automaticamente | 3 | Backend | RF08 |
| T24 | Criar a rota GET para o administrador consultar os logs | 2 | Backend | RF08 |
| T29 | Salvar a senha do usuário com hash bcrypt no banco | 2 | Auth | RF09, RNF09 |
| T31 | Criar o middleware que verifica se o token JWT é válido em rotas protegidas | 3 | Auth | RF11 |
| T32 | Criar o middleware que verifica o papel do usuário (admin, secretária) antes de liberar a rota | 3 | Auth | RF10 |
| T33 | Testar acessos indevidos e confirmar que retorna 401 e 403 corretamente | 2 | Auth | RF10, RF11 |
| T41 | Salvar o token JWT no cliente após o login e redirecionar conforme o papel | 2 | Frontend | RF09 |
| T42 | Bloquear o acesso a páginas protegidas se o usuário não estiver logado | 2 | Frontend | RF10, RF11 |
| T45 | Criar a tela de gerenciamento de nós no painel do administrador | 3 | Frontend | RF04 |
| T48 | Criar a tela de visualização de logs no painel do administrador | 2 | Frontend | RF08 |
| T49 | Garantir que todas as telas funcionem bem no celular (responsividade) | 3 | Frontend | RNF01 |
| T51 | Desenhar o diagrama de classes | 3 | UML | RNF04 |
| T27 | Criar a rota POST /auth/login que valida usuário e senha | 2 | Auth | RF09 |
| T28 | Gerar o token JWT com ID do usuário, papel (role) e prazo de validade | 2 | Auth | RF09, RNF08 |
| T30 | Criar o logout (remover o token no lado do cliente) | 1 | Auth | RF09 |



---

## Sprint 3 — Documentos + chunks + UML + documentação final

> Objetivo: funcionalidade de busca em documentos entregue, autenticação totalmente finalizada, diagramas restantes e toda a documentação técnica prontos para apresentação.

**Total Sprint 3: 41 pts**
s

| ID | Atividade | Pontos | Área | Requisito |
|----|-----------|:------:|------|-----------|
| T16 | Criar a rota para fazer upload de documento e salvar no banco | 3 | Backend | RF02, RF04 |
| T17 | Criar o serviço que divide o documento em partes menores para busca (chunks) | 5 | Backend | RF02 |
| T18 | Criar a rota de busca que retorna os trechos relevantes de um documento | 3 | Backend | RF02 |
| T52 | Desenhar o diagrama de sequência | 3 | UML | RNF04 |
| T53 | Desenhar o diagrama de componentes | 3 | UML | RNF04 |
| T54 | Escrever o documento de visão geral do projeto | 2 | Docs | RNF03 |
| T55 | Documentar o modelo de dados com o diagrama ER | 2 | Docs | RNF03 |
| T56 | Escrever a descrição da arquitetura do sistema | 2 | Docs | RNF03 |
| T57 | Documentar todas as rotas e endpoints da API | 3 | Docs | RNF03 |
| T58 | Escrever o README principal do repositório | 1 | Docs | RNF07 |
| T59 | Escrever os READMEs das pastas backend e frontend com instruções de execução | 2 | Docs | RNF07 |
| T60 | Documentar os testes unitários realizados no projeto | 3 | Docs | — |
| T46 | Criar a tela de upload e gerenciamento de documentos no painel do administrador | 3 | Frontend | RF04 |
| T47 | Criar a tela de gerenciamento de usuários (secretárias) no painel do administrador | 3 | Frontend | RF04 |
| T25 | Criar as rotas CRUD de usuários do perfil secretária | 3 | Backend | RF04 |



---

## Resumo

| Sprint | Foco | Tasks | Pontos |
|--------|------|:-----:|:------:|
| Sprint 1 | MVP — chatbot + painel da secretária + login | 26 | 51 |
| Sprint 2 | Painel admin + autenticação + responsividade | 19 | 48 |
| Sprint 3 | Documentos/chunks + auth finalizada + UML + docs | 15 | 37 |
| **Total** | | **60** | **136** |