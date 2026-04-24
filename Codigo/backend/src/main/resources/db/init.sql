----------------------------------------------------------------------
--  OLHARI — Schema PostgreSQL Consolidado
--  Versão: 1.2 (Sincronizado com Java + Dados de Exemplo)
----------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

------------------------------------
--   ENUM TYPES
------------------------------------
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_ensaio') THEN
        CREATE TYPE tipo_ensaio AS ENUM ('NEWBORN', 'GESTANTE', 'FAMILIA', 'INFANTIL', 'FEMININO', 'CASAL', 'BOOK', 'BATIZADO', 'EXTERNO', 'FORMATURA' ,'EVENTO' , 'DEBUTANTE', 'OUTRO');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_ensaio') THEN
        CREATE TYPE status_ensaio AS ENUM ('AGENDADO', 'REALIZADO',  'EM_SELECAO','EM_EDICAO', 'FINALIZADO', 'CANCELADO');
    END IF;
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_lead') THEN
    CREATE TYPE status_lead AS ENUM ('EM_SOLICITACAO', 'ATENDIDO');
END IF;
END $$;

------------------------------------
--   TABELAS (Estrutura Corrigida)
------------------------------------
CREATE TABLE IF NOT EXISTS fotografa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(30),
  cnpj VARCHAR(20),
  logo_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cliente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE,
  telefone VARCHAR(30),
  cpf VARCHAR(20) UNIQUE,
  cidade VARCHAR(120),
  indicacao VARCHAR(120),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ensaio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES cliente(id) ON DELETE CASCADE,
  tipo tipo_ensaio NOT NULL,
  status status_ensaio NOT NULL DEFAULT 'AGENDADO',
  data_ensaio TIMESTAMPTZ NOT NULL,
  local VARCHAR(300) NOT NULL,
  qtd_fotos_pacote INTEGER NOT NULL DEFAULT 30,
  valor_pacote NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_foto_extra NUMERIC(10,2) DEFAULT 35.00,
  cobrar_foto_extra BOOLEAN NOT NULL DEFAULT false,
  observacoes TEXT,
  progresso SMALLINT NOT NULL DEFAULT 0 CHECK(progresso BETWEEN 0 AND 100),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ensaio_id UUID NOT NULL REFERENCES ensaio(id) ON DELETE CASCADE,
  cloudinary_id VARCHAR(300) NOT NULL UNIQUE,
  url_watermark TEXT NOT NULL,
  url_original TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  eh_capa BOOLEAN NOT NULL DEFAULT false,
  enviada_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS album (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ensaio_id UUID NOT NULL UNIQUE REFERENCES ensaio(id) ON DELETE CASCADE,
  token_url VARCHAR(60) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  publicado_em TIMESTAMPTZ DEFAULT NOW(),
  expira_em TIMESTAMPTZ,
  ativo BOOLEAN NOT NULL DEFAULT true,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS selecao_foto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES album(id) ON DELETE CASCADE,
  foto_id UUID NOT NULL REFERENCES foto(id) ON DELETE CASCADE,
  finalizada BOOLEAN NOT NULL DEFAULT false,
  selecionada_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_selecionadas INTEGER NOT NULL DEFAULT 0,
  valor_excedente NUMERIC(10,2) DEFAULT 0,
  UNIQUE(album_id, foto_id)
);

CREATE TABLE solicitacao_orcamento (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_cliente    VARCHAR(200)  NOT NULL,
  whatsapp        VARCHAR(30)   NOT NULL,
  tipo_ensaio     VARCHAR(80)   NOT NULL,
  data_desejada   DATE,
  status_lead     status_lead   NOT NULL DEFAULT 'EM_SOLICITACAO',
  recebido_em     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

------------------------------------
--   AUTOMAÇÃO (Triggers)
------------------------------------
CREATE OR REPLACE FUNCTION fn_atualiza_timestamp() RETURNS TRIGGER AS $$
BEGIN NEW.atualizado_em = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_fotografa_ts BEFORE UPDATE ON fotografa FOR EACH ROW EXECUTE FUNCTION fn_atualiza_timestamp();
CREATE OR REPLACE TRIGGER trg_cliente_ts BEFORE UPDATE ON cliente FOR EACH ROW EXECUTE FUNCTION fn_atualiza_timestamp();
CREATE OR REPLACE TRIGGER trg_ensaio_ts BEFORE UPDATE ON ensaio FOR EACH ROW EXECUTE FUNCTION fn_atualiza_timestamp();
CREATE OR REPLACE TRIGGER trg_album_ts BEFORE UPDATE ON album FOR EACH ROW EXECUTE FUNCTION fn_atualiza_timestamp();

------------------------------------
--   DADOS DE EXEMPLO (SEEDS)
------------------------------------

-- 1. Fotógrafa (Erick - senha: admin123 codificada em BCrypt)
INSERT INTO fotografa (nome, email, senha_hash, telefone, cnpj)
VALUES ('Erick Barbosa', 'contato@olhari.com', '$2a$12$xXHq0Cp.FjXHIpgKAbq9reNsQPKjvv7etPAEqM7B.xK3fkpXFdVia', '(31) 99000-1234', '00.000.000/0001-00')
ON CONFLICT DO NOTHING;

-- 2. Cliente de exemplo
INSERT INTO cliente (nome, email, telefone, cpf, cidade, indicacao)
VALUES ('Ana Clara Mendes', 'anaclara@email.com', '(31) 98765-4321', '123.456.789-00', 'Belo Horizonte, MG', 'Instagram')
ON CONFLICT DO NOTHING;

-- 3. Ensaio de exemplo (Vinculado à Ana Clara)
INSERT INTO ensaio (cliente_id, tipo, status, data_ensaio, local, qtd_fotos_pacote, valor_pacote, valor_foto_extra, cobrar_foto_extra, observacoes, progresso)
SELECT id, 'NEWBORN', 'EM_EDICAO', NOW(), 'Studio Olhari, BH', 40, 1200.00, 35.00, true, 'Bebê de 10 dias. Props florais.', 65
FROM cliente WHERE email = 'anaclara@email.com' LIMIT 1;

-- 4. Solicitação de orçamento
INSERT INTO solicitacao_orcamento (nome_cliente, whatsapp, tipo_ensaio, data_desejada, status_lead)
VALUES ('Ana Clara Mendes', '31988776655', 'Newborn', '2026-05-10', 'EM_SOLICITACAO');

