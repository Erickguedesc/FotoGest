------------------------------------
-- Histórico completo de status
-- Permite múltiplas entradas do mesmo status no mesmo ensaio.
------------------------------------

ALTER TABLE historico_status_ensaio
DROP CONSTRAINT IF EXISTS historico_status_ensaio_ensaio_id_status_key;

CREATE INDEX IF NOT EXISTS idx_historico_status_ensaio_ensaio_status_alterado
ON historico_status_ensaio(ensaio_id, status, alterado_em DESC);

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
    );
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
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
WHERE NOT EXISTS (
  SELECT 1
  FROM historico_status_ensaio historico
  WHERE historico.ensaio_id = ensaio.id
    AND historico.status = ensaio.status
);
