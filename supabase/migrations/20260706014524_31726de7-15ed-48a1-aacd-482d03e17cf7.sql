
CREATE TABLE public.ai_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ai_chat_messages_user_created_idx ON public.ai_chat_messages(user_id, created_at);
GRANT SELECT, INSERT, DELETE ON public.ai_chat_messages TO authenticated;
GRANT ALL ON public.ai_chat_messages TO service_role;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages select" ON public.ai_chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own messages insert" ON public.ai_chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own messages delete" ON public.ai_chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.ai_chat_usage (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  message_count INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, usage_date)
);
GRANT SELECT ON public.ai_chat_usage TO authenticated;
GRANT ALL ON public.ai_chat_usage TO service_role;
ALTER TABLE public.ai_chat_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own usage select" ON public.ai_chat_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
