-- ============================================================
-- Tisoy Sushi Maki — Supabase / PostgreSQL schema
-- Run this in your Supabase project: SQL Editor → New Query
-- ============================================================

-- Menu (single JSON document)
create table if not exists menu (
  id   text primary key default 'main',
  data jsonb not null default '{}'
);

-- Settings (single JSON document)
create table if not exists settings (
  id   text primary key default 'main',
  data jsonb not null default '{}'
);

-- Images (base64 blobs uploaded via the admin panel)
create table if not exists images (
  id         text primary key,
  data       text        not null,   -- base64-encoded image
  mime_type  text        not null default 'image/jpeg',
  created_at timestamptz not null default now()
);

-- Customer feedback / reviews
create table if not exists feedback (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null default 'Anonymous',
  rating     smallint    not null check (rating between 1 and 5),
  comment    text        not null,
  featured   boolean     not null default false,
  created_at timestamptz not null default now()
);

-- Index for fast featured-feedback queries
create index if not exists feedback_featured_idx
  on feedback (featured, created_at desc);

-- ── Row-Level Security ───────────────────────────────────────
-- The server uses the service-role key, so RLS won't block it.
-- Enabling RLS still protects the tables if anyone mistakenly
-- exposes the anon key directly to the browser.

alter table menu      enable row level security;
alter table settings  enable row level security;
alter table images    enable row level security;
alter table feedback  enable row level security;

-- Allow anyone to read featured feedback (public strip)
create policy "public read featured feedback"
  on feedback for select
  using (featured = true);

-- Block all direct client access to everything else
-- (the Express server uses service-role and bypasses RLS)
