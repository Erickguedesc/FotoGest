BEGIN;

DELETE FROM cliente
WHERE email LIKE 'demo.dashboard.%@fotogest.local';

WITH clientes AS (
  INSERT INTO cliente (nome, email, telefone, cidade, indicacao)
  VALUES
    ('Marina Alves', 'demo.dashboard.marina@fotogest.local', '(31) 99901-0001', 'Belo Horizonte, MG', 'Demo Dashboard'),
    ('Camila Rocha', 'demo.dashboard.camila@fotogest.local', '(31) 99901-0002', 'Nova Lima, MG', 'Demo Dashboard'),
    ('Laura Martins', 'demo.dashboard.laura@fotogest.local', '(31) 99901-0003', 'Contagem, MG', 'Demo Dashboard'),
    ('Bianca Freitas', 'demo.dashboard.bianca@fotogest.local', '(31) 99901-0004', 'Belo Horizonte, MG', 'Demo Dashboard'),
    ('Juliana Costa', 'demo.dashboard.juliana@fotogest.local', '(31) 99901-0005', 'Betim, MG', 'Demo Dashboard'),
    ('Renata Lima', 'demo.dashboard.renata@fotogest.local', '(31) 99901-0006', 'Belo Horizonte, MG', 'Demo Dashboard')
  RETURNING id, email
),
ensaios AS (
  INSERT INTO ensaio (
    cliente_id,
    tipo,
    status,
    data_ensaio,
    local,
    qtd_fotos_pacote,
    valor_pacote,
    valor_foto_extra,
    cobrar_foto_extra,
    observacoes,
    progresso,
    atualizado_em
  )
  SELECT id, 'GESTANTE'::tipo_ensaio, 'AGENDADO'::status_ensaio, NOW() + INTERVAL '2 days', 'Parque Municipal', 30, 850, 35, true, 'Demo Dashboard', 0, NOW() - INTERVAL '20 minutes'
  FROM clientes WHERE email = 'demo.dashboard.marina@fotogest.local'

  UNION ALL
  SELECT id, 'FAMILIA'::tipo_ensaio, 'AGENDADO'::status_ensaio, NOW() - INTERVAL '1 day', 'Estudio FotoGest', 25, 700, 30, true, 'Demo Dashboard', 0, NOW() - INTERVAL '1 hour'
  FROM clientes WHERE email = 'demo.dashboard.camila@fotogest.local'

  UNION ALL
  SELECT id, 'NEWBORN'::tipo_ensaio, 'REALIZADO'::status_ensaio, NOW() - INTERVAL '3 days', 'Casa da cliente', 40, 1200, 45, true, 'Demo Dashboard', 25, NOW() - INTERVAL '2 hours'
  FROM clientes WHERE email = 'demo.dashboard.laura@fotogest.local'

  UNION ALL
  SELECT id, 'INFANTIL'::tipo_ensaio, 'EM_SELECAO'::status_ensaio, NOW() - INTERVAL '8 days', 'Estudio FotoGest', 35, 950, 35, true, 'Demo Dashboard', 55, NOW() - INTERVAL '1 day'
  FROM clientes WHERE email = 'demo.dashboard.bianca@fotogest.local'

  UNION ALL
  SELECT id, 'FEMININO'::tipo_ensaio, 'EM_EDICAO'::status_ensaio, NOW() - INTERVAL '12 days', 'Lagoa da Pampulha', 30, 1100, 40, true, 'Demo Dashboard', 78, NOW() - INTERVAL '2 days'
  FROM clientes WHERE email = 'demo.dashboard.juliana@fotogest.local'

  UNION ALL
  SELECT id, 'CASAL'::tipo_ensaio, 'FINALIZADO'::status_ensaio, NOW() - INTERVAL '20 days', 'Serra do Curral', 45, 1500, 50, true, 'Demo Dashboard', 100, NOW() - INTERVAL '3 days'
  FROM clientes WHERE email = 'demo.dashboard.renata@fotogest.local'

  RETURNING id, status
),
fotos AS (
  INSERT INTO foto (
    ensaio_id,
    cloudinary_id,
    nome_original,
    url_watermark,
    url_original,
    ordem,
    eh_capa
  )
  SELECT
    id,
    'demo-dashboard-' || id || '-capa',
    'capa-demo.jpg',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600',
    1,
    true
  FROM ensaios
  WHERE status IN ('EM_SELECAO'::status_ensaio, 'EM_EDICAO'::status_ensaio, 'FINALIZADO'::status_ensaio)
  RETURNING id, ensaio_id
),
albuns AS (
  INSERT INTO album (
    ensaio_id,
    token_url,
    senha_hash,
    acesso_liberado,
    ativo,
    publicado_em,
    atualizado_em
  )
  SELECT
    ensaio_id,
    'demo-' || left(ensaio_id::text, 8),
    '$2a$10$uJTG.SFW7By6pq2LSEZQv.df76RPhIeINUU5k1w94FBSo3DhKZY3.',
    true,
    true,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  FROM fotos
  RETURNING id, ensaio_id
)
INSERT INTO selecao_foto (
  album_id,
  foto_id,
  finalizada,
  total_selecionadas,
  valor_excedente
)
SELECT a.id, f.id, true, 1, 0
FROM albuns a
JOIN fotos f ON f.ensaio_id = a.ensaio_id
JOIN ensaios e ON e.id = a.ensaio_id
WHERE e.status = 'EM_SELECAO'::status_ensaio;

COMMIT;
