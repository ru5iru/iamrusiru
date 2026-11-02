CREATE TABLE public.blogger_cache (
  blog_id text PRIMARY KEY,
  snapshot jsonb NOT NULL DEFAULT '{"posts":[]}'::jsonb,
  refreshed_at timestamptz,
  staging_posts jsonb NOT NULL DEFAULT '[]'::jsonb,
  next_page_token text,
  importing boolean NOT NULL DEFAULT false,
  lease_until timestamptz,
  retry_after timestamptz
);
GRANT ALL ON public.blogger_cache TO service_role;
ALTER TABLE public.blogger_cache ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.blogger_cache IS 'Service-only cache for sanitized public Blogger articles. No direct browser access.';