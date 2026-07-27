import { createClient } from "@supabase/supabase-js";

// The publishable key is designed to be public (client-side) — writes are
// protected by Row Level Security: only authenticated admin users can modify data.
const SUPABASE_URL = "https://srjczytqgaolfzviszsw.supabase.co";
const SUPABASE_KEY = "sb_publishable_Hu9GV2NsT_OCCiY4hyksGg_nZOTzy6a";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Public URL for a file in the "media" storage bucket
export function mediaUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}
