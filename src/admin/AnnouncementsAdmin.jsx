import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import defaults from "../data/announcements.json";

function AnnouncementsAdmin() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "announcements").maybeSingle();
      setForm(data?.value || defaults);
    })();
  }, []);

  const save = async () => {
    setErr(""); setSaved(false);
    const { error } = await supabase.from("site_settings").upsert({ key: "announcements", value: form });
    if (error) setErr(error.message); else setSaved(true);
  };

  if (!form) return <p className="admin-muted">Loading…</p>;
  const setA = (k, v) => setForm({ ...form, announcement: { ...form.announcement, [k]: v } });
  const setR = (k, v) => setForm({ ...form, recruitment: { ...form.recruitment, [k]: v } });

  return (
    <div className="admin-formpage">
      <h2>Announcement Bar</h2>
      <label className="admin-check">
        <input type="checkbox" checked={!!form.announcement.enabled} onChange={(e) => setA("enabled", e.target.checked)} />
        Show the bar on the homepage
      </label>
      <label>Text<input value={form.announcement.text} onChange={(e) => setA("text", e.target.value)} /></label>
      <label>Link (page path, e.g. /seedfunding)<input value={form.announcement.link || ""} onChange={(e) => setA("link", e.target.value)} /></label>
      <label>Link text<input value={form.announcement.linkText || ""} onChange={(e) => setA("linkText", e.target.value)} /></label>

      <h2>Recruitment Banner</h2>
      <label className="admin-check">
        <input type="checkbox" checked={!!form.recruitment.enabled} onChange={(e) => setR("enabled", e.target.checked)} />
        Show the banner in the Why Join section
      </label>
      <label>Status chip (e.g. Opening Soon / OPEN NOW)<input value={form.recruitment.status} onChange={(e) => setR("status", e.target.value)} /></label>
      <label>Headline<input value={form.recruitment.headline} onChange={(e) => setR("headline", e.target.value)} /></label>
      <label>Text<textarea value={form.recruitment.text} onChange={(e) => setR("text", e.target.value)} /></label>

      {err && <p className="admin-err">{err}</p>}
      {saved && <p className="admin-ok">✅ Saved — live on the site.</p>}
      <button className="admin-btn" onClick={save}>Save changes</button>
    </div>
  );
}

export default AnnouncementsAdmin;
