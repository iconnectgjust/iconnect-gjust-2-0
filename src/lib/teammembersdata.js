// Looks up a single team member's profile by slug, reusing the same
// year-wise fetch (and its cache) that powers the Team Archive — no
// separate Supabase table or extra columns needed.
import { fetchTeamYears } from "./publicData";
import teamJson from "../data/team.json";

function slugify(str) {
  return (str || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// The note is one shared piece of copy for every member (not per-person
// data), so it's read straight from the root of team.json — add
// `"note": "..."` there once, and it appears on every profile page.
const sharedNote = teamJson.noteteam || "";
const mentorNote = teamJson.notementor || "";

// → {slug, name, role, img, color, linkedin, rollNo, department, branch,
//    note, year, current, group} | null
export async function fetchTeamMember(slug) {
  if (!slug) return null;
  const years = await fetchTeamYears();

  // A member can appear in more than one year's roster (e.g. promoted the
  // next year) — prefer the current year's entry, otherwise the most
  // recent year they appear in (years are already sorted newest-first).
  let fallbackMatch = null;

  for (const y of years) {
    for (const group of y.groups) {
      for (const m of group.members) {
        if ((m.slug || slugify(m.name)) === slug) {
          const found = {
            ...m,
            slug,
            noteteam: sharedNote,
            notementor: mentorNote,
            year: y.year,
            current: !!y.current,
            group: group.name,
          };
          if (y.current) return found;
          if (!fallbackMatch) fallbackMatch = found;
        }
      }
    }
  }

  return fallbackMatch;
}