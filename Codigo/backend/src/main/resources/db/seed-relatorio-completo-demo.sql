BEGIN;

DELETE FROM cliente
WHERE email LIKE 'demo.relatorio.completo.%@fotogest.local';

WITH clientes AS (
  INSERT INTO cliente (nome, email, telefone, cidade, indicacao)
  VALUES
    ('Alice Monteiro', 'demo.relatorio.completo.alice@fotogest.local', '(31) 99700-0001', 'Belo Horizonte, MG', 'Demo Relatorio Completo'),
    ('Bruna Ferreira', 'demo.relatorio.completo.bruna@fotogest.local', '(31) 99700-0002', 'Nova Lima, MG', 'Demo Relatorio Completo'),
    ('Carolina Dias', 'demo.relatorio.completo.carolina@fotogest.local', '(31) 99700-0003', 'Contagem, MG', 'Demo Relatorio Completo'),
    ('Daniela Ramos', 'demo.relatorio.completo.daniela@fotogest.local', '(31) 99700-0004', 'Betim, MG', 'Demo Relatorio Completo'),
    ('Elisa Teixeira', 'demo.relatorio.completo.elisa@fotogest.local', '(31) 99700-0005', 'Belo Horizonte, MG', 'Demo Relatorio Completo'),
    ('Flavia Soares', 'demo.relatorio.completo.flavia@fotogest.local', '(31) 99700-0006', 'Sabara, MG', 'Demo Relatorio Completo'),
    ('Gabriela Mota', 'demo.relatorio.completo.gabriela@fotogest.local', '(31) 99700-0007', 'Lagoa Santa, MG', 'Demo Relatorio Completo'),
    ('Helena Prado', 'demo.relatorio.completo.helena@fotogest.local', '(31) 99700-0008', 'Belo Horizonte, MG', 'Demo Relatorio Completo'),
    ('Ingrid Viana', 'demo.relatorio.completo.ingrid@fotogest.local', '(31) 99700-0009', 'Nova Lima, MG', 'Demo Relatorio Completo'),
    ('Joana Pires', 'demo.relatorio.completo.joana@fotogest.local', '(31) 99700-0010', 'Contagem, MG', 'Demo Relatorio Completo'),
    ('Karen Borges', 'demo.relatorio.completo.karen@fotogest.local', '(31) 99700-0011', 'Belo Horizonte, MG', 'Demo Relatorio Completo'),
    ('Larissa Maia', 'demo.relatorio.completo.larissa@fotogest.local', '(31) 99700-0012', 'Betim, MG', 'Demo Relatorio Completo'),
    ('Marina Sales', 'demo.relatorio.completo.marina@fotogest.local', '(31) 99700-0013', 'Belo Horizonte, MG', 'Demo Relatorio Completo'),
    ('Natalia Alves', 'demo.relatorio.completo.natalia@fotogest.local', '(31) 99700-0014', 'Nova Lima, MG', 'Demo Relatorio Completo'),
    ('Olivia Nogueira', 'demo.relatorio.completo.olivia@fotogest.local', '(31) 99700-0015', 'Contagem, MG', 'Demo Relatorio Completo'),
    ('Paula Freire', 'demo.relatorio.completo.paula@fotogest.local', '(31) 99700-0016', 'Belo Horizonte, MG', 'Demo Relatorio Completo'),
    ('Renata Castro', 'demo.relatorio.completo.renata@fotogest.local', '(31) 99700-0017', 'Betim, MG', 'Demo Relatorio Completo'),
    ('Sabrina Lima', 'demo.relatorio.completo.sabrina@fotogest.local', '(31) 99700-0018', 'Belo Horizonte, MG', 'Demo Relatorio Completo')
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
-- 2026: varios meses, trimestres e tipos para testar ranking completo.
SELECT id, 'CASAL'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-01-12 16:00:00-03'::timestamptz, 'Serra do Curral', 35, 1800, 50, true, 1800, 'PAGO', 'Demo relatorio completo - 2026 Jan Casal', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.alice@fotogest.local'

UNION ALL
SELECT id, 'NEWBORN'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-02-08 09:00:00-03'::timestamptz, 'Estudio FotoGest', 40, 1500, 45, true, 1500, 'PAGO', 'Demo relatorio completo - 2026 Fev Newborn', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.bruna@fotogest.local'

UNION ALL
SELECT id, 'FAMILIA'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-03-18 15:00:00-03'::timestamptz, 'Parque Municipal', 30, 900, 35, true, 900, 'PAGO', 'Demo relatorio completo - 2026 Mar Familia', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.carolina@fotogest.local'

UNION ALL
SELECT id, 'GESTANTE'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-04-05 10:00:00-03'::timestamptz, 'Lagoa da Pampulha', 30, 1200, 40, true, 1200, 'PAGO', 'Demo relatorio completo - 2026 Abr Gestante', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.daniela@fotogest.local'

UNION ALL
SELECT id, 'CASAL'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-05-14 17:00:00-03'::timestamptz, 'Inhotim', 45, 2100, 55, true, 2300, 'PAGO', 'Demo relatorio completo - 2026 Mai Casal com ajuste', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.elisa@fotogest.local'

UNION ALL
SELECT id, 'FEMININO'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-05-28 14:00:00-03'::timestamptz, 'Estudio FotoGest', 30, 1100, 40, true, 1100, 'PAGO', 'Demo relatorio completo - 2026 Mai Feminino', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.flavia@fotogest.local'

UNION ALL
SELECT id, 'INFANTIL'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-06-07 11:00:00-03'::timestamptz, 'Estudio FotoGest', 30, 950, 35, true, 950, 'PAGO', 'Demo relatorio completo - 2026 Jun Infantil', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.gabriela@fotogest.local'

UNION ALL
SELECT id, 'NEWBORN'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-07-19 09:30:00-03'::timestamptz, 'Casa da cliente', 40, 1600, 45, true, 1600, 'PAGO', 'Demo relatorio completo - 2026 Jul Newborn', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.helena@fotogest.local'

UNION ALL
SELECT id, 'CASAL'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-08-22 16:30:00-03'::timestamptz, 'Serra do Curral', 40, 1900, 50, true, 1900, 'PAGO', 'Demo relatorio completo - 2026 Ago Casal', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.ingrid@fotogest.local'

UNION ALL
SELECT id, 'BOOK'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-09-04 13:30:00-03'::timestamptz, 'Estudio FotoGest', 25, 700, 35, true, 700, 'PAGO', 'Demo relatorio completo - 2026 Set Book', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.joana@fotogest.local'

UNION ALL
SELECT id, 'GESTANTE'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-10-11 15:00:00-03'::timestamptz, 'Parque das Mangabeiras', 35, 1250, 40, true, 1250, 'PAGO', 'Demo relatorio completo - 2026 Out Gestante', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.karen@fotogest.local'

UNION ALL
SELECT id, 'EVENTO'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-11-16 18:00:00-03'::timestamptz, 'Salao de festas', 80, 2600, 45, true, 2600, 'PAGO', 'Demo relatorio completo - 2026 Nov Evento', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.larissa@fotogest.local'

UNION ALL
SELECT id, 'OUTRO'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2026-12-03 10:30:00-03'::timestamptz, 'Estudio FotoGest', 20, 600, 30, true, 600, 'PAGO', 'Demo relatorio completo - 2026 Dez Outro', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.marina@fotogest.local'

-- 2025: base comparativa para os cards de variacao.
UNION ALL
SELECT id, 'CASAL'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2025-03-09 16:00:00-03'::timestamptz, 'Serra do Curral', 35, 1400, 45, true, 1400, 'PAGO', 'Demo relatorio completo - 2025 Casal', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.natalia@fotogest.local'

UNION ALL
SELECT id, 'NEWBORN'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2025-05-21 09:00:00-03'::timestamptz, 'Estudio FotoGest', 40, 1200, 45, true, 1200, 'PAGO', 'Demo relatorio completo - 2025 Newborn', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.olivia@fotogest.local'

UNION ALL
SELECT id, 'FAMILIA'::tipo_ensaio, 'FINALIZADO'::status_ensaio, '2025-08-12 15:00:00-03'::timestamptz, 'Parque Municipal', 30, 850, 35, true, 850, 'PAGO', 'Demo relatorio completo - 2025 Familia', 100, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.paula@fotogest.local'

-- Ensaios nao finalizados: devem aparecer nas telas operacionais, mas nao no relatorio financeiro.
UNION ALL
SELECT id, 'CASAL'::tipo_ensaio, 'AGENDADO'::status_ensaio, '2026-12-20 17:00:00-03'::timestamptz, 'A definir', 35, 5000, 50, true, NULL, 'NAO_INFORMADO', 'Demo relatorio completo - nao deve entrar no financeiro', 0, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.renata@fotogest.local'

UNION ALL
SELECT id, 'NEWBORN'::tipo_ensaio, 'EM_EDICAO'::status_ensaio, '2026-12-22 09:00:00-03'::timestamptz, 'Estudio FotoGest', 40, 4200, 45, true, NULL, 'NAO_INFORMADO', 'Demo relatorio completo - nao deve entrar no financeiro', 75, NOW()
FROM clientes WHERE email = 'demo.relatorio.completo.sabrina@fotogest.local';

COMMIT;
