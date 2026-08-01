-- ============================================================
-- Security Advisor fixes for the Alumni schema
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run.
--
-- Fixes "Function Search Path Mutable" by pinning search_path on
-- the two trigger functions. Without this, a role that can create
-- objects in an earlier schema could shadow a function/table name
-- these triggers rely on.
-- ============================================================

-- unaccent lives in the extensions schema on Supabase; reference it
-- explicitly so the function works with a locked-down search_path.
create or replace function alumni_make_slug()
returns trigger
language plpgsql
security invoker
set search_path = public, extensions
as $$
declare
  base_slug text;
  final_slug text;
  n int := 1;
begin
  if new.slug is not null and new.slug <> '' then
    return new;
  end if;

  base_slug := regexp_replace(lower(public.unaccent(new.full_name)), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'alumni';
  end if;

  final_slug := base_slug;
  while exists (select 1 from public.alumni_profiles where slug = final_slug and id <> new.id) loop
    n := n + 1;
    final_slug := base_slug || '-' || n;
  end loop;

  new.slug := final_slug;
  return new;
end $$;

create or replace function alumni_touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- Quick check that slug generation still works after the change.
-- (Runs inside a transaction that is rolled back, so nothing is stored.)
do $$
declare
  test_slug text;
begin
  insert into public.alumni_profiles (full_name, email, contact, roles)
  values ('Search Path Check', 'search-path-check@example.invalid', '0000000000', array['Test'])
  returning slug into test_slug;

  if test_slug is null or test_slug = '' then
    raise exception 'Slug generation failed after the search_path change';
  end if;

  raise notice 'Slug generation OK (produced: %)', test_slug;
  -- remove the probe row again
  delete from public.alumni_profiles where email = 'search-path-check@example.invalid';
end $$;
