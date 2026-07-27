import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { uploadMedia, swapSort } from "./adminApi";
import PhotoCropper from "./PhotoCropper";

const emptyAlum = { name: "", role: "", now_at: "", linkedin: "", photo_url: "" };

function AlumniAdmin() {
  const [batches, setBatches] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [edit, setEdit] = useState(null); // {batchId, member|null, draft}
  const [cropSrc, setCropSrc] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("alumni_batches")
      .select("*, alumni_members(*)")
      .order("sort", { ascending: false });
    if (error) setErr(error.message);
    else setBatches(data.map((b) => ({ ...b, alumni_members: b.alumni_members.sort((a, c) => a.sort - c.sort) })));
  };
  useEffect(() => { load(); }, []);

  const addBatch = async () => {
    if (!newYear.trim()) return;
    const sort = (batches[0]?.sort ?? 0) + 1;
    const { error } = await supabase.from("alumni_batches").insert({ year: newYear.trim(), sort });
    if (error) setErr(error.message); else { setNewYear(""); await load(); }
  };

  const deleteBatch = async (b) => {
    if (!confirm(`Delete batch ${b.year} and its ${b.alumni_members.length} member(s)?`)) return;
    const { error } = await supabase.from("alumni_batches").delete().eq("id", b.id);
    if (error) setErr(error.message); else await load();
  };

  const deleteMember = async (m) => {
    if (!confirm(`Remove ${m.name}?`)) return;
    const { error } = await supabase.from("alumni_members").delete().eq("id", m.id);
    if (error) setErr(error.message); else await load();
  };

  const moveMember = async (b, idx, dir) => {
    const other = b.alumni_members[idx + dir];
    if (!other) return;
    await swapSort("alumni_members", b.alumni_members[idx], other);
    await load();
  };

  const save = async () => {
    const { batchId, member, draft } = edit;
    if (!draft.name.trim()) { setErr("Name is required"); return; }
    setBusy(true); setErr("");
    let error;
    if (member) ({ error } = await supabase.from("alumni_members").update(draft).eq("id", member.id));
    else {
      const b = batches.find((x) => x.id === batchId);
      const sort = (b.alumni_members[b.alumni_members.length - 1]?.sort ?? -1) + 1;
      ({ error } = await supabase.from("alumni_members").insert({ ...draft, batch_id: batchId, sort }));
    }
    if (error) setErr(error.message); else { setEdit(null); await load(); }
    setBusy(false);
  };

  const onPhotoPicked = (file) => {
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const onCropDone = async (blob) => {
    setCropSrc(null); setBusy(true);
    try {
      const url = await uploadMedia("alumni", blob);
      setEdit((e) => ({ ...e, draft: { ...e.draft, photo_url: url } }));
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <div>
      <h2>Alumni Network</h2>
      {err && <p className="admin-err">{err}</p>}
      <div className="admin-addrow">
        <input placeholder="New batch, e.g. 2024-25" value={newYear} onChange={(e) => setNewYear(e.target.value)} />
        <button className="admin-btn" onClick={addBatch}>+ Add batch</button>
      </div>

      {batches.map((b) => (
        <div className="admin-group" key={b.id}>
          <div className="admin-grouphead">
            <h3>Batch {b.year}</h3>
            <span className="admin-spacer" />
            <button className="admin-btn admin-btn-ghost" onClick={() => setEdit({ batchId: b.id, member: null, draft: { ...emptyAlum } })}>+ Add alum</button>
            <button className="admin-btn admin-btn-danger" onClick={() => deleteBatch(b)}>Delete batch</button>
          </div>
          <div className="admin-memberlist">
            {b.alumni_members.map((m, mi) => (
              <div className="admin-membercard" key={m.id}>
                {m.photo_url ? <img src={m.photo_url} alt={m.name} /> : <div className="admin-nophoto">no photo</div>}
                <div className="admin-memberinfo">
                  <strong>{m.name}</strong>
                  <span>{m.role} → {m.now_at}</span>
                </div>
                <button className="admin-iconbtn" onClick={() => moveMember(b, mi, -1)} disabled={mi === 0}>↑</button>
                <button className="admin-iconbtn" onClick={() => moveMember(b, mi, 1)} disabled={mi === b.alumni_members.length - 1}>↓</button>
                <button className="admin-btn admin-btn-ghost" onClick={() => setEdit({ batchId: b.id, member: m, draft: { name: m.name, role: m.role, now_at: m.now_at, linkedin: m.linkedin, photo_url: m.photo_url } })}>Edit</button>
                <button className="admin-btn admin-btn-danger" onClick={() => deleteMember(m)}>✕</button>
              </div>
            ))}
            {!b.alumni_members.length && <p className="admin-muted">No alumni in this batch yet.</p>}
          </div>
        </div>
      ))}
      {!batches.length && <p className="admin-muted">No batches yet — add one above.</p>}

      {edit && (
        <div className="admin-modal">
          <div className="admin-modal-box">
            <h3>{edit.member ? `Edit ${edit.member.name}` : "Add alum"}</h3>
            <label>Name<input value={edit.draft.name} onChange={(e) => setEdit({ ...edit, draft: { ...edit.draft, name: e.target.value } })} /></label>
            <label>Role held at iConnect<input value={edit.draft.role} onChange={(e) => setEdit({ ...edit, draft: { ...edit.draft, role: e.target.value } })} /></label>
            <label>Where they are now<input value={edit.draft.now_at} onChange={(e) => setEdit({ ...edit, draft: { ...edit.draft, now_at: e.target.value } })} placeholder="e.g. SDE at Infosys / Founder, XYZ" /></label>
            <label>LinkedIn URL<input value={edit.draft.linkedin} onChange={(e) => setEdit({ ...edit, draft: { ...edit.draft, linkedin: e.target.value } })} /></label>
            <div className="admin-photorow">
              {edit.draft.photo_url ? <img src={edit.draft.photo_url} alt="preview" /> : <div className="admin-nophoto">no photo</div>}
              <label className="admin-btn admin-btn-ghost admin-filebtn">
                {edit.draft.photo_url ? "Change photo…" : "Upload photo…"}
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && onPhotoPicked(e.target.files[0])} />
              </label>
            </div>
            <div className="admin-row-end">
              <button className="admin-btn admin-btn-ghost" onClick={() => setEdit(null)} disabled={busy}>Cancel</button>
              <button className="admin-btn" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {cropSrc && <PhotoCropper src={cropSrc} onDone={onCropDone} onCancel={() => setCropSrc(null)} />}
    </div>
  );
}

export default AlumniAdmin;
