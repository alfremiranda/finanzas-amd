-- Finanzas AMD — schema simplificado (PoC personal, sin auth)
-- Ejecutar en: Supabase Dashboard → SQL Editor

CREATE TABLE months (
  key        TEXT PRIMARY KEY,
  data       JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE months ENABLE ROW LEVEL SECURITY;

-- Acceso abierto con la anon key del proyecto
CREATE POLICY "anon_access" ON months FOR ALL USING (true) WITH CHECK (true);
