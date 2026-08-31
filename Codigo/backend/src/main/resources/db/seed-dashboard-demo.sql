\set ON_ERROR_STOP on

-- Fotolhar - seed rico para testar o Dashboard.
--
-- Como rodar pelo terminal, a partir de Codigo/backend:
--   Get-Content -Raw .\src\main\resources\db\seed-dashboard-demo.sql | docker exec -i fotolhar_postgres psql -U fotolhar_user -d fotolhar_db
--
-- Por padrao, popula o usuario principal do ambiente local.
-- Para outro usuario, rode com:
--   Get-Content -Raw .\src\main\resources\db\seed-dashboard-demo.sql | docker exec -i fotolhar_postgres psql -U fotolhar_user -d fotolhar_db -v seed_usuario_email='outro@email.com'
\if :{?seed_usuario_email}
SELECT set_config('fotolhar.seed_usuario_email', :'seed_usuario_email', false);
\else
SET fotolhar.seed_usuario_email TO 'user1@fotolhar.com.br';
\endif

BEGIN;

DO $$
DECLARE
    v_usuario_id UUID;
    v_usuario_email TEXT := NULLIF(current_setting('fotolhar.seed_usuario_email', true), '');
BEGIN
    IF v_usuario_email IS NOT NULL THEN
        SELECT id
          INTO v_usuario_id
          FROM usuario
         WHERE LOWER(email) = LOWER(v_usuario_email)
         LIMIT 1;

        IF v_usuario_id IS NULL THEN
            RAISE EXCEPTION 'Usuario com e-mail "%" nao encontrado.', v_usuario_email;
        END IF;
    ELSE
        SELECT id
          INTO v_usuario_id
          FROM usuario
         WHERE ativo = TRUE
         ORDER BY criado_em ASC
         LIMIT 1;
    END IF;

    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Nenhum usuario ativo encontrado. Crie um usuario antes de rodar este seed.';
    END IF;

    DELETE FROM notificacao_dispensada
     WHERE usuario_id = v_usuario_id
       AND chave LIKE '%30000000-0000-4000-8000-0000000000%';

    DELETE FROM cliente
     WHERE email LIKE 'seed.dashboard.%@fotolhar.demo'
        OR id::TEXT LIKE '20000000-0000-4000-8000-0000000000%';

    INSERT INTO cliente (id, usuario_id, nome, email, telefone, cpf, cidade, indicacao, ativo, criado_em, atualizado_em)
    VALUES
        ('20000000-0000-4000-8000-000000000001', v_usuario_id, 'Erick Demo Hoje', 'seed.dashboard.01@fotolhar.demo', '(41) 99999-0001', '90000000001', 'Curitiba, PR', 'Instagram', TRUE, NOW() - INTERVAL '20 days', NOW() - INTERVAL '2 hours'),
        ('20000000-0000-4000-8000-000000000002', v_usuario_id, 'Manuela Prado', 'seed.dashboard.02@fotolhar.demo', '(41) 99999-0002', '90000000002', 'Curitiba, PR', 'Indicacao', TRUE, NOW() - INTERVAL '18 days', NOW() - INTERVAL '3 hours'),
        ('20000000-0000-4000-8000-000000000003', v_usuario_id, 'Sofia Martins', 'seed.dashboard.03@fotolhar.demo', '(41) 99999-0003', '90000000003', 'Sao Jose, SC', 'Google', TRUE, NOW() - INTERVAL '16 days', NOW() - INTERVAL '5 hours'),
        ('20000000-0000-4000-8000-000000000004', v_usuario_id, 'Lucas Aventura', 'seed.dashboard.04@fotolhar.demo', '(41) 99999-0004', '90000000004', 'Morretes, PR', 'Instagram', TRUE, NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day'),
        ('20000000-0000-4000-8000-000000000005', v_usuario_id, 'Rafaela Lima', 'seed.dashboard.05@fotolhar.demo', '(41) 99999-0005', '90000000005', 'Curitiba, PR', 'Cliente antigo', TRUE, NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day'),
        ('20000000-0000-4000-8000-000000000006', v_usuario_id, 'Marina Atrasado', 'seed.dashboard.06@fotolhar.demo', '(41) 99999-0006', '90000000006', 'Pinhais, PR', 'WhatsApp', TRUE, NOW() - INTERVAL '14 days', NOW() - INTERVAL '1 day'),
        ('20000000-0000-4000-8000-000000000007', v_usuario_id, 'Vanubia Costa', 'seed.dashboard.07@fotolhar.demo', '(41) 99999-0007', '90000000007', 'Curitiba, PR', 'Instagram', TRUE, NOW() - INTERVAL '13 days', NOW() - INTERVAL '50 minutes'),
        ('20000000-0000-4000-8000-000000000008', v_usuario_id, 'Maroa Santos', 'seed.dashboard.08@fotolhar.demo', '(41) 99999-0008', '90000000008', 'Curitiba, PR', 'Google', TRUE, NOW() - INTERVAL '13 days', NOW() - INTERVAL '1 hour'),
        ('20000000-0000-4000-8000-000000000009', v_usuario_id, 'Familia Castro', 'seed.dashboard.09@fotolhar.demo', '(41) 99999-0009', '90000000009', 'Campo Largo, PR', 'Indicacao', TRUE, NOW() - INTERVAL '12 days', NOW() - INTERVAL '70 minutes'),
        ('20000000-0000-4000-8000-000000000010', v_usuario_id, 'Bento Souza', 'seed.dashboard.10@fotolhar.demo', '(41) 99999-0010', '90000000010', 'Curitiba, PR', 'Instagram', TRUE, NOW() - INTERVAL '12 days', NOW() - INTERVAL '90 minutes'),
        ('20000000-0000-4000-8000-000000000011', v_usuario_id, 'Julia Rodrigues', 'seed.dashboard.11@fotolhar.demo', '(41) 99999-0011', '90000000011', 'Curitiba, PR', 'Google', TRUE, NOW() - INTERVAL '11 days', NOW() - INTERVAL '8 minutes'),
        ('20000000-0000-4000-8000-000000000012', v_usuario_id, 'Camila Mendes', 'seed.dashboard.12@fotolhar.demo', '(41) 99999-0012', '90000000012', 'Curitiba, PR', 'Cliente antigo', TRUE, NOW() - INTERVAL '11 days', NOW() - INTERVAL '18 minutes'),
        ('20000000-0000-4000-8000-000000000013', v_usuario_id, 'Helena Sem Resposta', 'seed.dashboard.13@fotolhar.demo', '(41) 99999-0013', '90000000013', 'Curitiba, PR', 'WhatsApp', TRUE, NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 hours'),
        ('20000000-0000-4000-8000-000000000014', v_usuario_id, 'Erick Test', 'seed.dashboard.14@fotolhar.demo', '(41) 99999-0014', '90000000014', 'Curitiba, PR', 'Instagram', TRUE, NOW() - INTERVAL '9 days', NOW() - INTERVAL '4 hours'),
        ('20000000-0000-4000-8000-000000000015', v_usuario_id, 'Angelina Freitas', 'seed.dashboard.15@fotolhar.demo', '(41) 99999-0015', '90000000015', 'Curitiba, PR', 'Indicacao', TRUE, NOW() - INTERVAL '9 days', NOW() - INTERVAL '5 hours'),
        ('20000000-0000-4000-8000-000000000016', v_usuario_id, 'Ana e Rafael', 'seed.dashboard.16@fotolhar.demo', '(41) 99999-0016', '90000000016', 'Curitiba, PR', 'Instagram', TRUE, NOW() - INTERVAL '8 days', NOW() - INTERVAL '30 minutes'),
        ('20000000-0000-4000-8000-000000000017', v_usuario_id, 'Miguel Newborn', 'seed.dashboard.17@fotolhar.demo', '(41) 99999-0017', '90000000017', 'Curitiba, PR', 'Google', TRUE, NOW() - INTERVAL '8 days', NOW() - INTERVAL '6 hours'),
        ('20000000-0000-4000-8000-000000000018', v_usuario_id, 'Laura Cancelado', 'seed.dashboard.18@fotolhar.demo', '(41) 99999-0018', '90000000018', 'Curitiba, PR', 'WhatsApp', TRUE, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 hours'),
        ('20000000-0000-4000-8000-000000000019', v_usuario_id, 'Luisa Ferreira', 'seed.dashboard.19@fotolhar.demo', '(41) 99999-0019', '90000000019', 'Curitiba, PR', 'Instagram', TRUE, NOW() - INTERVAL '6 days', NOW() - INTERVAL '3 hours'),
        ('20000000-0000-4000-8000-000000000020', v_usuario_id, 'Pedro Book', 'seed.dashboard.20@fotolhar.demo', '(41) 99999-0020', '90000000020', 'Curitiba, PR', 'Google', TRUE, NOW() - INTERVAL '6 days', NOW() - INTERVAL '10 hours'),
        ('20000000-0000-4000-8000-000000000021', v_usuario_id, 'Bianca Data Passada', 'seed.dashboard.21@fotolhar.demo', '(41) 99999-0021', '90000000021', 'Curitiba, PR', 'Instagram', TRUE, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
        ('20000000-0000-4000-8000-000000000022', v_usuario_id, 'Nina Sem Upload', 'seed.dashboard.22@fotolhar.demo', '(41) 99999-0022', '90000000022', 'Curitiba, PR', 'Indicacao', TRUE, NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'),
        ('20000000-0000-4000-8000-000000000023', v_usuario_id, 'Davi Sem Upload', 'seed.dashboard.23@fotolhar.demo', '(41) 99999-0023', '90000000023', 'Curitiba, PR', 'Google', TRUE, NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'),
        ('20000000-0000-4000-8000-000000000024', v_usuario_id, 'Laura Album Pendente', 'seed.dashboard.24@fotolhar.demo', '(41) 99999-0024', '90000000024', 'Curitiba, PR', 'WhatsApp', TRUE, NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'),
        ('20000000-0000-4000-8000-000000000025', v_usuario_id, 'Paula Selecionou', 'seed.dashboard.25@fotolhar.demo', '(41) 99999-0025', '90000000025', 'Curitiba, PR', 'Instagram', TRUE, NOW() - INTERVAL '4 days', NOW() - INTERVAL '25 minutes');

    INSERT INTO ensaio (
        id, cliente_id, tipo, tipo_personalizado, status, data_ensaio, local,
        qtd_fotos_pacote, valor_pacote, valor_foto_extra, cobrar_foto_extra,
        valor_final_ensaio, status_valores, observacao_valores, observacoes, notas_internas,
        progresso, criado_em, atualizado_em
    )
    VALUES
        ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'FAMILIA', NULL, 'AGENDADO', NOW() + INTERVAL '2 hours', 'Studio Fotolhar', 25, 690.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: ensaio hoje para o aviso superior.', NULL, 0, NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 hour'),
        ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'GESTANTE', NULL, 'AGENDADO', (CURRENT_DATE + 1 + TIME '09:30') AT TIME ZONE 'America/Sao_Paulo', 'Parque Barigui', 22, 720.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: proximo ensaio.', NULL, 0, NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 hours'),
        ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', 'INFANTIL', NULL, 'AGENDADO', (CURRENT_DATE + 3 + TIME '15:00') AT TIME ZONE 'America/Sao_Paulo', 'Bosque Alemao', 20, 560.00, 40.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: agenda da semana.', NULL, 0, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 hours'),
        ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000004', 'EXTERNO', NULL, 'AGENDADO', (CURRENT_DATE + 6 + TIME '10:00') AT TIME ZONE 'America/Sao_Paulo', 'Morretes, PR', 30, 880.00, 50.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: agenda da semana.', NULL, 0, NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day'),
        ('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000005', 'FEMININO', NULL, 'AGENDADO', (CURRENT_DATE + 24 + TIME '14:00') AT TIME ZONE 'America/Sao_Paulo', 'Studio Fotolhar', 18, 640.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: futuro distante.', NULL, 0, NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day'),
        ('30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000006', 'CASAL', NULL, 'AGENDADO', NOW() - INTERVAL '2 days', 'Jardim Botanico', 24, 760.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: atencao - data passada.', NULL, 0, NOW() - INTERVAL '9 days', NOW() - INTERVAL '1 day'),
        ('30000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000007', 'FEMININO', NULL, 'REALIZADO', NOW() - INTERVAL '1 day', 'Park Cultural', 20, 580.00, 40.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: atencao - sem upload.', NULL, 25, NOW() - INTERVAL '8 days', NOW() - INTERVAL '50 minutes'),
        ('30000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000008', 'GESTANTE', NULL, 'REALIZADO', NOW() - INTERVAL '3 days', 'Parque Tingui', 20, 620.00, 40.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: atencao - sem upload.', NULL, 25, NOW() - INTERVAL '8 days', NOW() - INTERVAL '1 hour'),
        ('30000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000009', 'FAMILIA', NULL, 'REALIZADO', NOW() - INTERVAL '5 days', 'Casa da Familia', 28, 790.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: atencao - album pendente.', NULL, 35, NOW() - INTERVAL '8 days', NOW() - INTERVAL '70 minutes'),
        ('30000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000010', 'NEWBORN', NULL, 'REALIZADO', NOW() - INTERVAL '4 days', 'Studio Fotolhar', 30, 940.00, 55.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: atencao - album pendente.', NULL, 35, NOW() - INTERVAL '8 days', NOW() - INTERVAL '90 minutes'),
        ('30000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000011', 'INFANTIL', NULL, 'EM_SELECAO', NOW() - INTERVAL '9 days', 'Studio Fotolhar', 3, 590.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: selecao enviada.', NULL, 50, NOW() - INTERVAL '11 days', NOW() - INTERVAL '8 minutes'),
        ('30000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000012', 'FEMININO', NULL, 'EM_SELECAO', NOW() - INTERVAL '11 days', 'Studio Fotolhar', 3, 620.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: selecao enviada com fotos extras.', NULL, 50, NOW() - INTERVAL '11 days', NOW() - INTERVAL '18 minutes'),
        ('30000000-0000-4000-8000-000000000013', '20000000-0000-4000-8000-000000000013', 'BOOK', NULL, 'EM_SELECAO', NOW() - INTERVAL '12 days', 'Studio Fotolhar', 20, 680.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: album sem resposta e expirando.', NULL, 50, NOW() - INTERVAL '12 days', NOW() - INTERVAL '2 hours'),
        ('30000000-0000-4000-8000-000000000014', '20000000-0000-4000-8000-000000000014', 'FEMININO', NULL, 'EM_EDICAO', NOW() - INTERVAL '25 days', 'SDSD', 20, 660.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: edicao atrasada.', NULL, 75, NOW() - INTERVAL '25 days', NOW() - INTERVAL '4 hours'),
        ('30000000-0000-4000-8000-000000000015', '20000000-0000-4000-8000-000000000015', 'FAMILIA', NULL, 'EM_EDICAO', NOW() - INTERVAL '5 days', 'sds', 24, 720.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: edicao normal.', NULL, 75, NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 hours'),
        ('30000000-0000-4000-8000-000000000016', '20000000-0000-4000-8000-000000000016', 'CASAL', NULL, 'FINALIZADO', NOW() - INTERVAL '6 days', 'Serra do Mar', 25, 850.00, 50.00, TRUE, 980.00, 'PENDENTE', 'Cliente ainda nao quitou fotos extras.', 'Seed demo: pagamento pendente.', NULL, 100, NOW() - INTERVAL '10 days', NOW() - INTERVAL '30 minutes'),
        ('30000000-0000-4000-8000-000000000017', '20000000-0000-4000-8000-000000000017', 'NEWBORN', NULL, 'FINALIZADO', NOW() - INTERVAL '15 days', 'Studio Fotolhar', 30, 920.00, 55.00, TRUE, 920.00, 'PAGO', NULL, 'Seed demo: entrega finalizada no mes.', NULL, 100, NOW() - INTERVAL '15 days', NOW() - INTERVAL '6 hours'),
        ('30000000-0000-4000-8000-000000000018', '20000000-0000-4000-8000-000000000018', 'EVENTO', NULL, 'CANCELADO', NOW() - INTERVAL '1 day', 'Espaco Garden', 40, 1200.00, 45.00, FALSE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: ensaio cancelado no pipeline.', NULL, 0, NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 hours'),
        ('30000000-0000-4000-8000-000000000019', '20000000-0000-4000-8000-000000000019', 'INFANTIL', NULL, 'EM_EDICAO', NOW() - INTERVAL '8 days', 'Curitiba, PR', 22, 640.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: card extra em andamento.', NULL, 75, NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 hours'),
        ('30000000-0000-4000-8000-000000000020', '20000000-0000-4000-8000-000000000020', 'BOOK', NULL, 'REALIZADO', NOW() - INTERVAL '2 days', 'Studio Fotolhar', 18, 520.00, 40.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: card extra em andamento.', NULL, 25, NOW() - INTERVAL '7 days', NOW() - INTERVAL '10 hours'),
        ('30000000-0000-4000-8000-000000000021', '20000000-0000-4000-8000-000000000021', 'GESTANTE', NULL, 'AGENDADO', NOW() - INTERVAL '5 days', 'Parque Sao Lourenco', 20, 650.00, 40.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: segunda data passada.', NULL, 0, NOW() - INTERVAL '9 days', NOW() - INTERVAL '1 day'),
        ('30000000-0000-4000-8000-000000000022', '20000000-0000-4000-8000-000000000022', 'INFANTIL', NULL, 'REALIZADO', NOW() - INTERVAL '2 days', 'Studio Fotolhar', 18, 540.00, 40.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: terceira pendencia de upload.', NULL, 25, NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days'),
        ('30000000-0000-4000-8000-000000000023', '20000000-0000-4000-8000-000000000023', 'NEWBORN', NULL, 'REALIZADO', NOW() - INTERVAL '6 days', 'Casa da Familia', 30, 920.00, 55.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: quarta pendencia de upload.', NULL, 25, NOW() - INTERVAL '8 days', NOW() - INTERVAL '2 days'),
        ('30000000-0000-4000-8000-000000000024', '20000000-0000-4000-8000-000000000024', 'FAMILIA', NULL, 'REALIZADO', NOW() - INTERVAL '7 days', 'Parque Tanguá', 25, 700.00, 45.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: terceira pendencia de album.', NULL, 35, NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days'),
        ('30000000-0000-4000-8000-000000000025', '20000000-0000-4000-8000-000000000025', 'DEBUTANTE', NULL, 'EM_SELECAO', NOW() - INTERVAL '10 days', 'Salao Central', 25, 1100.00, 55.00, TRUE, NULL, 'NAO_INFORMADO', NULL, 'Seed demo: terceira selecao enviada.', NULL, 50, NOW() - INTERVAL '11 days', NOW() - INTERVAL '25 minutes');

    INSERT INTO foto (id, ensaio_id, cloudinary_id, nome_original, url_watermark, url_original, ordem, eh_capa, enviada_em)
    VALUES
        ('40000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000009', 'seed/dashboard/009/capa', 'familia-castro-capa.jpg', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '4 days'),
        ('40000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000010', 'seed/dashboard/010/capa', 'bento-capa.jpg', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '3 days'),
        ('40000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000011', 'seed/dashboard/011/capa', 'julia-capa.jpg', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '7 days'),
        ('40000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000011', 'seed/dashboard/011/foto-02', 'julia-02.jpg', 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1400&q=90', 2, FALSE, NOW() - INTERVAL '7 days'),
        ('40000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000012', 'seed/dashboard/012/capa', 'camila-capa.jpg', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '8 days'),
        ('40000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000012', 'seed/dashboard/012/foto-02', 'camila-02.jpg', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=90', 2, FALSE, NOW() - INTERVAL '8 days'),
        ('40000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000012', 'seed/dashboard/012/foto-03', 'camila-03.jpg', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1400&q=90', 3, FALSE, NOW() - INTERVAL '8 days'),
        ('40000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000012', 'seed/dashboard/012/foto-04', 'camila-04.jpg', 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=1400&q=90', 4, FALSE, NOW() - INTERVAL '8 days'),
        ('40000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000012', 'seed/dashboard/012/foto-05', 'camila-05.jpg', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1400&q=90', 5, FALSE, NOW() - INTERVAL '8 days'),
        ('40000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000013', 'seed/dashboard/013/capa', 'helena-capa.jpg', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '8 days'),
        ('40000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000014', 'seed/dashboard/014/capa', 'erick-edicao-capa.jpg', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '20 days'),
        ('40000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000015', 'seed/dashboard/015/capa', 'angelina-capa.jpg', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '4 days'),
        ('40000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000016', 'seed/dashboard/016/capa', 'ana-rafael-capa.jpg', 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '5 days'),
        ('40000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000017', 'seed/dashboard/017/capa', 'miguel-capa.jpg', 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '14 days'),
        ('40000000-0000-4000-8000-000000000023', '30000000-0000-4000-8000-000000000019', 'seed/dashboard/019/capa', 'luisa-capa.jpg', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '5 days'),
        ('40000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000020', 'seed/dashboard/020/capa', 'pedro-capa.jpg', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '2 days'),
        ('40000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000024', 'seed/dashboard/024/capa', 'laura-album-capa.jpg', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '6 days'),
        ('40000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000025', 'seed/dashboard/025/capa', 'paula-capa.jpg', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=90', 1, TRUE, NOW() - INTERVAL '8 days'),
        ('40000000-0000-4000-8000-000000000027', '30000000-0000-4000-8000-000000000025', 'seed/dashboard/025/foto-02', 'paula-02.jpg', 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1400&q=90', 2, FALSE, NOW() - INTERVAL '8 days');

    INSERT INTO album (id, ensaio_id, token_url, senha_hash, acesso_liberado, publicado_em, expira_em, ativo, views, atualizado_em)
    VALUES
        ('50000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000011', 'seed-julia-selecao', crypt('1234', gen_salt('bf')), TRUE, NOW() - INTERVAL '6 days', NOW() + INTERVAL '20 days', TRUE, 12, NOW() - INTERVAL '8 minutes'),
        ('50000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000012', 'seed-camila-extras', crypt('1234', gen_salt('bf')), TRUE, NOW() - INTERVAL '7 days', NOW() + INTERVAL '18 days', TRUE, 17, NOW() - INTERVAL '18 minutes'),
        ('50000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000013', 'seed-helena-expira', crypt('1234', gen_salt('bf')), TRUE, NOW() - INTERVAL '8 days', NOW() + INTERVAL '2 days', TRUE, 9, NOW() - INTERVAL '2 hours'),
        ('50000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000016', 'seed-ana-final', crypt('1234', gen_salt('bf')), TRUE, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', TRUE, 22, NOW() - INTERVAL '30 minutes'),
        ('50000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000017', 'seed-miguel-final', crypt('1234', gen_salt('bf')), TRUE, NOW() - INTERVAL '14 days', NOW() + INTERVAL '16 days', TRUE, 15, NOW() - INTERVAL '6 hours'),
        ('50000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000025', 'seed-paula-selecao', crypt('1234', gen_salt('bf')), TRUE, NOW() - INTERVAL '7 days', NOW() + INTERVAL '21 days', TRUE, 8, NOW() - INTERVAL '25 minutes');

    INSERT INTO selecao_foto (id, album_id, foto_id, finalizada, selecionada_em, total_selecionadas, valor_excedente, observacao)
    VALUES
        ('60000000-0000-4000-8000-000000000011', '50000000-0000-4000-8000-000000000011', '40000000-0000-4000-8000-000000000011', TRUE, NOW() - INTERVAL '8 minutes', 2, 0.00, 'Cliente marcou como favorita.'),
        ('60000000-0000-4000-8000-000000000012', '50000000-0000-4000-8000-000000000011', '40000000-0000-4000-8000-000000000012', TRUE, NOW() - INTERVAL '8 minutes', 2, 0.00, 'Cliente marcou como favorita.'),
        ('60000000-0000-4000-8000-000000000013', '50000000-0000-4000-8000-000000000012', '40000000-0000-4000-8000-000000000013', TRUE, NOW() - INTERVAL '18 minutes', 5, 90.00, 'Selecao com fotos extras.'),
        ('60000000-0000-4000-8000-000000000014', '50000000-0000-4000-8000-000000000012', '40000000-0000-4000-8000-000000000014', TRUE, NOW() - INTERVAL '18 minutes', 5, 90.00, 'Selecao com fotos extras.'),
        ('60000000-0000-4000-8000-000000000015', '50000000-0000-4000-8000-000000000012', '40000000-0000-4000-8000-000000000015', TRUE, NOW() - INTERVAL '18 minutes', 5, 90.00, 'Selecao com fotos extras.'),
        ('60000000-0000-4000-8000-000000000016', '50000000-0000-4000-8000-000000000012', '40000000-0000-4000-8000-000000000016', TRUE, NOW() - INTERVAL '18 minutes', 5, 90.00, 'Selecao com fotos extras.'),
        ('60000000-0000-4000-8000-000000000017', '50000000-0000-4000-8000-000000000012', '40000000-0000-4000-8000-000000000017', TRUE, NOW() - INTERVAL '18 minutes', 5, 90.00, 'Selecao com fotos extras.'),
        ('60000000-0000-4000-8000-000000000025', '50000000-0000-4000-8000-000000000025', '40000000-0000-4000-8000-000000000026', TRUE, NOW() - INTERVAL '25 minutes', 2, 0.00, 'Cliente enviou selecao.'),
        ('60000000-0000-4000-8000-000000000026', '50000000-0000-4000-8000-000000000025', '40000000-0000-4000-8000-000000000027', TRUE, NOW() - INTERVAL '25 minutes', 2, 0.00, 'Cliente enviou selecao.');

    UPDATE historico_status_ensaio
       SET alterado_em = NOW() - INTERVAL '6 days'
     WHERE ensaio_id = '30000000-0000-4000-8000-000000000011'
       AND status = 'EM_SELECAO';

    UPDATE historico_status_ensaio
       SET alterado_em = NOW() - INTERVAL '7 days'
     WHERE ensaio_id = '30000000-0000-4000-8000-000000000012'
       AND status = 'EM_SELECAO';

    UPDATE historico_status_ensaio
       SET alterado_em = NOW() - INTERVAL '8 days'
     WHERE ensaio_id = '30000000-0000-4000-8000-000000000013'
       AND status = 'EM_SELECAO';

    UPDATE historico_status_ensaio
       SET alterado_em = NOW() - INTERVAL '16 days'
     WHERE ensaio_id = '30000000-0000-4000-8000-000000000014'
       AND status = 'EM_EDICAO';

    UPDATE historico_status_ensaio
       SET alterado_em = NOW() - INTERVAL '4 days'
     WHERE ensaio_id = '30000000-0000-4000-8000-000000000025'
       AND status = 'EM_SELECAO';

    RAISE NOTICE 'Seed dashboard demo criado para usuario %. Pendencias, ensaios, fotos, albuns e selecoes foram populados.', v_usuario_id;
END $$;

COMMIT;
