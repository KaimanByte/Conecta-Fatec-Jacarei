# Backlog do Produto — Autoatendimento Secretaria Acadêmica Fatec Jacareí

---

## RF01 — Navegação Conversacional

**Detalhamento**
O sistema deve disponibilizar navegação por menus e submenus hierárquicos, em modelo de chatbot, com fluxo condicionado às escolhas realizadas pelo usuário e baseado em dados armazenados no banco de dados.

**User Stories**
- Como aluno, quero navegar por menus de chatbot para encontrar informações acadêmicas sem precisar falar com a secretaria.
- Como aluno, quero que o sistema me guie por submenus hierárquicos para que eu chegue à resposta correta passo a passo.
- Como aluno, quero receber uma resposta objetiva ao final do fluxo para que minha dúvida seja resolvida de forma clara.
- Como aluno, quero que o fluxo de navegação seja armazenado no banco de dados para que as opções reflitam o conteúdo atualizado.

**DoR**
- Fluxo de navegação mapeado em diagrama (mín. 3 cenários aprovados pelo PO).
- Lista de nós iniciais e subnós definida e validada pela secretaria.
- Requisitos de UI/UX para o componente de chat definidos (wireframes aprovados).
- Estrutura de dados dos nós especificada e revisada.
- Critérios de aceitação documentados, incluindo cenários de fallback.

**DoD**
- Fluxo implementado no backend (API de nós) e frontend (componente de chat).
- Navegação condicional funciona conforme escolhas do usuário.
- Testes automatizados cobrindo os 3 cenários mapeados.
- Logs de navegação registram cada nó visitado com timestamp.
- Navegação validada em QA e aceita pelo PO.
- Interface responsiva em desktop e mobile.

---

## RF02 — Repositório de Conhecimento

**Detalhamento**
O sistema deve manter um repositório estruturado contendo: nós de navegação, perguntas e respostas padronizadas, documentos oficiais, trechos indexados (chunks) e metadados da fonte (documento, página, seção/âncora).

**User Stories**
- Como aluno, quero que as respostas sejam baseadas em documentos oficiais para ter confiança nas informações recebidas.
- Como aluno, quero visualizar o trecho do documento que originou a resposta para poder verificar a informação.
- Como administrador, quero que documentos sejam indexados em chunks para que consultas retornem trechos relevantes com metadados.
- Como administrador, quero que o repositório armazene metadados de fonte (documento, página, seção) para garantir rastreabilidade.

**DoR**
- Modelo de dados para nós, Q&A, documentos e chunks definido e aprovado.
- Formato de metadados (documento, página, seção/âncora) especificado.
- Estratégia de indexação de chunks escolhida e documentada.
- Amostra de documentos oficiais disponível para ingestão inicial.

**DoD**
- Repositório criado no banco de dados com DDL/DML documentados.
- Amostra de documentos ingerida e indexada com metadados.
- API de consulta ao repositório implementada e testada.
- Buscas retornam trechos com metadados corretos (documento, página, seção).
- Documentação da estrutura de dados entregue.

---

## RF03 — Perfis de Usuário

**Detalhamento**
O sistema deve contemplar três perfis: Aluno (acesso público, sem autenticação), Secretária Acadêmica (acesso autenticado) e Administrador (acesso autenticado).

**User Stories**
- Como aluno, quero acessar o chatbot sem me autenticar para que o atendimento seja rápido e acessível.
- Como secretária acadêmica, quero acessar a área restrita com login e senha para gerenciar perguntas dos alunos.
- Como administrador, quero ter acesso total ao sistema mediante autenticação para gerenciar conteúdo e usuários.
- Como administrador, quero que cada perfil acesse apenas as funcionalidades permitidas para garantir segurança e organização.

**DoR**
- Lista de roles (Aluno, Secretária, Administrador) e permissões definidas e documentadas.
- Requisitos de acesso por role documentados (rotas e funcionalidades por perfil).
- Fluxos de login e logout especificados para perfis autenticados.
- Contas de teste para cada role definidas para uso em QA.

**DoD**
- Roles implementadas no backend com RBAC ativo.
- Telas e rotas exibem conteúdo conforme role autenticada.
- Perfil Aluno acessa o chatbot sem autenticação.
- Testes de autorização executados para os três perfis.
- Contas de teste criadas e validadas em QA.

---

## RF04 — Gestão de Conteúdo (Administrador)

**Detalhamento**
O administrador deve poder: criar, editar e excluir nós de navegação; gerenciar documentos oficiais; gerenciar usuários do perfil Secretária Acadêmica; visualizar os logs de navegação.

**User Stories**
- Como administrador, quero criar, editar e excluir nós de navegação para manter o chatbot sempre atualizado.
- Como administrador, quero fazer upload e gerenciar documentos oficiais para que o repositório de conhecimento esteja correto.
- Como administrador, quero cadastrar, editar e remover usuários do perfil Secretária Acadêmica para controlar o acesso ao sistema.
- Como administrador, quero visualizar os logs de navegação para entender como os alunos interagem com o sistema.

**DoR**
- Requisitos de CRUD para nós de navegação e documentos especificados.
- Permissões administrativas definidas (somente Admin acessa esta área).
- Wireframes da interface de administração aprovados pelo PO.
- Campos e validações do formulário de gestão de usuários definidos.

**DoD**
- CRUD funcional para nós de navegação implementado e testado.
- CRUD funcional para documentos oficiais implementado e testado.
- Gestão de usuários Secretária Acadêmica implementada (criar, listar, remover).
- Visualização de logs disponível na interface admin.
- Validações e mensagens de erro implementadas em todos os formulários.
- Auditoria de alterações registrada.
- UI de administração testada e aceita pelo PO.

---

## RF05 — Encaminhamento de Pergunta à Secretaria

**Detalhamento**
Ao final da navegação, o usuário deve poder enviar uma pergunta à Secretaria Acadêmica informando: texto da dúvida e e-mail institucional para resposta.

**User Stories**
- Como aluno, quero enviar minha dúvida diretamente para a secretaria quando o chatbot não resolver meu problema.
- Como aluno, quero informar meu e-mail institucional para que a secretaria possa me responder.
- Como aluno, quero receber uma confirmação visual ao enviar minha pergunta para saber que ela foi registrada.

**DoR**
- Campos do formulário definidos: texto da dúvida e e-mail institucional.
- Validações especificadas (e-mail válido, texto não vazio).
- Momento de exibição definido (ao final do fluxo de navegação).
- Modelo de persistência da pergunta no banco de dados aprovado.

**DoD**
- Formulário disponível ao final do fluxo de chatbot.
- Perguntas persistidas no banco de dados com metadados (data, hora, fluxo percorrido).
- Validações de campo funcionando (e-mail inválido exibe mensagem de erro).
- Confirmação visual exibida ao usuário após envio bem-sucedido.

---

## RF06 — Gestão de Perguntas (Secretária Acadêmica)

**Detalhamento**
O perfil de Secretária Acadêmica deve poder: listar as perguntas enviadas pelos usuários; atualizar o status da pergunta (ex.: em aberto, respondida).

**User Stories**
- Como secretária acadêmica, quero visualizar a lista de perguntas enviadas pelos alunos para gerenciar o atendimento.
- Como secretária acadêmica, quero filtrar perguntas por status para priorizar as que ainda não foram respondidas.
- Como secretária acadêmica, quero atualizar o status de uma pergunta para registrar o andamento do atendimento.

**DoR**
- Campos de listagem definidos (texto, e-mail, data, status).
- Estados de pergunta mapeados: em aberto, em andamento, respondida.
- Requisitos de filtro e ordenação especificados.
- Permissões definidas (somente Secretária e Admin acessam esta área).

**DoD**
- Interface de listagem de perguntas implementada e funcional.
- Filtros por status funcionando corretamente.
- Atualização de status persistida no banco de dados.
- Logs de ação da secretária registrados (quem alterou e quando).
- Interface testada com perfil Secretária em QA.

---

## RF07 — Avaliação de Satisfação

**Detalhamento**
O sistema deve permitir que o usuário registre seu nível de satisfação com a interação (ex.: "Gostei" / "Não gostei").

**User Stories**
- Como aluno, quero avaliar minha experiência com o chatbot ao final do atendimento para contribuir com a melhoria do sistema.
- Como administrador, quero visualizar as avaliações registradas para medir a qualidade do atendimento.

**DoR**
- Opções de avaliação definidas ("Gostei" / "Não gostei" ou equivalente).
- Momento de exibição especificado (ao final do atendimento).
- Modelo de persistência da avaliação no banco de dados definido.

**DoD**
- Botão de avaliação exibido ao final do atendimento.
- Avaliação persistida no banco de dados com timestamp e referência ao atendimento.
- Avaliação registrada apenas uma vez por atendimento (sem duplicidade).
- Dados de satisfação visíveis nos logs do administrador.

---

## RF08 — Registro de Logs de Atendimento

**Detalhamento**
O sistema deve registrar logs de atendimento contendo: fluxo completo de navegação, perguntas enviadas à secretaria, registro de satisfação e data e horário da interação.

**User Stories**
- Como administrador, quero visualizar o fluxo completo de navegação de cada atendimento para entender a jornada dos alunos.
- Como administrador, quero que perguntas enviadas à secretaria e avaliações de satisfação fiquem vinculadas ao log do atendimento.
- Como administrador, quero que cada log tenha data e hora registrados para rastrear os atendimentos cronologicamente.

**DoR**
- Campos de log definidos: fluxo de nós visitados, perguntas enviadas, satisfação, timestamps e identificador do atendimento.
- Política de retenção de logs aprovada pelo PO.
- Modelo de armazenamento de logs definido (tabela no banco de dados).

**DoD**
- Logs gravados automaticamente a cada interação.
- Logs contêm todos os campos definidos no DoR.
- Interface de consulta de logs disponível para o Administrador.
- Amostra de logs validada em QA.
- Conformidade com a política de retenção verificada.

---

## RF09 — Autenticação

**Detalhamento**
O sistema deve implementar autenticação por login e senha para os perfis Secretária Acadêmica e Administrador. O perfil Aluno deve permanecer com acesso público sem autenticação.

**User Stories**
- Como secretária acadêmica, quero fazer login com usuário e senha para acessar a área restrita com segurança.
- Como administrador, quero fazer login com usuário e senha para acessar o painel administrativo.
- Como usuário autenticado, quero fazer logout para encerrar minha sessão com segurança.
- Como aluno, quero acessar o chatbot sem precisar criar conta ou fazer login.

**DoR**
- Fluxo de autenticação (login/logout) definido e aprovado.
- Requisitos de senha definidos (tamanho mínimo, complexidade).
- Esquema JWT especificado: user ID, role e tempo de expiração.
- Endpoints de autenticação especificados (ex.: POST /auth/login).

**DoD**
- Endpoint de login implementado, retornando JWT válido.
- Senha armazenada com hash bcrypt no banco de dados.
- JWT contém user ID, role e tempo de expiração.
- Logout implementado (invalidação de token no cliente).
- Testes de login/logout realizados para os dois perfis autenticados.
- Aluno acessa o chatbot sem autenticação.

---

## RF10 — Autorização por Papel (RBAC)

**Detalhamento**
O sistema deve implementar controle de acesso baseado em papéis (RBAC), garantindo: apenas Administrador gerencia conteúdo e usuários; apenas Secretária gerencia perguntas; usuários não autenticados não acessam rotas administrativas.

**User Stories**
- Como administrador, quero que somente usuários com role Admin acessem funcionalidades de gestão de conteúdo.
- Como secretária acadêmica, quero que somente usuários com role Secretária acessem a gestão de perguntas.
- Como sistema, quero bloquear acessos não autorizados a rotas protegidas para garantir a segurança dos dados.

**DoR**
- Matriz de permissões por role documentada e aprovada.
- Endpoints sensíveis identificados e classificados por nível de acesso.
- Políticas de acesso definidas para cada role.

**DoD**
- RBAC aplicado no backend para todas as rotas protegidas.
- Tentativas de acesso indevido retornam HTTP 401/403 com mensagem adequada.
- Testes de autorização realizados para cada role (incluindo tentativas indevidas).
- Logs de tentativas de acesso não autorizado registrados.

---

## RF11 — Proteção de Rotas

**Detalhamento**
As rotas administrativas do backend devem estar protegidas por middleware de autenticação e autorização, com validação obrigatória do token antes da liberação de acesso.

**User Stories**
- Como sistema, quero validar o token JWT em toda requisição a rotas protegidas para impedir acessos não autorizados.
- Como administrador, quero que rotas administrativas exijam token válido para que dados sensíveis sejam protegidos.
- Como desenvolvedor, quero um middleware centralizado de autenticação para que a proteção seja consistente em todas as rotas.

**DoR**
- Lista de rotas administrativas e suas regras de proteção definidas.
- Middleware de autenticação e autorização especificado (validação de JWT e verificação de role).
- Comportamento esperado para token inválido ou ausente definido (HTTP 401/403).

**DoD**
- Middleware implementado e aplicado a todas as rotas protegidas.
- Rotas retornam 401 sem token e 403 com token de role incorreta.
- Testes automatizados de proteção de rotas executados e aprovados.
- Middleware documentado na descrição de endpoints da API.

<br>

## RNF01 — Usabilidade e Responsividade

**Detalhamento**
A interface deve ser simples, clara e responsiva, adequada ao uso em navegadores e dispositivos móveis.

---

## RNF02 — Desempenho

**Detalhamento**
O tempo de resposta deve ser adequado ao uso interativo, incluindo consultas ao banco de dados e recuperação de trechos documentais.

---

## RNF03 — Documentação Técnica do Projeto

**Detalhamento**
O projeto deve conter, no mínimo:
- Documento de visão geral;
- Modelo de dados;
- Descrição da arquitetura;
- Instruções de execução;
- Descrição das rotas/endpoints da API.

---

## RNF04 — Modelagem UML

**Detalhamento**
O projeto deve incluir, no mínimo:
- Diagrama de Casos de Uso;
- Diagrama de Classes;
- Diagrama de Sequência;
- Diagrama de Componentes.

---

## RNF05 — Containerização

**Detalhamento**
O sistema deve ser executado de forma containerizada utilizando Docker, com no mínimo três containers:
- PostgreSQL;
- Backend;
- Frontend.

---

## RNF06 — Orquestração de Containers

**Detalhamento**
O sistema deve utilizar ferramenta de orquestração (ex.: Docker Compose), permitindo inicialização do ambiente com comando único.

---

## RNF07 — Documentação do Repositório

**Detalhamento**
O repositório deve conter:
- README principal na raiz;
- README específico em cada pasta principal;
- Descrição das funcionalidades;
- Estrutura do projeto;
- Diagramas explicativos;
- Instruções de execução.

---

## RNF08 — Autenticação com JWT

**Detalhamento**
A autenticação deve utilizar JSON Web Token (JWT), contendo:
- Identificador do usuário;
- Papel (role);
- Tempo de expiração.

O token deve ser enviado via cabeçalho HTTP (Authorization: Bearer).

---

## RNF09 — Segurança

**Detalhamento**
O sistema deve:
- Armazenar senhas com hash seguro (ex.: bcrypt);
- Utilizar variáveis de ambiente para chaves sensíveis;
- Definir tempo de expiração de token;
- Evitar exposição de dados sensíveis na API.