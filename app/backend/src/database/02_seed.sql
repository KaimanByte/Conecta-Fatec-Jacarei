-- 02_seed.sql
-- Script DML de referência com dados mínimos para execução e validação do projeto.
-- A senha abaixo representa um hash bcrypt de ambiente acadêmico/local.

INSERT INTO "Users" (email, password, role, "createdAt", "updatedAt")
VALUES
  ('admin@fatec.edu', '$2b$10$3cUFIe42Lky7VD3u7pQx..NdxCy/5q1vCNmpt17zq8uROyLtD0PjG', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Nodes" (title, content, "parentId", "createdAt", "updatedAt")
VALUES
  ('Desenvolvimento de Software Multiplataforma', 'Para qual assunto você gostaria de obter informações?', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Geoprocessamento', 'Para qual assunto você gostaria de obter informações?', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Meio Ambiente e Recursos Hídricos', 'Para qual assunto você gostaria de obter informações?', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Não sou aluno', 'Para qual assunto você gostaria de obter informações?', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO inquiries ("requesterName", "requesterEmail", question, status, "createdAt", "updatedAt")
VALUES
  ('Aluno Exemplo', 'aluno.exemplo@fatec.sp.gov.br', 'Como solicito aproveitamento de estudos?', 'ABERTA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
