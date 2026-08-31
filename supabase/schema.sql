-- VoiceGuard AI Supabase PostgreSQL Schema

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free',
  scans_remaining INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Voice Scans Table
CREATE TABLE IF NOT EXISTS public.voice_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT,
  file_size INT,
  duration NUMERIC(10, 2),
  format TEXT,
  result_label TEXT NOT NULL CHECK (result_label IN ('REAL', 'FAKE', 'SUSPICIOUS')),
  confidence_score NUMERIC(5, 2) NOT NULL,
  pitch_variance_score NUMERIC(5, 2),
  spectral_centroid_score NUMERIC(5, 2),
  harmonic_distortion_score NUMERIC(5, 2),
  jitter_score NUMERIC(5, 2),
  anomalies_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Scan Anomalies Table
CREATE TABLE IF NOT EXISTS public.scan_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES public.voice_scans(id) ON DELETE CASCADE,
  start_time NUMERIC(10, 2) NOT NULL,
  end_time NUMERIC(10, 2) NOT NULL,
  anomaly_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Developer API Keys Table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow users to manage their own records & allow public insert for demo mode)
CREATE POLICY "Allow public select on voice_scans" ON public.voice_scans FOR SELECT USING (true);
CREATE POLICY "Allow public insert on voice_scans" ON public.voice_scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on voice_scans" ON public.voice_scans FOR DELETE USING (true);

CREATE POLICY "Allow public select on scan_anomalies" ON public.scan_anomalies FOR SELECT USING (true);
CREATE POLICY "Allow public insert on scan_anomalies" ON public.scan_anomalies FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on api_keys" ON public.api_keys FOR SELECT USING (true);
CREATE POLICY "Allow public insert on api_keys" ON public.api_keys FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on api_keys" ON public.api_keys FOR DELETE USING (true);

CREATE POLICY "Allow public select on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on profiles" ON public.profiles FOR UPDATE USING (true);

-- Create Storage Bucket for audio samples
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio_samples', 'audio_samples', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Audio Storage Access" ON storage.objects 
FOR ALL USING (bucket_id = 'audio_samples');
