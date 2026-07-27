// Live site data from Supabase, with the bundled JSON files as fallback so the
// site keeps working before setup / offline. All fetches are cached per page load.
import { supabase } from "../supabaseClient";
import teamJson from "../data/team.json";
import galleryJson from "../data/gallery.json";
import alumniJson from "../data/alumni.json";
import announcementsJson from "../data/announcements.json";
import { assetUrl } from "../assetMap";

// Resolves a photo reference: full URL (Supabase) or bundled asset filename (JSON)
export function photoSrc(ref) {
  if (!ref) return "";
  return /^https?:\/\//.test(ref) ? ref : assetUrl(ref);
}

const cache = {};
async function cached(key, fn) {
  if (!(key in cache)) cache[key] = fn().catch(() => null);
  return cache[key];
}
export function clearDataCache() {
  for (const k in cache) delete cache[k];
}

const jsonTeamFallback = () =>
  teamJson.years.map((y) => ({
    year: y.year,
    current: !!y.current,
    groups: [
      { name: "Captains", members: y.captains || [] },
      { name: "Heads", members: y.heads || [] },
      { name: "Leads", members: y.leads || [] },
      { name: "Coordinators", members: y.coordinators || [] },
    ]
      .filter((g) => g.members.length > 0)
      .map((g) => ({
        name: g.name,
        members: g.members.map((m) => ({
          name: m.name, role: m.role, img: m.img, color: m.color, linkedin: m.linkedin || "",
        })),
      })),
  }));

// → [{year, current, groups: [{name, members: [{name, role, img, color, linkedin}]}]}]
export async function fetchTeamYears() {
  const live = await cached("team", async () => {
    const { data: sessions, error } = await supabase
      .from("team_sessions")
      .select("id, year, is_current, sort, team_groups(id, name, sort, team_members(name, role, linkedin, photo_url, color, sort))")
      .order("sort", { ascending: false });
    if (error || !sessions?.length) return null;
    return sessions.map((s) => ({
      year: s.year,
      current: s.is_current,
      groups: (s.team_groups || [])
        .sort((a, b) => a.sort - b.sort)
        .map((g) => ({
          name: g.name,
          members: (g.team_members || [])
            .sort((a, b) => a.sort - b.sort)
            .map((m) => ({ name: m.name, role: m.role, img: m.photo_url, color: m.color, linkedin: m.linkedin })),
        }))
        .filter((g) => g.members.length > 0),
    }));
  });
  return live || jsonTeamFallback();
}

// → [{id, title, images: [{img, caption, height}]}]
export async function fetchGalleryAlbums() {
  const live = await cached("gallery", async () => {
    const { data, error } = await supabase
      .from("gallery_albums")
      .select("id, title, sort, gallery_photos(url, caption, height, sort)")
      .order("sort");
    if (error || !data?.length) return null;
    return data.map((a) => ({
      id: a.id,
      title: a.title,
      images: (a.gallery_photos || [])
        .sort((x, y) => x.sort - y.sort)
        .map((p) => ({ img: p.url, caption: p.caption, height: p.height || 400 })),
    }));
  });
  return (
    live ||
    galleryJson.albums.map((a) => ({
      id: a.id,
      title: a.title,
      images: a.images.map((i) => ({ img: assetUrl(i.file), caption: i.caption, height: i.height || 400 })),
    }))
  );
}

// → [{year, members: [{name, role, now, linkedin, img}]}]
export async function fetchAlumni() {
  const live = await cached("alumni", async () => {
    const { data, error } = await supabase
      .from("alumni_batches")
      .select("year, sort, alumni_members(name, role, now_at, linkedin, photo_url, sort)")
      .order("sort", { ascending: false });
    if (error || !data?.length) return null;
    return data.map((b) => ({
      year: b.year,
      members: (b.alumni_members || [])
        .sort((x, y) => x.sort - y.sort)
        .map((m) => ({ name: m.name, role: m.role, now: m.now_at, linkedin: m.linkedin, img: m.photo_url })),
    }));
  });
  return live || alumniJson.batches;
}

// → { announcement: {...}, recruitment: {...} }
export async function fetchSettings() {
  const live = await cached("settings", async () => {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error || !data?.length) return null;
    const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
    return map.announcements || null;
  });
  return live || announcementsJson;
}
