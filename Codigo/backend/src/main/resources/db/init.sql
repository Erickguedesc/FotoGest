----------------------------------------------------------------------
--  FOTOLHAR — Schema PostgreSQL Consolidado
--  Versão: 1.3
--  Sincronizado com Java + Histórico de Status + Álbum Reabrível
----------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

------------------------------------
--   ENUM TYPES
------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_ensaio') THEN
        CREATE TYPE tipo_ensaio AS ENUM (
            'NEWBORN',
            'GESTANTE',
            'FAMILIA',
            'INFANTIL',
            'FEMININO',
            'CASAL',
            'BOOK',
            'BATIZADO',
            'EXTERNO',
            'FORMATURA',
            'EVENTO',
            'DEBUTANTE',
            'OUTRO'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_ensaio') THEN
        CREATE TYPE status_ensaio AS ENUM (
            'AGENDADO',
            'REALIZADO',
            'EM_SELECAO',
            'EM_EDICAO',
            'FINALIZADO',
            'CANCELADO'
        );
    END IF;

END $$;

------------------------------------
--   TABELAS
------------------------------------

CREATE TABLE IF NOT EXISTS usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(30),
  cnpj VARCHAR(20),
  logo_url TEXT,
  onboarding_concluido BOOLEAN NOT NULL DEFAULT false,
  onboarding_concluido_em TIMESTAMPTZ,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE usuario ADD COLUMN IF NOT EXISTS onboarding_concluido BOOLEAN;
UPDATE usuario
SET onboarding_concluido = true
WHERE onboarding_concluido IS NULL;
ALTER TABLE usuario ALTER COLUMN onboarding_concluido SET DEFAULT false;
ALTER TABLE usuario ALTER COLUMN onboarding_concluido SET NOT NULL;
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS onboarding_concluido_em TIMESTAMPTZ;
UPDATE usuario
SET onboarding_concluido_em = COALESCE(onboarding_concluido_em, atualizado_em, NOW())
WHERE onboarding_concluido = true;

CREATE TABLE IF NOT EXISTS cliente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  telefone VARCHAR(30),
  cpf VARCHAR(20),
  cidade VARCHAR(120),
  indicacao VARCHAR(120),
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, email),
  UNIQUE (usuario_id, cpf)
);

ALTER TABLE cliente ADD COLUMN IF NOT EXISTS usuario_id UUID;

UPDATE cliente
SET usuario_id = (
  SELECT id
  FROM usuario
  ORDER BY criado_em ASC
  LIMIT 1
)
WHERE usuario_id IS NULL;

ALTER TABLE cliente
  DROP CONSTRAINT IF EXISTS cliente_email_key,
  DROP CONSTRAINT IF EXISTS cliente_cpf_key,
  DROP CONSTRAINT IF EXISTS cliente_usuario_id_fkey;

ALTER TABLE cliente
  ADD CONSTRAINT cliente_usuario_id_fkey
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
  NOT VALID;

ALTER TABLE cliente VALIDATE CONSTRAINT cliente_usuario_id_fkey;

ALTER TABLE cliente ALTER COLUMN usuario_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_cliente_usuario_email
ON cliente(usuario_id, email)
WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_cliente_usuario_cpf
ON cliente(usuario_id, cpf)
WHERE cpf IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cliente_usuario_id
ON cliente(usuario_id);

CREATE TABLE IF NOT EXISTS ensaio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES cliente(id) ON DELETE CASCADE,
  tipo tipo_ensaio NOT NULL,
  tipo_personalizado VARCHAR(120),
  status status_ensaio NOT NULL DEFAULT 'AGENDADO',
  data_ensaio TIMESTAMPTZ NOT NULL,
  local VARCHAR(300) NOT NULL,
  qtd_fotos_pacote INTEGER NOT NULL DEFAULT 30,
  valor_pacote NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_foto_extra NUMERIC(10,2) DEFAULT 35.00,
  cobrar_foto_extra BOOLEAN NOT NULL DEFAULT false,
  valor_final_ensaio NUMERIC(10,2),
  status_valores VARCHAR(30) DEFAULT 'NAO_INFORMADO',
  observacao_valores TEXT,
  observacoes TEXT,
  notas_internas TEXT,
  progresso SMALLINT NOT NULL DEFAULT 0 CHECK(progresso BETWEEN 0 AND 100),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE ensaio ADD COLUMN IF NOT EXISTS notas_internas TEXT;

CREATE TABLE IF NOT EXISTS historico_status_ensaio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ensaio_id UUID NOT NULL REFERENCES ensaio(id) ON DELETE CASCADE,
  status status_ensaio NOT NULL,
  alterado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (ensaio_id, status)
);

CREATE INDEX IF NOT EXISTS idx_historico_status_ensaio_ensaio_id
ON historico_status_ensaio(ensaio_id);

CREATE INDEX IF NOT EXISTS idx_historico_status_ensaio_status
ON historico_status_ensaio(status);

CREATE TABLE IF NOT EXISTS notificacao_dispensada (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  chave VARCHAR(180) NOT NULL,
  dispensada_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expira_em TIMESTAMPTZ,
  UNIQUE (usuario_id, chave)
);

ALTER TABLE notificacao_dispensada
ADD COLUMN IF NOT EXISTS expira_em TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_notificacao_dispensada_usuario_id
ON notificacao_dispensada(usuario_id);

CREATE TABLE IF NOT EXISTS foto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ensaio_id UUID NOT NULL REFERENCES ensaio(id) ON DELETE CASCADE,
  cloudinary_id VARCHAR(300) NOT NULL UNIQUE,
  nome_original VARCHAR(255),
  url_watermark TEXT NOT NULL,
  url_original TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  eh_capa BOOLEAN NOT NULL DEFAULT false,
  enviada_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_foto_ensaio_id
ON foto(ensaio_id);

CREATE TABLE IF NOT EXISTS album (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ensaio_id UUID NOT NULL UNIQUE REFERENCES ensaio(id) ON DELETE CASCADE,
  token_url VARCHAR(60) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  acesso_liberado BOOLEAN NOT NULL DEFAULT false,
  publicado_em TIMESTAMPTZ DEFAULT NOW(),
  expira_em TIMESTAMPTZ,
  ativo BOOLEAN NOT NULL DEFAULT true,
  views INTEGER NOT NULL DEFAULT 0,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_album_ensaio_id
ON album(ensaio_id);

CREATE INDEX IF NOT EXISTS idx_album_token_url
ON album(token_url);

CREATE TABLE IF NOT EXISTS selecao_foto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES album(id) ON DELETE CASCADE,
  foto_id UUID NOT NULL REFERENCES foto(id) ON DELETE CASCADE,
  finalizada BOOLEAN NOT NULL DEFAULT false,
  selecionada_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_selecionadas INTEGER NOT NULL DEFAULT 0,
  valor_excedente NUMERIC(10,2) DEFAULT 0,
  observacao TEXT,
  UNIQUE(album_id, foto_id)
);

CREATE INDEX IF NOT EXISTS idx_selecao_foto_album_id
ON selecao_foto(album_id);

CREATE INDEX IF NOT EXISTS idx_selecao_foto_foto_id
ON selecao_foto(foto_id);

------------------------------------
--   FUNÇÕES E TRIGGERS
------------------------------------

CREATE OR REPLACE FUNCTION fn_atualiza_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_registra_historico_status_ensaio()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO historico_status_ensaio (
      ensaio_id,
      status,
      alterado_em
    )
    VALUES (
      NEW.id,
      NEW.status,
      NOW()
    )
    ON CONFLICT (ensaio_id, status)
    DO UPDATE SET alterado_em = EXCLUDED.alterado_em;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO historico_status_ensaio (
      ensaio_id,
      status,
      alterado_em
    )
    VALUES (
      NEW.id,
      NEW.status,
      NOW()
    )
    ON CONFLICT (ensaio_id, status)
    DO UPDATE SET alterado_em = EXCLUDED.alterado_em;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_usuario_ts ON usuario;
CREATE TRIGGER trg_usuario_ts
BEFORE UPDATE ON usuario
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_timestamp();

DROP TRIGGER IF EXISTS trg_cliente_ts ON cliente;
CREATE TRIGGER trg_cliente_ts
BEFORE UPDATE ON cliente
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_timestamp();

DROP TRIGGER IF EXISTS trg_ensaio_ts ON ensaio;
CREATE TRIGGER trg_ensaio_ts
BEFORE UPDATE ON ensaio
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_timestamp();

DROP TRIGGER IF EXISTS trg_album_ts ON album;
CREATE TRIGGER trg_album_ts
BEFORE UPDATE ON album
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_timestamp();

DROP TRIGGER IF EXISTS trg_ensaio_historico_status ON ensaio;
CREATE TRIGGER trg_ensaio_historico_status
AFTER INSERT OR UPDATE OF status ON ensaio
FOR EACH ROW
EXECUTE FUNCTION fn_registra_historico_status_ensaio();


----------------------------------------------------
-- PREFERÊNCIAS DO SISTEMA
----------------------------------------------------

CREATE TABLE IF NOT EXISTS configuracao_estudio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES usuario(id) ON DELETE CASCADE,
  nome_estudio VARCHAR(160),
  nome_comercial VARCHAR(160),
  email VARCHAR(200),
  telefone VARCHAR(30),
  instagram VARCHAR(120),
  cidade VARCHAR(120),
  endereco TEXT,
  cnpj VARCHAR(20),
  logo_url TEXT,
  marca_dagua_url TEXT,
  marca_dagua_public_id TEXT,
  marca_dagua_ativa BOOLEAN NOT NULL DEFAULT false,
  marca_dagua_posicao VARCHAR(40) DEFAULT 'INFERIOR_DIREITA',
  marca_dagua_opacidade INTEGER DEFAULT 35,
  marca_dagua_tamanho VARCHAR(20) DEFAULT 'MEDIA',
  marca_dagua_margem INTEGER DEFAULT 30,
  marca_dagua_tipo VARCHAR(20) DEFAULT 'IMAGEM',
  marca_dagua_texto TEXT,
  marca_dagua_fonte VARCHAR(30) DEFAULT 'MODERNA',
  marca_dagua_cor VARCHAR(20) DEFAULT 'BRANCO',
  marca_dagua_estilo VARCHAR(20) DEFAULT 'NORMAL',
  marca_dagua_texto_modo VARCHAR(20) DEFAULT 'REPETIDA',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_texto_modo VARCHAR(20) DEFAULT 'REPETIDA';

CREATE TABLE IF NOT EXISTS preferencias_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES usuario(id) ON DELETE CASCADE,
  qtd_fotos_padrao INTEGER DEFAULT 20,
  valor_foto_extra_padrao NUMERIC(10,2),
  prazo_expiracao_album_dias INTEGER DEFAULT 30,
  cidade_padrao VARCHAR(120),
  mensagem_envio_album TEXT,
  mensagem_selecao_recebida TEXT,
  capa_album_padrao_url TEXT,
  capa_album_padrao_public_id TEXT,
  ultimo_backup_metadados_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE preferencias_sistema ADD COLUMN IF NOT EXISTS ultimo_backup_metadados_em TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS configuracao_email (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES usuario(id) ON DELETE CASCADE,
  ativo BOOLEAN NOT NULL DEFAULT false,
  nome_remetente VARCHAR(120),
  email_usuario_avisos VARCHAR(180),
  enviar_album_publicado BOOLEAN NOT NULL DEFAULT true,
  avisar_selecao_recebida BOOLEAN NOT NULL DEFAULT true,
  enviar_confirmacao_selecao_cliente BOOLEAN NOT NULL DEFAULT true,
  enviar_mudanca_status BOOLEAN NOT NULL DEFAULT false,
  mensagem_album_publicado TEXT,
  mensagem_selecao_recebida TEXT
);

ALTER TABLE configuracao_email
ADD COLUMN IF NOT EXISTS enviar_confirmacao_selecao_cliente BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS modelo_contrato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  nome VARCHAR(140) NOT NULL,
  tipo_ensaio VARCHAR(40),
  clausulas TEXT NOT NULL,
  texto_aceite TEXT,
  padrao BOOLEAN NOT NULL DEFAULT false,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_modelo_contrato_usuario_id
ON modelo_contrato(usuario_id);

DROP TRIGGER IF EXISTS trg_preferencias_sistema_ts ON preferencias_sistema;
CREATE TRIGGER trg_preferencias_sistema_ts
BEFORE UPDATE ON preferencias_sistema
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_timestamp();

DROP TRIGGER IF EXISTS trg_configuracao_estudio_ts ON configuracao_estudio;
CREATE TRIGGER trg_configuracao_estudio_ts
BEFORE UPDATE ON configuracao_estudio
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_timestamp();

DROP TRIGGER IF EXISTS trg_modelo_contrato_ts ON modelo_contrato;
CREATE TRIGGER trg_modelo_contrato_ts
BEFORE UPDATE ON modelo_contrato
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_timestamp();
------------------------------------
--   DADOS DE EXEMPLO
------------------------------------

INSERT INTO usuario (
  nome,
  email,
  senha_hash,
  telefone,
  cnpj,
  onboarding_concluido,
  onboarding_concluido_em,
  ativo
)
VALUES
(
  'User 1',
  'user1@fotolhar.com.br',
  crypt('123456', gen_salt('bf')),
  '(31) 99999-0001',
  '00.000.000/0001-00',
  false,
  null,
  true
),
(
  'User 2',
  'user2@fotolhar.com.br',
  crypt('123456', gen_salt('bf')),
  '(31) 99999-0002',
  '00.000.000/0001-00',
  false,
  null,
  true
),
(
  'User 3',
  'user3@fotolhar.com.br',
  crypt('123456', gen_salt('bf')),
  '(31) 99999-0003',
  '00.000.000/0001-00',
  false,
  null,
  true
)
ON CONFLICT (email) DO NOTHING;


------------------------------------
--   BACKFILL DO HISTÓRICO DE STATUS
------------------------------------

INSERT INTO historico_status_ensaio (
  ensaio_id,
  status,
  alterado_em
)
SELECT
  id,
  status,
  COALESCE(atualizado_em, criado_em, NOW())
FROM ensaio
ON CONFLICT (ensaio_id, status)
DO NOTHING;

------------------------------------
--   CONFIGURAÇÕES DE MARCA D'ÁGUA
------------------------------------

----------------------------------------------------
-- MARCA D'ÁGUA POR TEXTO
----------------------------------------------------

