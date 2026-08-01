import { useEffect, useMemo, useState } from "react";
import "./AlumniAdmin.css";
import {
  MAX_ROLES,
  fetchAllAlumni,
  updateAlumni,
  setStatus as apiSetStatus,
  setHidden as apiSetHidden,
  deleteAlumni as apiDelete,
  createAlumniAsAdmin,
  replacePhoto,
  sendAlumniEmail,
  validateAlumni,
  csvCell,
} from "../lib/alumniApi";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const BLANK = {
  full_name: "", email: "", contact: "", roles: [""],
  current_organization: "", current_designation: "", linkedin: "", summary: "",
};

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function AlumniAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [editing, setEditing] = useState(null); // row being edited, or "new"
  const [draft, setDraft] = useState(BLANK);
  const [draftErrors, setDraftErrors] = useState({});
  const [photoRow, setPhotoRow] = useState(null); // row id awaiting a new photo
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [err, setErr] = useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const load = async () => {
    setLoading(true);
    try {
      setRows(await fetchAllAlumni());
      setErr("");
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  /* ---------------- filtering ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (tab !== "all" && r.status !== tab) return false;
      if (!q) return true;
      return [r.full_name, r.email, r.contact, r.current_organization, r.current_designation, ...(r.roles || [])]
        .join(" ").toLowerCase().includes(q);
    });
  }, [rows, tab, query]);

  const counts = useMemo(() => ({
    all: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
  }), [rows]);

  /* ---------------- selection ---------------- */
  const allShownSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allShownSelected) filtered.forEach((r) => next.delete(r.id));
      else filtered.forEach((r) => next.add(r.id));
      return next;
    });
  };
  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const selectedIds = [...selected].filter((id) => rows.some((r) => r.id === id));

  /* ---------------- actions ---------------- */
  const runAction = async (fn, successMsg) => {
    setBusy(true); setErr("");
    try {
      await fn();
      await load();
      notify(successMsg);
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  };

  const approve = (ids) =>
    runAction(async () => {
      await apiSetStatus(ids, "approved");
      // Approval emails are best-effort; failures never block the action.
      const targets = rows.filter((r) => ids.includes(r.id));
      await Promise.all(targets.map((r) => sendAlumniEmail("approved", r)));
    }, ids.length > 1 ? `${ids.length} profiles approved` : "Profile approved");

  const reject = (ids) => runAction(() => apiSetStatus(ids, "rejected"),
    ids.length > 1 ? `${ids.length} profiles rejected` : "Profile rejected");

  const hide = (ids, hidden) => runAction(() => apiSetHidden(ids, hidden),
    hidden ? "Hidden from the public directory" : "Visible in the public directory");

  const remove = (ids) => {
    const msg = ids.length > 1
      ? `Delete ${ids.length} alumni profiles permanently? This cannot be undone.`
      : "Delete this alumni profile permanently? This cannot be undone.";
    if (!confirm(msg)) return;
    runAction(async () => {
      await apiDelete(ids);
      setSelected(new Set());
    }, ids.length > 1 ? `${ids.length} profiles deleted` : "Profile deleted");
  };

  const resendEmail = (row) =>
    runAction(async () => {
      const kind = row.status === "approved" ? "approved" : "registered";
      const res = await sendAlumniEmail(kind, row);
      if (res.skipped) throw new Error("Email service is not configured yet — see supabase/functions/alumni-email/README.md");
    }, "Email sent");

  /* ---------------- editing ---------------- */
  const openEdit = (row) => {
    setEditing(row);
    setDraft({
      full_name: row.full_name, email: row.email, contact: row.contact,
      roles: row.roles?.length ? [...row.roles] : [""],
      current_organization: row.current_organization,
      current_designation: row.current_designation,
      linkedin: row.linkedin, summary: row.summary || "",
    });
    setDraftErrors({});
  };

  const openNew = () => { setEditing("new"); setDraft(BLANK); setDraftErrors({}); };

  const setDraftField = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const setDraftRole = (i, v) => setDraft((d) => ({ ...d, roles: d.roles.map((r, idx) => (idx === i ? v : r)) }));
  const addDraftRole = () => setDraft((d) => (d.roles.length < MAX_ROLES ? { ...d, roles: [...d.roles, ""] } : d));
  const removeDraftRole = (i) => setDraft((d) => (d.roles.length > 1 ? { ...d, roles: d.roles.filter((_, idx) => idx !== i) } : d));
  const moveDraftRole = (i, dir) => setDraft((d) => {
    const next = [...d.roles]; const j = i + dir;
    if (j < 0 || j >= next.length) return d;
    [next[i], next[j]] = [next[j], next[i]];
    return { ...d, roles: next };
  });

  const saveDraft = async () => {
    const errors = validateAlumni(draft, { requireContact: false });
    if (Object.keys(errors).length) { setDraftErrors(errors); return; }
    setBusy(true); setErr("");
    try {
      if (editing === "new") {
        const res = await createAlumniAsAdmin(draft, null);
        if (!res.ok) { setDraftErrors(res.errors); setBusy(false); return; }
        notify("Alumni added");
      } else {
        await updateAlumni(editing.id, {
          full_name: draft.full_name,
          email: draft.email.toLowerCase(),
          contact: draft.contact,
          roles: draft.roles.map((r) => r.trim()).filter(Boolean),
          current_organization: draft.current_organization,
          current_designation: draft.current_designation,
          linkedin: draft.linkedin,
          summary: draft.summary,
        });
        notify("Changes saved");
      }
      setEditing(null);
      await load();
    } catch (e) {
      setDraftErrors({ form: e.message });
    }
    setBusy(false);
  };

  const onPhotoPicked = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !photoRow) return;
    await runAction(() => replacePhoto(photoRow, file), "Photo updated");
    setPhotoRow(null);
  };

  /* ---------------- exports ---------------- */
  const exportRows = () => (selectedIds.length
    ? rows.filter((r) => selectedIds.includes(r.id))
    : filtered);

  const HEADERS = ["Name", "Email", "Contact", "Roles", "Organization", "Designation", "LinkedIn", "Status", "Visible", "Submitted", "Approved"];
  const rowValues = (r) => [
    r.full_name, r.email, r.contact, (r.roles || []).join(" | "),
    r.current_organization, r.current_designation, r.linkedin,
    r.status, r.is_hidden ? "Hidden" : "Visible",
    fmtDate(r.submitted_at), fmtDate(r.approved_at),
  ];

  const exportCSV = () => {
    const data = exportRows();
    const csv = [HEADERS.map(csvCell).join(","), ...data.map((r) => rowValues(r).map(csvCell).join(","))].join("\r\n");
    download(`iconnect-alumni-${Date.now()}.csv`, "﻿" + csv, "text/csv;charset=utf-8");
    notify(`Exported ${data.length} rows to CSV`);
  };

  const exportExcel = () => {
    const data = exportRows();
    const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html =
      `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1">` +
      `<tr>${HEADERS.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>` +
      data.map((r) => `<tr>${rowValues(r).map((v) => `<td>${esc(v)}</td>`).join("")}</tr>`).join("") +
      `</table></body></html>`;
    download(`iconnect-alumni-${Date.now()}.xls`, html, "application/vnd.ms-excel");
    notify(`Exported ${data.length} rows to Excel`);
  };

  /* ---------------- render ---------------- */
  return (
    <div className="alad">
      <div className="alad-head">
        <h2>Alumni Management</h2>
        <span className="admin-spacer" />
        <button className="admin-btn admin-btn-ghost" onClick={openNew}>+ Add alumni</button>
        <button className="admin-btn admin-btn-ghost" onClick={exportCSV} disabled={!filtered.length}>Export CSV</button>
        <button className="admin-btn admin-btn-ghost" onClick={exportExcel} disabled={!filtered.length}>Export Excel</button>
      </div>

      {err && <p className="admin-err">{err}</p>}
      {toast && <p className="admin-ok alad-toast" role="status">{toast}</p>}

      <div className="alad-tabs">
        {STATUS_TABS.map((t) => (
          <button
            key={t.id}
            className={`alad-tab ${tab === t.id ? "alad-tab-on" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label} <span>{counts[t.id]}</span>
          </button>
        ))}
        <input
          className="alad-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, role, company…"
          aria-label="Search alumni"
        />
      </div>

      {selectedIds.length > 0 && (
        <div className="alad-bulk">
          <strong>{selectedIds.length} selected</strong>
          <button className="admin-btn" onClick={() => approve(selectedIds)} disabled={busy}>Approve</button>
          <button className="admin-btn admin-btn-ghost" onClick={() => reject(selectedIds)} disabled={busy}>Reject</button>
          <button className="admin-btn admin-btn-ghost" onClick={() => hide(selectedIds, true)} disabled={busy}>Hide</button>
          <button className="admin-btn admin-btn-ghost" onClick={() => hide(selectedIds, false)} disabled={busy}>Unhide</button>
          <button className="admin-btn admin-btn-danger" onClick={() => remove(selectedIds)} disabled={busy}>Delete</button>
          <button className="admin-btn admin-btn-ghost" onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      )}

      {loading ? (
        <p className="admin-muted">Loading alumni…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-muted">
          {rows.length === 0
            ? "No alumni registrations yet. Public submissions from /alumni will appear here."
            : "No alumni match this filter."}
        </p>
      ) : (
        <div className="alad-tablewrap">
          <table className="alad-table">
            <thead>
              <tr>
                <th className="alad-check">
                  <input
                    type="checkbox"
                    checked={allShownSelected}
                    onChange={toggleAll}
                    aria-label="Select all shown"
                  />
                </th>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Roles</th>
                <th>Organization</th>
                <th>Designation</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className={selected.has(r.id) ? "alad-rowsel" : ""}>
                  <td className="alad-check">
                    <input
                      type="checkbox"
                      checked={selected.has(r.id)}
                      onChange={() => toggleOne(r.id)}
                      aria-label={`Select ${r.full_name}`}
                    />
                  </td>
                  <td>
                    {r.photo_url ? (
                      <a href={r.photo_url} target="_blank" rel="noopener noreferrer" title="View full image">
                        <img className="alad-photo" src={r.photo_url} alt={r.full_name} />
                      </a>
                    ) : (
                      <div className="alad-nophoto">—</div>
                    )}
                  </td>
                  <td>
                    <strong>{r.full_name}</strong>
                    {r.source === "admin" && <span className="alad-src">added by admin</span>}
                    {r.status === "approved" && !r.is_hidden && (
                      <a className="alad-view" href={`/alumni/${r.slug}`} target="_blank" rel="noopener noreferrer">view public page</a>
                    )}
                  </td>
                  <td className="alad-mono">{r.email}</td>
                  <td className="alad-mono">{r.contact || "—"}</td>
                  <td>
                    <div className="alad-roles">
                      {(r.roles || []).map((role, i) => (
                        <span key={role + i} className={i === 0 ? "alad-role alad-role-1" : "alad-role"}>{role}</span>
                      ))}
                    </div>
                  </td>
                  <td>{r.current_organization || "—"}</td>
                  <td>{r.current_designation || "—"}</td>
                  <td className="alad-nowrap">{fmtDate(r.submitted_at)}</td>
                  <td>
                    <span className={`alad-status alad-status-${r.status}`}>{r.status}</span>
                    {r.status === "approved" && r.is_hidden && <span className="alad-hidden">hidden</span>}
                  </td>
                  <td>
                    <div className="alad-actions">
                      {r.status !== "approved" && (
                        <button className="admin-btn" onClick={() => approve([r.id])} disabled={busy}>Approve</button>
                      )}
                      {r.status !== "rejected" && (
                        <button className="admin-btn admin-btn-ghost" onClick={() => reject([r.id])} disabled={busy}>Reject</button>
                      )}
                      {r.status === "approved" && (
                        <button className="admin-btn admin-btn-ghost" onClick={() => hide([r.id], !r.is_hidden)} disabled={busy}>
                          {r.is_hidden ? "Unhide" : "Hide"}
                        </button>
                      )}
                      <button className="admin-btn admin-btn-ghost" onClick={() => openEdit(r)}>Edit</button>
                      <label className="admin-btn admin-btn-ghost alad-filebtn">
                        Photo
                        <input type="file" accept="image/jpeg,image/png,image/webp" hidden
                          onClick={() => setPhotoRow(r.id)} onChange={onPhotoPicked} />
                      </label>
                      <button className="admin-btn admin-btn-ghost" onClick={() => resendEmail(r)} disabled={busy}>Resend</button>
                      <button className="admin-btn admin-btn-danger" onClick={() => remove([r.id])} disabled={busy}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- edit / add modal ---------- */}
      {editing && (
        <div className="admin-modal">
          <div className="admin-modal-box">
            <h3>{editing === "new" ? "Add alumni" : `Edit ${editing.full_name}`}</h3>

            <label>Full name
              <input value={draft.full_name} onChange={setDraftField("full_name")} />
            </label>
            {draftErrors.full_name && <p className="admin-err">{draftErrors.full_name}</p>}

            <label>Email
              <input type="email" value={draft.email} onChange={setDraftField("email")} />
            </label>
            {draftErrors.email && <p className="admin-err">{draftErrors.email}</p>}

            <label>Contact
              <input value={draft.contact} onChange={setDraftField("contact")} />
            </label>
            {draftErrors.contact && <p className="admin-err">{draftErrors.contact}</p>}

            <label>Roles at iConnect (first = primary)</label>
            {draft.roles.map((role, i) => (
              <div className="alad-rolerow" key={i}>
                <span>{i + 1}</span>
                <input value={role} onChange={(e) => setDraftRole(i, e.target.value)} />
                <button className="admin-iconbtn" onClick={() => moveDraftRole(i, -1)} disabled={i === 0}>↑</button>
                <button className="admin-iconbtn" onClick={() => moveDraftRole(i, 1)} disabled={i === draft.roles.length - 1}>↓</button>
                <button className="admin-iconbtn" onClick={() => removeDraftRole(i)} disabled={draft.roles.length === 1}>✕</button>
              </div>
            ))}
            {draft.roles.length < MAX_ROLES && (
              <button className="admin-btn admin-btn-ghost" onClick={addDraftRole}>+ Add role</button>
            )}
            {draftErrors.roles && <p className="admin-err">{draftErrors.roles}</p>}

            <label>Organization
              <input value={draft.current_organization} onChange={setDraftField("current_organization")} />
            </label>
            <label>Designation
              <input value={draft.current_designation} onChange={setDraftField("current_designation")} />
            </label>
            <label>LinkedIn
              <input value={draft.linkedin} onChange={setDraftField("linkedin")} />
            </label>
            {draftErrors.linkedin && <p className="admin-err">{draftErrors.linkedin}</p>}

            <label>Summary
              <textarea rows={3} value={draft.summary} onChange={setDraftField("summary")} />
            </label>

            {draftErrors.form && <p className="admin-err">{draftErrors.form}</p>}

            <div className="admin-row-end">
              <button className="admin-btn admin-btn-ghost" onClick={() => setEditing(null)} disabled={busy}>Cancel</button>
              <button className="admin-btn" onClick={saveDraft} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlumniAdmin;
