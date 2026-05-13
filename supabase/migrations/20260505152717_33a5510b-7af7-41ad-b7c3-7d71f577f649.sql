CREATE TABLE public.playbook_kv (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.playbook_kv ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read playbook_kv" ON public.playbook_kv FOR SELECT USING (true);
CREATE POLICY "Public insert playbook_kv" ON public.playbook_kv FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update playbook_kv" ON public.playbook_kv FOR UPDATE USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.playbook_kv;
ALTER TABLE public.playbook_kv REPLICA IDENTITY FULL;