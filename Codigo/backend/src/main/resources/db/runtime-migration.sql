ALTER TABLE cliente
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

UPDATE cliente
SET ativo = true
WHERE ativo IS NULL;

ALTER TABLE cliente
ALTER COLUMN ativo SET DEFAULT true;

ALTER TABLE cliente
ALTER COLUMN ativo SET NOT NULL;

ALTER TABLE album
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

UPDATE album
SET views = 0
WHERE views IS NULL;

ALTER TABLE album
ALTER COLUMN views SET DEFAULT 0;

ALTER TABLE album
ALTER COLUMN views SET NOT NULL;

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_url TEXT;

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_public_id TEXT;

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_ativa BOOLEAN DEFAULT false;

UPDATE configuracao_estudio
SET marca_dagua_ativa = false
WHERE marca_dagua_ativa IS NULL;

ALTER TABLE configuracao_estudio
ALTER COLUMN marca_dagua_ativa SET DEFAULT false;

ALTER TABLE configuracao_estudio
ALTER COLUMN marca_dagua_ativa SET NOT NULL;

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_posicao VARCHAR(40) DEFAULT 'INFERIOR_DIREITA';

UPDATE configuracao_estudio
SET marca_dagua_posicao = 'INFERIOR_DIREITA'
WHERE marca_dagua_posicao IS NULL;

ALTER TABLE configuracao_estudio
ALTER COLUMN marca_dagua_posicao SET DEFAULT 'INFERIOR_DIREITA';

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_opacidade INTEGER DEFAULT 35;

UPDATE configuracao_estudio
SET marca_dagua_opacidade = 35
WHERE marca_dagua_opacidade IS NULL;

ALTER TABLE configuracao_estudio
ALTER COLUMN marca_dagua_opacidade SET DEFAULT 35;

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_tamanho VARCHAR(20) DEFAULT 'MEDIA';

UPDATE configuracao_estudio
SET marca_dagua_tamanho = 'MEDIA'
WHERE marca_dagua_tamanho IS NULL;

ALTER TABLE configuracao_estudio
ALTER COLUMN marca_dagua_tamanho SET DEFAULT 'MEDIA';

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_margem INTEGER DEFAULT 30;

UPDATE configuracao_estudio
SET marca_dagua_margem = 30
WHERE marca_dagua_margem IS NULL;

ALTER TABLE configuracao_estudio
ALTER COLUMN marca_dagua_margem SET DEFAULT 30;

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_tipo VARCHAR(20) DEFAULT 'IMAGEM';

UPDATE configuracao_estudio
SET marca_dagua_tipo = 'IMAGEM'
WHERE marca_dagua_tipo IS NULL;

ALTER TABLE configuracao_estudio
ALTER COLUMN marca_dagua_tipo SET DEFAULT 'IMAGEM';

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_texto TEXT;

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_fonte VARCHAR(30) DEFAULT 'MODERNA';

UPDATE configuracao_estudio
SET marca_dagua_fonte = 'MODERNA'
WHERE marca_dagua_fonte IS NULL;

ALTER TABLE configuracao_estudio
ALTER COLUMN marca_dagua_fonte SET DEFAULT 'MODERNA';

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_cor VARCHAR(20) DEFAULT 'BRANCO';

UPDATE configuracao_estudio
SET marca_dagua_cor = 'BRANCO'
WHERE marca_dagua_cor IS NULL;

ALTER TABLE configuracao_estudio
ALTER COLUMN marca_dagua_cor SET DEFAULT 'BRANCO';

ALTER TABLE configuracao_estudio
ADD COLUMN IF NOT EXISTS marca_dagua_estilo VARCHAR(20) DEFAULT 'NORMAL';

UPDATE configuracao_estudio
SET marca_dagua_estilo = 'NORMAL'
WHERE marca_dagua_estilo IS NULL;

ALTER TABLE configuracao_estudio
ALTER COLUMN marca_dagua_estilo SET DEFAULT 'NORMAL';

