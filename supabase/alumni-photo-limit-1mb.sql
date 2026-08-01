-- ============================================================
-- Lower the alumni photo upload limit from 5 MB to 1 MB.
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run.
--
-- The browser already rejects files over 1 MB, but storage
-- enforces it too so the limit cannot be bypassed.
-- ============================================================

update storage.buckets
set file_size_limit = 1048576,                                    -- 1 MB
    allowed_mime_types = array['image/jpeg','image/png','image/webp']
where id = 'alumni-photos';

-- Confirm
select id, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'alumni-photos';
