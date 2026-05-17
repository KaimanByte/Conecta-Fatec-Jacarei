-- 03_indexes_constraints.sql
-- Índices e constraints complementares para consultas prováveis do sistema.

CREATE INDEX IF NOT EXISTS idx_nodes_parent_id
  ON "Nodes" ("parentId");

CREATE INDEX IF NOT EXISTS idx_nodes_title
  ON "Nodes" (title);

CREATE INDEX IF NOT EXISTS idx_nodes_search_text
  ON "Nodes"
  USING gin (to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(content, '')));

CREATE INDEX IF NOT EXISTS idx_interaction_logs_session_id
  ON interaction_logs ("sessionId");

CREATE INDEX IF NOT EXISTS idx_interaction_logs_created_at
  ON interaction_logs ("createdAt");

CREATE INDEX IF NOT EXISTS idx_interaction_logs_inquiry_id
  ON interaction_logs ("inquiryId");

CREATE INDEX IF NOT EXISTS idx_inquiries_status
  ON inquiries (status);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
  ON inquiries ("createdAt");

CREATE INDEX IF NOT EXISTS idx_inquiries_status_created_at
  ON inquiries (status, "createdAt");

CREATE INDEX IF NOT EXISTS idx_inquiries_answered_by
  ON inquiries ("answeredBy");

CREATE INDEX IF NOT EXISTS idx_users_email
  ON "Users" (email);
