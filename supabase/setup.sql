-- ============================================================
-- iConnect Website — Supabase setup
-- Paste this WHOLE file into: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run (idempotent).
-- ============================================================

-- ---------- TEAM ARCHIVE ----------
create table if not exists team_sessions (
  id uuid primary key default gen_random_uuid(),
  year text not null unique,
  is_current boolean not null default false,
  sort integer not null default 0,
  created_at timestamptz default now()
);

create table if not exists team_groups (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references team_sessions(id) on delete cascade,
  name text not null,
  sort integer not null default 0
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references team_groups(id) on delete cascade,
  name text not null,
  role text not null default '',
  linkedin text not null default '',
  photo_url text not null default '',
  color text not null default 'card-blue',
  sort integer not null default 0
);

-- ---------- GALLERY ----------
create table if not exists gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort integer not null default 0
);

create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references gallery_albums(id) on delete cascade,
  url text not null,
  caption text not null default '',
  height integer not null default 400,
  sort integer not null default 0
);

-- ---------- ALUMNI ----------
create table if not exists alumni_batches (
  id uuid primary key default gen_random_uuid(),
  year text not null unique,
  sort integer not null default 0
);

create table if not exists alumni_members (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references alumni_batches(id) on delete cascade,
  name text not null,
  role text not null default '',
  now_at text not null default '',
  linkedin text not null default '',
  photo_url text not null default '',
  sort integer not null default 0
);

-- ---------- SITE SETTINGS (announcement bar, recruitment banner) ----------
create table if not exists site_settings (
  key text primary key,
  value jsonb not null
);

-- ---------- ROW LEVEL SECURITY ----------
-- Everyone can read; only logged-in admin users can write.
do $$
declare t text;
begin
  foreach t in array array['team_sessions','team_groups','team_members','gallery_albums','gallery_photos','alumni_batches','alumni_members','site_settings']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);
    execute format('drop policy if exists "admin write" on %I', t);
    execute format('create policy "admin write" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ---------- STORAGE (photos) ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- Done. Now create an admin user (Authentication → Users → Add user, Auto Confirm ON)
-- and log in at /admin on the website.
