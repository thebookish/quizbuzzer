ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

ALTER TABLE public.rounds ADD COLUMN IF NOT EXISTS question_number INTEGER DEFAULT 1;

ALTER TABLE public.buzzer_events ADD COLUMN IF NOT EXISTS question_number INTEGER DEFAULT 1;

ALTER PUBLICATION supabase_realtime ADD TABLE public.topics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
