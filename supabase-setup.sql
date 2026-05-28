-- SkillApply AI — Supabase setup
-- Run this in your Supabase SQL editor before deploying

-- Training content table (only ever 1 row — upserted on save)
create table if not exists training_content (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  updated_at timestamptz default now()
);

-- Situation cards table
create table if not exists situation_cards (
  id uuid primary key default gen_random_uuid(),
  card_text text not null,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- Coaching sessions log (optional for V1 analytics later)
create table if not exists coaching_sessions (
  id uuid primary key default gen_random_uuid(),
  situation text,
  what_happened text,
  desired_outcome text,
  ai_response jsonb,
  created_at timestamptz default now()
);

-- RLS: disable for now (admin-only app, no public user accounts)
alter table training_content disable row level security;
alter table situation_cards disable row level security;
alter table coaching_sessions disable row level security;
