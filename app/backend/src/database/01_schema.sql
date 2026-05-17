-- 01_schema.sql
-- Script DDL de referência para o banco relacional do Conecta Fatec Jacareí.
-- A aplicação utiliza Sequelize em runtime, mas este arquivo explicita a estrutura SQL
-- para documentação, avaliação e reprodução manual do esquema.

CREATE TYPE user_role AS ENUM ('student', 'secretary', 'admin');
CREATE TYPE inquiry_status AS ENUM ('ABERTA', 'RESPONDIDA');
CREATE TYPE satisfaction_status AS ENUM ('ATENDEU', 'NAO_ATENDEU');

CREATE TABLE IF NOT EXISTS "Users" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Nodes" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  "parentId" INTEGER,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_nodes_parent
    FOREIGN KEY ("parentId")
    REFERENCES "Nodes" (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  "requesterName" VARCHAR(160) NOT NULL,
  "requesterEmail" VARCHAR(160) NOT NULL,
  question TEXT NOT NULL,
  status inquiry_status NOT NULL DEFAULT 'ABERTA',
  "answeredBy" INTEGER,
  "answerText" TEXT,
  "attachmentName" VARCHAR(255),
  "attachmentMime" VARCHAR(100),
  "attachmentData" BYTEA,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inquiries_answered_by
    FOREIGN KEY ("answeredBy")
    REFERENCES "Users" (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS interaction_logs (
  id SERIAL PRIMARY KEY,
  "sessionId" UUID NOT NULL DEFAULT gen_random_uuid(),
  "navigationFlow" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "inquiryId" INTEGER,
  satisfaction satisfaction_status,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_interaction_logs_inquiry
    FOREIGN KEY ("inquiryId")
    REFERENCES inquiries (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);
