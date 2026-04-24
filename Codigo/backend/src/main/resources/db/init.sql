---------------------------------------
 --  OLHARI — Schema PostgreSQL
 --  Versão: 1.0
 --  RF: RF01–RF13

--------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

------------------------------------
--   ENUM TYPES
------------------------------------
CREATE TYPE tipo_ensaio AS ENUM (
  'NEWBORN', 'GESTANTE', 'FAMILIA',
  'INFANTIL', 'FEMININO', 'CASAL',
  'BOOK', 'BATIZADO', 'EXTERNO', 'OUTRO'
);

CREATE TYPE status_ensaio AS ENUM (
  'AGENDADO', 'REALIZADO', 'EM_EDICAO',
  'FINALIZACAO', 'ENTREGUE', 'CANCELADO'
);

CREATE TYPE status_lead AS ENUM (
  'EM_SOLICITACAO', 'ATENDIDO'
);

--------------------
---   1. FOTOGRAFA (RF13 — admin)
------------------------
CREATE TABLE fotografa (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        VARCHAR(150) NOT NULL,
  email       VARCHAR(200) NOT NULL UNIQUE,
  senha_hash  VARCHAR(255) NOT NULL,
  telefone    VARCHAR(20),
  cnpj        VARCHAR(20),
  logo_url    TEXT,
  ativo       BOOLEAN     NOT NULL DEFAULT true,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-------------------------------
  --2. CLIENTE
-----------------------------------
CREATE TABLE cliente (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        VARCHAR(200) NOT NULL,
  email       VARCHAR(200),
  telefone    VARCHAR(30),
  cpf         VARCHAR(20),
  cidade      VARCHAR(120),
  indicacao   VARCHAR(120),
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------
  -- 3. ENSAIO (RF03, RF04, RF08)
------------------------------
CREATE TABLE ensaio (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id          UUID            NOT NULL REFERENCES cliente(id) ON DELETE CASCADE,
  tipo                tipo_ensaio     NOT NULL,
  status              status_ensaio   NOT NULL DEFAULT 'AGENDADO',
  data_ensaio         TIMESTAMPTZ     NOT NULL,
  local               VARCHAR(300)    NOT NULL,
  qtd_fotos_pacote    INTEGER         NOT NULL DEFAULT 30,
  valor_pacote        NUMERIC(10,2)   NOT NULL DEFAULT 0,
  valor_foto_extra    NUMERIC(10,2)   DEFAULT 35.00,
  cobrar_foto_extra   BOOLEAN         NOT NULL DEFAULT false,
  observacoes         TEXT,
  progresso           SMALLINT        NOT NULL DEFAULT 0
                        CHECK(progresso BETWEEN 0 AND 100),
  criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ensaio_cliente   ON ensaio(cliente_id);
CREATE INDEX idx_ensaio_status    ON ensaio(status);
CREATE INDEX idx_ensaio_data      ON ensaio(data_ensaio);

-- -------------------------------------
--  4. FOTO (R04 — marca d'água)
-------------------------------------
CREATE TABLE foto (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ensaio_id       UUID        NOT NULL REFERENCES ensaio(id) ON DELETE CASCADE,
  cloudinary_id   VARCHAR(300) NOT NULL UNIQUE,
  url_watermark   TEXT        NOT NULL, -- com marca d'água (R04)
  url_original    TEXT,                  -- alta resolução, sem marca
  ordem           INTEGER     NOT NULL DEFAULT 0,
  eh_capa         BOOLEAN     NOT NULL DEFAULT false,
  enviada_em      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_foto_ensaio ON foto(ensaio_id);

-- -------------------------------------
   --5. ALBUM (RF05 — acesso por token)
-------------------------------------
CREATE TABLE album (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ensaio_id       UUID        NOT NULL UNIQUE REFERENCES ensaio(id) ON DELETE CASCADE,
  token_url       VARCHAR(60)  NOT NULL UNIQUE, -- ex: "ana-clara-3f8a"
  senha_hash      VARCHAR(255) NOT NULL,
  publicado_em    TIMESTAMPTZ DEFAULT NOW(),
  expira_em       TIMESTAMPTZ,
  ativo           BOOLEAN     NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX idx_album_token ON album(token_url);

-- -------------------------------------
  -- 6. SELECAO_FOTO (RF06, RF07, RF11)
-------------------------------------
CREATE TABLE selecao_foto (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id            UUID          NOT NULL REFERENCES album(id) ON DELETE CASCADE,
  foto_id             UUID          NOT NULL REFERENCES foto(id) ON DELETE CASCADE,
  finalizada          BOOLEAN       NOT NULL DEFAULT false,
  selecionada_em      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  total_selecionadas  INTEGER       NOT NULL DEFAULT 0,
  valor_excedente     NUMERIC(10,2) DEFAULT 0,
  UNIQUE(album_id, foto_id)
);

CREATE INDEX idx_selecao_album ON selecao_foto(album_id);

-- -------------------------------------
  -- 7. SOLICITACAO_ORCAMENTO (RF12)
-------------------------------------
CREATE TABLE solicitacao_orcamento (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_cliente    VARCHAR(200)  NOT NULL,
  whatsapp        VARCHAR(30)   NOT NULL,
  tipo_ensaio     VARCHAR(80)   NOT NULL,
  data_desejada   DATE,
  status_lead     status_lead   NOT NULL DEFAULT 'EM_SOLICITACAO',
  recebido_em     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_solic_status ON solicitacao_orcamento(status_lead);

-- -------------------------------------
  -- TRIGGER: atualiza 'atualizado_em'
  -- automaticamente em toda UPDATE
-------------------------------------
CREATE OR REPLACE FUNCTION fn_atualiza_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_fotografa_ts
  BEFORE UPDATE ON fotografa
  FOR EACH ROW EXECUTE FUNCTION fn_atualiza_timestamp();

CREATE TRIGGER trg_cliente_ts
  BEFORE UPDATE ON cliente
  FOR EACH ROW EXECUTE FUNCTION fn_atualiza_timestamp();

CREATE TRIGGER trg_ensaio_ts
  BEFORE UPDATE ON ensaio
  FOR EACH ROW EXECUTE FUNCTION fn_atualiza_timestamp();



  -- Fotografa padrão (senha: admin123 — bcrypt)
INSERT INTO fotografa (nome, email, senha_hash, telefone, cnpj)
VALUES (
  'Maria Clara Souza',
  'contato@olhari.com',
  '$2a$12$xXHq0Cp.FjXHIpgKAbq9reNsQPKjvv7etPAEqM7B.xK3fkpXFdVia',
  '(31) 99000-1234',
  '00.000.000/0001-00'
);

-- Cliente de exemplo
INSERT INTO cliente (nome, email, telefone, cpf, cidade, indicacao)
VALUES (
  'Ana Clara Mendes',
  'anaclara@email.com',
  '(31) 98765-4321',
  '123.456.789-00',
  'Belo Horizonte, MG',
  'Instagram'
);

-- Ensaio de exemplo
INSERT INTO ensaio (
  cliente_id, tipo, status, data_ensaio, local,
  qtd_fotos_pacote, valor_pacote, valor_foto_extra,
  cobrar_foto_extra, observacoes, progresso
)
SELECT
  c.id, 'NEWBORN', 'EM_EDICAO',
  '2025-04-12 09:00:00+00',
  'Studio Olhari, BH',
  40, 1200.00, 35.00, true,
  'Bebê de 10 dias. Props florais. Tons neutros e quentes.',
  65
FROM cliente c WHERE c.email = 'anaclara@email.com';

-- Solicitação de orçamento de exemplo
INSERT INTO solicitacao_orcamento (nome_cliente, whatsapp, tipo_ensaio, data_desejada, status_lead)
VALUES (
  'Ana Clara Mendes',
  '31988776655',
  'Newborn',
  '2026-05-10',
  'EM_SOLICITACAO'
);