BEGIN;

DELETE FROM cliente
WHERE email LIKE 'demo.relatorio.completo.%@fotogest.local';

COMMIT;
