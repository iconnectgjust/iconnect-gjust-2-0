import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { uploadMedia, swapSort } from "./adminApi";

function GalleryAdmin() {
  const [albums, setAlbums] = useState([]);
  const [openAlbum, setOpenAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [err, setErr] = useState("");

  const loadAlbums = async () => {
    const { data, error } = await supabase.from("gallery_albums").select("*, gallery_photos(id)").order("sort");
    if (error) setErr(error.message); else setAlbums(data);
  };
  useEffect(() => { loadAlbums(); }, []);

  const loadPhotos = async (album) => {
    const { data, error } = await supabase.from("gallery_photos").select("*").eq("album_id", album.id).order("sort");
    if (error) setErr(error.message); else setPhotos(data);
  };

  const addAlbum = async () => {
    if (!newTitle.trim()) return;
    const sort = (albums[albums.length - 1]?.sort ?? -1) + 1;
    const { error } = await supabase.from("gallery_albums").insert({ title: newTitle.trim(), sort });
    if (error) setErr(error.message); else { setNewTitle(""); await loadAlbums(); }
  };

  const renameAlbum = async (a) => {
    const t = prompt("Album title:", a.title);
    if (!t?.trim()) return;
    const { error } = await supabase.from("gallery_albums").update({ title: t.trim() }).eq("id", a.id);
    if (error) setErr(error.message); else await loadAlbums();
  };

  const deleteAlbum = async (a) => {
    if (!confirm(`Delete album "${a.title}" and its ${a.gallery_photos.length} photo(s)?`)) return;
    const { error } = await supabase.from("gallery_albums").delete().eq("id", a.id);
    if (error) setErr(error.message); else { if (openAlbum?.id === a.id) setOpenAlbum(null); await loadAlbums(); }
  };

  const moveAlbum = async (idx, dir) => {
    const other = albums[idx + dir];
    if (!other) return;
    await swapSort("gallery_albums", albums[idx], other);
    await loadAlbums();
  };

  const uploadPhotos = async (files) => {
    setBusy(true); setErr("");
    let sort = (photos[photos.length - 1]?.sort ?? -1) + 1;
    let done = 0;
    for (const file of files) {
      setProgress(`Uploading ${++done} of ${files.length}…`);
      try {
        const url = await uploadMedia("gallery", file, (file.name.split(".").pop() || "jpg").toLowerCase());
        const { error } = await supabase.from("gallery_photos").insert({ album_id: openAlbum.id, url, sort: sort++ });
        if (error) throw error;
      } catch (e) { setErr(`${file.name}: ${e.message}`); break; }
    }
    setProgress(""); setBusy(false);
    await loadPhotos(openAlbum); await loadAlbums();
  };

  const updatePhoto = async (p, patch) => {
    const { error } = await supabase.from("gallery_photos").update(patch).eq("id", p.id);
    if (error) setErr(error.message); else await loadPhotos(openAlbum);
  };

  const deletePhoto = async (p) => {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabase.from("gallery_photos").delete().eq("id", p.id);
    if (error) setErr(error.message); else { await loadPhotos(openAlbum); await loadAlbums(); }
  };

  const movePhoto = async (idx, dir) => {
    const other = photos[idx + dir];
    if (!other) return;
    await swapSort("gallery_photos", photos[idx], other);
    await loadPhotos(openAlbum);
  };

  if (!openAlbum) {
    return (
      <div>
        <h2>Gallery — Albums</h2>
        {err && <p className="admin-err">{err}</p>}
        <div className="admin-addrow">
          <input placeholder="New album, e.g. Konark 2026" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <button className="admin-btn" onClick={addAlbum}>+ Add album</button>
        </div>
        <div className="admin-list">
          {albums.map((a, i) => (
            <div className="admin-listrow" key={a.id}>
              <strong>{a.title}</strong>
              <span className="admin-muted">{a.gallery_photos.length} photos</span>
              <span className="admin-spacer" />
              <button className="admin-iconbtn" onClick={() => moveAlbum(i, -1)} disabled={i === 0}>↑</button>
              <button className="admin-iconbtn" onClick={() => moveAlbum(i, 1)} disabled={i === albums.length - 1}>↓</button>
              <button className="admin-btn admin-btn-ghost" onClick={() => renameAlbum(a)}>Rename</button>
              <button className="admin-btn" onClick={() => { setOpenAlbum(a); loadPhotos(a); }}>Open</button>
              <button className="admin-btn admin-btn-danger" onClick={() => deleteAlbum(a)}>Delete</button>
            </div>
          ))}
          {!albums.length && <p className="admin-muted">No albums yet — add one above, or use the Import tab.</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="admin-btn admin-btn-ghost" onClick={() => setOpenAlbum(null)}>← All albums</button>
      <h2>{openAlbum.title}</h2>
      {err && <p className="admin-err">{err}</p>}
      <div className="admin-addrow">
        <label className="admin-btn admin-filebtn">
          {busy ? progress || "Uploading…" : "⬆ Upload photos…"}
          <input type="file" accept="image/*" multiple hidden disabled={busy}
            onChange={(e) => e.target.files.length && uploadPhotos([...e.target.files])} />
        </label>
      </div>
      <div className="admin-photogrid">
        {photos.map((p, i) => (
          <div className="admin-photocard" key={p.id}>
            <img src={p.url} alt={p.caption || "gallery photo"} />
            <input
              placeholder="Caption…" defaultValue={p.caption}
              onBlur={(e) => e.target.value !== p.caption && updatePhoto(p, { caption: e.target.value })}
            />
            <div className="admin-row-end">
              <button className="admin-iconbtn" onClick={() => movePhoto(i, -1)} disabled={i === 0}>↑</button>
              <button className="admin-iconbtn" onClick={() => movePhoto(i, 1)} disabled={i === photos.length - 1}>↓</button>
              <button className="admin-btn admin-btn-danger" onClick={() => deletePhoto(p)}>✕</button>
            </div>
          </div>
        ))}
        {!photos.length && !busy && <p className="admin-muted">No photos yet — upload some above.</p>}
      </div>
    </div>
  );
}

export default GalleryAdmin;
