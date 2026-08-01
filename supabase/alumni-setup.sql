-- ============================================================
-- iConnect — Alumni Portal schema
-- Paste this WHOLE file into: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run (idempotent).
--
-- Security model
--   * Anonymous visitors may INSERT a registration, but RLS forces
--     status='pending' and is_hidden=true, so nothing self-publishes.
--   * Anonymous visitors may SELECT only approved, non-hidden rows.
--   * Authenticated admins may do everything.
-- ============================================================

create extension if not exists "unaccent";

-- ---------- MAIN TABLE ----------
create table if not exists alumni_profiles (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text unique,
  full_name            text    not null,
  email                text    not null,
  contact              text    not null default '',
  -- Ordered list; roles[1] is the primary role shown first.
  roles                text[]  not null default '{}',
  current_organization text    not null default '',
  current_designation  text    not null default '',
  linkedin             text    not null default '',
  photo_url            text    not null default '',
  summary              text    not null default '',
  status               text    not null default 'pending',
  is_hidden            boolean not null default true,
  source               text    not null default 'public',
  admin_note           text    not null default '',
  submitted_at         timestamptz not null default now(),
  approved_at          timestamptz,
  updated_at           timestamptz not null default now(),

  constraint alumni_status_valid  check (status in ('pending','approved','rejected')),
  constraint alumni_source_valid  check (source in ('public','admin')),
  constraint alumni_roles_count   check (array_length(roles,1) between 1 and 3),
  constraint alumni_name_len      check (char_length(full_name) between 2 and 120),
  constraint alumni_email_format  check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint alumni_summary_len   check (char_length(summary) <= 600)
);

-- One registration per email address (case-insensitive)
create unique index if not exists alumni_email_unique
  on alumni_profiles (lower(email));

create index if not exists alumni_status_idx     on alumni_profiles (status);
create index if not exists alumni_submitted_idx  on alumni_profiles (submitted_at desc);
create index if not exists alumni_public_idx     on alumni_profiles (status, is_hidden);

-- ---------- SLUG GENERATION ----------
-- Produces a URL-safe unique slug, e.g. "vipin-kumar", "vipin-kumar-2".
create or replace function alumni_make_slug()
returns trigger
language plpgsql
as $$
declare
  base_slug text;
  final_slug text;
  n int := 1;
begin
  if new.slug is not null and new.slug <> '' then
    return new;
  end if;

  base_slug := regexp_replace(lower(unaccent(new.full_name)), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'alumni';
  end if;

  final_slug := base_slug;
  while exists (select 1 from alumni_profiles where slug = final_slug and id <> new.id) loop
    n := n + 1;
    final_slug := base_slug || '-' || n;
  end loop;

  new.slug := final_slug;
  return new;
end $$;

drop trigger if exists alumni_slug_trigger on alumni_profiles;
create trigger alumni_slug_trigger
  before insert or update of full_name on alumni_profiles
  for each row execute function alumni_make_slug();

-- Keep updated_at fresh
create or replace function alumni_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists alumni_updated_trigger on alumni_profiles;
create trigger alumni_updated_trigger
  before update on alumni_profiles
  for each row execute function alumni_touch_updated_at();

-- ---------- ROW LEVEL SECURITY ----------
alter table alumni_profiles enable row level security;

-- Public can read ONLY approved and visible profiles.
drop policy if exists "alumni public read" on alumni_profiles;
create policy "alumni public read" on alumni_profiles
  for select
  using (status = 'approved' and is_hidden = false);

-- Public may submit a registration, but cannot choose its own status.
-- Anything other than a pending, hidden, public-sourced row is rejected.
drop policy if exists "alumni public insert" on alumni_profiles;
create policy "alumni public insert" on alumni_profiles
  for insert
  to anon
  with check (
    status = 'pending'
    and is_hidden = true
    and source = 'public'
    and approved_at is null
    and admin_note = ''
    and array_length(roles, 1) between 1 and 3
  );

-- Admins (any signed-in user) have full control.
drop policy if exists "alumni admin all" on alumni_profiles;
create policy "alumni admin all" on alumni_profiles
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- STORAGE ----------
-- Dedicated bucket so anonymous uploads never touch the main media bucket.
-- 1 MB cap and image-only MIME types are enforced by storage itself.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'alumni-photos', 'alumni-photos', true, 1048576,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "alumni photos public read" on storage.objects;
create policy "alumni photos public read" on storage.objects
  for select using (bucket_id = 'alumni-photos');

-- Anonymous applicants may upload, but only into the submissions/ folder.
drop policy if exists "alumni photos anon insert" on storage.objects;
create policy "alumni photos anon insert" on storage.objects
  for insert to anon
  with check (
    bucket_id = 'alumni-photos'
    and (storage.foldername(name))[1] = 'submissions'
  );

drop policy if exists "alumni photos admin write" on storage.objects;
create policy "alumni photos admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'alumni-photos');

drop policy if exists "alumni photos admin update" on storage.objects;
create policy "alumni photos admin update" on storage.objects
  for update to authenticated using (bucket_id = 'alumni-photos');

drop policy if exists "alumni photos admin delete" on storage.objects;
create policy "alumni photos admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'alumni-photos');

-- ---------- OPTIONAL CLEANUP ----------
-- The old curated-alumni tables are unused (they were always empty).
-- Uncomment to remove them once you are happy with the new portal:
-- drop table if exists alumni_members;
-- drop table if exists alumni_batches;

-- Done.
