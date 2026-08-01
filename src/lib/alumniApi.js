// ============================================================
// Alumni portal — data access, validation and image handling.
//
// Validation lives here so the registration form and the admin
// panel apply identical rules. The database enforces the same
// constraints again (see supabase/alumni-setup.sql), so a crafted
// request that bypasses the UI still cannot create a bad or
// self-approved record.
// ============================================================
import { supabase } from "../supabaseClient";

export const MAX_ROLES = 3;
export const MAX_PHOTO_BYTES = 1 * 1024 * 1024; // 1 MB
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

const PHOTO_BUCKET = "alumni-photos";

/* ---------------------------------------------------------- */
/* Sanitisation                                                */
/* ---------------------------------------------------------- */

// Strips tags/control characters and collapses whitespace.
// React already escapes rendered values; this prevents unwanted
// markup ever reaching storage (defence in depth) and keeps
// exported CSV clean.
export function clean(value, maxLen = 200) {
  const withoutTags = String(value ?? "").replace(/<[^>]*>/g, "");
  // Replace control characters with spaces without embedding raw
  // control bytes in the source (keeps hyphens, dots, apostrophes).
  let out = "";
  for (const ch of withoutTags) {
    const code = ch.charCodeAt(0);
    out += code < 32 || code === 127 ? " " : ch;
  }
  return out.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

// Guards against CSV formula injection when opening exports in Excel.
export function csvCell(value) {
  const s = String(value ?? "");
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

/* ---------------------------------------------------------- */
/* Validation                                                  */
/* ---------------------------------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Accepts +country codes, spaces, dashes and brackets; 7–15 digits.
const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;

export function normaliseLinkedIn(url) {
  const v = clean(url, 300);
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export function isLinkedInUrl(url) {
  if (!url) return true; // optional field
  try {
    const u = new URL(normaliseLinkedIn(url));
    return (
      (u.protocol === "https:" || u.protocol === "http:") &&
      /(^|\.)linkedin\.com$/i.test(u.hostname)
    );
  } catch {
    return false;
  }
}

/**
 * Validates a registration payload.
 * @returns {Object} field -> error message (empty object when valid)
 */
export function validateAlumni(form, { requireContact = true } = {}) {
  const errors = {};

  const name = clean(form.full_name, 120);
  if (!name) errors.full_name = "Full name is required.";
  else if (name.length < 2) errors.full_name = "Please enter your full name.";

  const email = clean(form.email, 160).toLowerCase();
  if (!email) errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  const contact = clean(form.contact, 25);
  if (requireContact && !contact) errors.contact = "Contact number is required.";
  else if (contact) {
    const digits = contact.replace(/\D/g, "");
    if (!PHONE_RE.test(contact) || digits.length < 7 || digits.length > 15) {
      errors.contact = "Enter a valid contact number.";
    }
  }

  const roles = (form.roles || []).map((r) => clean(r, 80)).filter(Boolean);
  if (roles.length < 1) errors.roles = "Add at least one role you held at iConnect.";
  else if (roles.length > MAX_ROLES) errors.roles = `You can add up to ${MAX_ROLES} roles.`;

  if (form.linkedin && !isLinkedInUrl(form.linkedin)) {
    errors.linkedin = "Enter a valid LinkedIn profile URL.";
  }

  if (form.summary && clean(form.summary, 700).length > 600) {
    errors.summary = "Keep the summary under 600 characters.";
  }

  return errors;
}

export function validatePhoto(file) {
  if (!file) return "";
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return "Photo must be a JPG, PNG or WEBP image.";
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return "Photo must be 1 MB or smaller.";
  }
  return "";
}

/* ---------------------------------------------------------- */
/* Image optimisation                                          */
/* ---------------------------------------------------------- */

/**
 * Renders a user-chosen crop region to a square JPEG.
 * `cropPixels` comes from react-easy-crop's onCropComplete, so the
 * person decides exactly which part of their photo is used rather
 * than relying on an automatic centre crop.
 */
export function cropToBlob(imageSrc, cropPixels, size = 600) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("That file is not a readable image."));
    img.onload = () => {
      const out = Math.min(size, Math.round(cropPixels.width));
      const canvas = document.createElement("canvas");
      canvas.width = out;
      canvas.height = out;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        img,
        cropPixels.x, cropPixels.y, cropPixels.width, cropPixels.height,
        0, 0, out, out
      );
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Image processing failed."))),
        "image/jpeg",
        0.85
      );
    };
    img.src = imageSrc;
  });
}

/**
 * Downscales and re-encodes an image in the browser before upload:
 * square crop, max 600px, JPEG q0.85. Keeps storage small and
 * strips EXIF metadata (including GPS) as a privacy benefit.
 * Used as the fallback when no manual crop was made.
 */
export function optimiseImage(file, size = 600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a readable image."));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        const out = Math.min(size, side);

        const canvas = document.createElement("canvas");
        canvas.width = out;
        canvas.height = out;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);

        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Image processing failed."))),
          "image/jpeg",
          0.85
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function uploadPhoto(blob, folder) {
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.jpg`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, blob, { cacheControl: "31536000", contentType: "image/jpeg" });
  if (error) throw error;
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

/* ---------------------------------------------------------- */
/* Public: registration                                        */
/* ---------------------------------------------------------- */

const DUPLICATE_CODE = "23505";

/**
 * Submits a public registration. The row is always created as
 * pending + hidden; RLS rejects anything else.
 */
export async function submitRegistration(form, photoFile) {
  const errors = validateAlumni(form);
  const photoError = validatePhoto(photoFile);
  if (photoError) errors.photo = photoError;
  if (Object.keys(errors).length) return { ok: false, errors };

  // photoFile may already be a cropped Blob produced by the manual
  // cropper; only raw Files still need the automatic centre crop.
  let photo_url = "";
  if (photoFile) {
    const blob = photoFile instanceof File ? await optimiseImage(photoFile) : photoFile;
    photo_url = await uploadPhoto(blob, "submissions");
  }

  const row = {
    full_name: clean(form.full_name, 120),
    email: clean(form.email, 160).toLowerCase(),
    contact: clean(form.contact, 25),
    roles: (form.roles || []).map((r) => clean(r, 80)).filter(Boolean),
    current_organization: clean(form.current_organization, 160),
    current_designation: clean(form.current_designation, 160),
    linkedin: form.linkedin ? normaliseLinkedIn(form.linkedin) : "",
    summary: clean(form.summary, 600),
    photo_url,
    status: "pending",
    is_hidden: true,
    source: "public",
  };

  // Deliberately no .select() here. Reading the row back would make
  // PostgREST run a SELECT as the anonymous role, which the public read
  // policy (correctly) denies for pending profiles — that would abort the
  // whole insert. The caller only needs to know it succeeded.
  const { error } = await supabase.from("alumni_profiles").insert(row);

  if (error) {
    if (error.code === DUPLICATE_CODE) {
      return {
        ok: false,
        errors: { email: "This email is already registered with the Alumni Network." },
      };
    }
    return { ok: false, errors: { form: error.message } };
  }

  return { ok: true, data: { full_name: row.full_name, email: row.email } };
}

/* ---------------------------------------------------------- */
/* Public: directory                                           */
/* ---------------------------------------------------------- */

// RLS already restricts this to approved + visible rows; the explicit
// filters keep the intent obvious and the query index-friendly.
const PUBLIC_FIELDS =
  "id, slug, full_name, roles, current_organization, current_designation, linkedin, photo_url, summary, approved_at";

export async function fetchApprovedAlumni() {
  const { data, error } = await supabase
    .from("alumni_profiles")
    .select(PUBLIC_FIELDS)
    .eq("status", "approved")
    .eq("is_hidden", false)
    .order("approved_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function fetchAlumniBySlug(slug) {
  const { data, error } = await supabase
    .from("alumni_profiles")
    .select(PUBLIC_FIELDS)
    .eq("slug", slug)
    .eq("status", "approved")
    .eq("is_hidden", false)
    .maybeSingle();
  if (error) return null;
  return data;
}

/* ---------------------------------------------------------- */
/* Admin                                                       */
/* ---------------------------------------------------------- */

export async function fetchAllAlumni() {
  const { data, error } = await supabase
    .from("alumni_profiles")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateAlumni(id, patch) {
  const { error } = await supabase.from("alumni_profiles").update(patch).eq("id", id);
  if (error) throw error;
}

export async function setStatus(ids, status) {
  const patch = { status };
  if (status === "approved") {
    patch.is_hidden = false;
    patch.approved_at = new Date().toISOString();
  }
  if (status === "rejected" || status === "pending") {
    patch.is_hidden = true;
  }
  const { error } = await supabase.from("alumni_profiles").update(patch).in("id", ids);
  if (error) throw error;
}

export async function setHidden(ids, hidden) {
  const { error } = await supabase
    .from("alumni_profiles")
    .update({ is_hidden: hidden })
    .in("id", ids);
  if (error) throw error;
}

export async function deleteAlumni(ids) {
  const { error } = await supabase.from("alumni_profiles").delete().in("id", ids);
  if (error) throw error;
}

/** Admin-created profiles skip the queue and are approved immediately. */
export async function createAlumniAsAdmin(form, photoFile) {
  const errors = validateAlumni(form, { requireContact: false });
  const photoError = validatePhoto(photoFile);
  if (photoError) errors.photo = photoError;
  if (Object.keys(errors).length) return { ok: false, errors };

  let photo_url = form.photo_url || "";
  if (photoFile) {
    const blob = await optimiseImage(photoFile);
    photo_url = await uploadPhoto(blob, "admin");
  }

  const row = {
    full_name: clean(form.full_name, 120),
    email: clean(form.email, 160).toLowerCase(),
    contact: clean(form.contact, 25),
    roles: (form.roles || []).map((r) => clean(r, 80)).filter(Boolean),
    current_organization: clean(form.current_organization, 160),
    current_designation: clean(form.current_designation, 160),
    linkedin: form.linkedin ? normaliseLinkedIn(form.linkedin) : "",
    summary: clean(form.summary, 600),
    photo_url,
    status: "approved",
    is_hidden: false,
    source: "admin",
    approved_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("alumni_profiles").insert(row);
  if (error) {
    if (error.code === DUPLICATE_CODE) {
      return { ok: false, errors: { email: "That email is already in the alumni list." } };
    }
    return { ok: false, errors: { form: error.message } };
  }
  return { ok: true };
}

/** Replaces the photo on an existing profile (admin only). */
export async function replacePhoto(id, photoFile) {
  const err = validatePhoto(photoFile);
  if (err) throw new Error(err);
  const blob = await optimiseImage(photoFile);
  const url = await uploadPhoto(blob, "admin");
  await updateAlumni(id, { photo_url: url });
  return url;
}

/* ---------------------------------------------------------- */
/* Email notifications                                         */
/* ---------------------------------------------------------- */

/**
 * Sends a transactional email through the `alumni-email` Edge
 * Function (see supabase/functions/alumni-email/). The function is
 * optional: until it is deployed this resolves to
 * { ok:false, skipped:true } and the caller simply carries on, so
 * registration and approval never fail because of email.
 */
export async function sendAlumniEmail(kind, profile) {
  try {
    const { data, error } = await supabase.functions.invoke("alumni-email", {
      body: {
        kind, // "registered" | "approved"
        name: profile.full_name,
        email: profile.email,
        slug: profile.slug || "",
      },
    });
    if (error) return { ok: false, skipped: true, error: error.message };
    return { ok: true, data };
  } catch (e) {
    return { ok: false, skipped: true, error: e.message };
  }
}
