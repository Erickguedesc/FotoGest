BEGIN;

DELETE FROM cliente
WHERE email LIKE 'demo.relatorio.%@fotogest.local';

WITH clientes AS (
  INSERT INTO cliente (nome, email, telefone, cidade, indicacao)
  VALUES
    ('Helena Duarte', 'demo.relatorio.helena@fotogest.local', '(31) 99800-1001', 'Belo Horizonte, MG', 'Demo Relatorio'),
    ('Sofia Mendes', 'demo.relatorio.sofia@fotogest.local', '(31) 99800-1002', 'Nova Lima, MG', 'Demo Relatorio'),
    ('Isabela Nunes', 'demo.relatorio.isabela@fotogest.local', '(31) 99800-1003', 'Contagem, MG', 'Demo Relatorio'),
    ('Patricia Lopes', 'demo.relatorio.patricia@fotogest.local', '(31) 99800-1004', 'Betim, MG', 'Demo Relatorio'),
    ('Amanda Ribeiro', 'demo.relatorio.amanda@fotogest.local', '(31) 99800-1005', 'Belo Horizonte, MG', 'Demo Relatorio'),
    ('Fernanda Castro', 'demo.relatorio.fernanda@fotogest.local', '(31) 99800-1006', 'Sabara, MG', 'Demo Relatorio')
  RETURNING id, email
)
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
  valor_final_ensaio,
  status_valores,
  observacoes,
  progresso,
  atualizado_em
)
SELECT id, 'NEWBORN'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-01-12 10:00:00-03'::timestamptz, 'Estudio FotoGest', 40, 1200, 45, true, 1200, 'PAGO', 'Demo relatorio - Newborn 1', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.helena@fotogest.local'

UNION ALL
SELECT id, 'NEWBORN'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-02-18 14:00:00-03'::timestamptz, 'Estudio FotoGest', 40, 1200, 45, true, 1200, 'PAGO', 'Demo relatorio - Newborn 2', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.sofia@fotogest.local'

UNION ALL
SELECT id, 'NEWBORN'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-03-21 09:30:00-03'::timestamptz, 'Casa da cliente', 40, 1200, 45, true, 1200, 'PAGO', 'Demo relatorio - Newborn 3', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.isabela@fotogest.local'

UNION ALL
SELECT id, 'GESTANTE'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-04-07 16:00:00-03'::timestamptz, 'Parque Municipal', 30, 1000, 40, true, 1000, 'PAGO', 'Demo relatorio - Gestante', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.patricia@fotogest.local'

UNION ALL
SELECT id, 'FAMILIA'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-05-11 15:00:00-03'::timestamptz, 'Estudio FotoGest', 25, 800, 35, true, 800, 'PAGO', 'Demo relatorio - Familia', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.amanda@fotogest.local'

UNION ALL
SELECT id, 'INFANTIL'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-06-09 11:00:00-03'::timestamptz, 'Estudio FotoGest', 30, 600, 30, true, 600, 'PAGO', 'Demo relatorio - Infantil', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.fernanda@fotogest.local';

COMMIT;
