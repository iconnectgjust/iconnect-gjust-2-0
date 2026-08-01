import { useEffect, useRef, useState } from "react";
import "./AlumniRegisterModal.css";
import {
  MAX_ROLES,
  submitRegistration,
  validatePhoto,
  sendAlumniEmail,
} from "../lib/alumniApi";

const EMPTY = {
  full_name: "",
  email: "",
  contact: "",
  current_organization: "",
  current_designation: "",
  linkedin: "",
  summary: "",
};

/**
 * Slide-over registration panel.
 * Roles are typed manually (no fixed dropdown), 1–3 of them, and can be
 * reordered — the first role is the primary one shown on the profile.
 */
function AlumniRegisterModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [roles, setRoles] = useState([""]);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);
  const openedAt = useRef(0);

  // Reset whenever the panel is opened
  useEffect(() => {
    if (!open) return;
    setForm(EMPTY);
    setRoles([""]);
    setPhoto(null);
    setPhotoPreview("");
    setErrors({});
    setBusy(false);
    setDone(false);
    setHoneypot("");
    openedAt.current = Date.now();
    const t = setTimeout(() => firstFieldRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [open]);

  // Esc to close + prevent background scrolling while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Release the object URL used for the preview
  useEffect(() => () => photoPreview && URL.revokeObjectURL(photoPreview), [photoPreview]);

  if (!open) return null;

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined, form: undefined }));
  };

  /* ---------- roles ---------- */
  const setRole = (i, value) => {
    setRoles((r) => r.map((v, idx) => (idx === i ? value : v)));
    setErrors((er) => ({ ...er, roles: undefined }));
  };
  const addRole = () => setRoles((r) => (r.length < MAX_ROLES ? [...r, ""] : r));
  const removeRole = (i) => setRoles((r) => (r.length > 1 ? r.filter((_, idx) => idx !== i) : r));
  const moveRole = (i, dir) => {
    setRoles((r) => {
      const next = [...r];
      const j = i + dir;
      if (j < 0 || j >= next.length) return r;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  /* ---------- photo ---------- */
  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validatePhoto(file);
    if (err) {
      setErrors((er) => ({ ...er, photo: err }));
      return;
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrors((er) => ({ ...er, photo: undefined }));
  };

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview("");
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    // Bot traps: hidden field must stay empty, and a real person
    // cannot complete this form in under three seconds.
    if (honeypot.trim() !== "" || Date.now() - openedAt.current < 3000) {
      setErrors({ form: "Submission blocked. Please take a moment and try again." });
      return;
    }

    setBusy(true);
    setErrors({});
    try {
      const payload = { ...form, roles };
      const res = await submitRegistration(payload, photo);
      if (!res.ok) {
        setErrors(res.errors || { form: "Something went wrong. Please try again." });
        setBusy(false);
        return;
      }
      // Email is best-effort — registration already succeeded.
      sendAlumniEmail("registered", { full_name: form.full_name, email: form.email });
      setDone(true);
    } catch (err) {
      setErrors({ form: err.message || "Something went wrong. Please try again." });
    }
    setBusy(false);
  };

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="alr-backdrop" onMouseDown={onBackdrop}>
      <div
        className="alr-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alr-title"
      >
        <button className="alr-close" onClick={onClose} aria-label="Close registration form">
          <i className="bx bx-x"></i>
        </button>

        {done ? (
          <div className="alr-success" role="status">
            <div className="alr-successicon"><i className="bx bx-check"></i></div>
            <h2>Thank you for registering as an iConnect Alumni.</h2>
            <p>Your profile has been successfully submitted.</p>
            <p>Our team will verify your details.</p>
            <p>Your Alumni status will be reviewed within <strong>7 working days</strong>.</p>
            <p>You will receive updates through your registered email address.</p>
            <button className="alr-submit" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="alr-form" onSubmit={handleSubmit} noValidate>
            <h2 id="alr-title">Join the Alumni Network</h2>
            <p className="alr-sub">
              Tell us where you are now — approved profiles appear in the public alumni directory.
            </p>

            {/* Honeypot: hidden from humans, tempting to bots */}
            <input
              className="alr-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />

            <fieldset className="alr-group">
              <legend>Personal information</legend>

              <label className="alr-field">
                <span>Full name <b aria-hidden="true">*</b></span>
                <input
                  ref={firstFieldRef}
                  type="text"
                  value={form.full_name}
                  onChange={setField("full_name")}
                  aria-invalid={!!errors.full_name}
                  autoComplete="name"
                  required
                />
                {errors.full_name && <em className="alr-err">{errors.full_name}</em>}
              </label>

              <div className="alr-row">
                <label className="alr-field">
                  <span>Email address <b aria-hidden="true">*</b></span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                    required
                  />
                  {errors.email && <em className="alr-err">{errors.email}</em>}
                </label>

                <label className="alr-field">
                  <span>Contact number <b aria-hidden="true">*</b></span>
                  <input
                    type="tel"
                    value={form.contact}
                    onChange={setField("contact")}
                    aria-invalid={!!errors.contact}
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    required
                  />
                  {errors.contact && <em className="alr-err">{errors.contact}</em>}
                </label>
              </div>
            </fieldset>

            <fieldset className="alr-group">
              <legend>Role(s) held at iConnect</legend>
              <p className="alr-hint">
                Type your roles in your own words. Add up to {MAX_ROLES}. The first one is your
                primary role and appears first on your profile.
              </p>

              {roles.map((role, i) => (
                <div className="alr-rolerow" key={i}>
                  <span className="alr-rolenum">{i + 1}</span>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(i, e.target.value)}
                    placeholder={i === 0 ? "e.g. President" : "e.g. Technical Lead"}
                    aria-label={`Role ${i + 1}${i === 0 ? " (primary)" : ""}`}
                  />
                  <button
                    type="button"
                    className="alr-iconbtn"
                    onClick={() => moveRole(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move role ${i + 1} up`}
                  >↑</button>
                  <button
                    type="button"
                    className="alr-iconbtn"
                    onClick={() => moveRole(i, 1)}
                    disabled={i === roles.length - 1}
                    aria-label={`Move role ${i + 1} down`}
                  >↓</button>
                  <button
                    type="button"
                    className="alr-iconbtn alr-iconbtn-danger"
                    onClick={() => removeRole(i)}
                    disabled={roles.length === 1}
                    aria-label={`Remove role ${i + 1}`}
                  >✕</button>
                </div>
              ))}

              {errors.roles && <em className="alr-err">{errors.roles}</em>}

              {roles.length < MAX_ROLES && (
                <button type="button" className="alr-addrole" onClick={addRole}>
                  + Add another role
                </button>
              )}
            </fieldset>

            <fieldset className="alr-group">
              <legend>Where you are now</legend>

              <label className="alr-field">
                <span>Company / startup / institution</span>
                <input
                  type="text"
                  value={form.current_organization}
                  onChange={setField("current_organization")}
                  placeholder="e.g. Infosys · own startup · IIT Delhi (M.Tech)"
                  autoComplete="organization"
                />
              </label>

              <label className="alr-field">
                <span>Current designation</span>
                <input
                  type="text"
                  value={form.current_designation}
                  onChange={setField("current_designation")}
                  placeholder="e.g. Software Engineer · Founder · Research Scholar"
                  autoComplete="organization-title"
                />
              </label>

              <label className="alr-field">
                <span>LinkedIn profile URL</span>
                <input
                  type="url"
                  value={form.linkedin}
                  onChange={setField("linkedin")}
                  aria-invalid={!!errors.linkedin}
                  placeholder="https://www.linkedin.com/in/your-profile"
                />
                {errors.linkedin && <em className="alr-err">{errors.linkedin}</em>}
              </label>

              <label className="alr-field">
                <span>Short professional summary <i>(optional)</i></span>
                <textarea
                  value={form.summary}
                  onChange={setField("summary")}
                  rows={3}
                  maxLength={600}
                  placeholder="A couple of lines about what you do now."
                />
                <small className="alr-count">{form.summary.length}/600</small>
                {errors.summary && <em className="alr-err">{errors.summary}</em>}
              </label>
            </fieldset>

            <fieldset className="alr-group">
              <legend>Profile photo</legend>
              <div className="alr-photorow">
                <div className="alr-photoprev">
                  {photoPreview
                    ? <img src={photoPreview} alt="Selected profile preview" />
                    : <i className="bx bx-user"></i>}
                </div>
                <div className="alr-photoactions">
                  <label className="alr-filebtn">
                    {photo ? "Change photo" : "Choose photo"}
                    <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onPhoto} />
                  </label>
                  {photo && (
                    <button type="button" className="alr-linkbtn" onClick={clearPhoto}>Remove</button>
                  )}
                  <small>JPG, PNG or WEBP · up to 5 MB · resized automatically</small>
                </div>
              </div>
              {errors.photo && <em className="alr-err">{errors.photo}</em>}
            </fieldset>

            {errors.form && <div className="alr-formerr" role="alert">{errors.form}</div>}

            <button className="alr-submit" type="submit" disabled={busy}>
              {busy ? "Submitting…" : "Submit my profile"}
            </button>
            <p className="alr-privacy">
              Your contact number and email are used only to verify and contact you — they are
              never shown publicly.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default AlumniRegisterModal;
