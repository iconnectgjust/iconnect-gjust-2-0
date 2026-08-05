import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { uploadMedia, swapSort } from "./adminApi";
import PhotoCropper from "./PhotoCropper";

const STANDARD_GROUPS = ["Captains", "Heads", "Leads", "Coordinators"];
const COLORS = [
  "card-red",
  "card-purple",
  "card-yellow",
  "card-blue",
  "card-green",
];

const emptyMember = {
  name: "",
  role: "",
  linkedin: "",
  color: "card-blue",
  photo_url: "",
  rollno: "",
  department: "",
  course: "",
};

function TeamAdmin() {
  const [sessions, setSessions] = useState([]);
  const [openSession, setOpenSession] = useState(null); // session object being edited
  const [groups, setGroups] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [memberEdit, setMemberEdit] = useState(null); // {groupId, member|null(new), draft}
  const [cropSrc, setCropSrc] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const loadSessions = async () => {
    const { data, error } = await supabase
      .from("team_sessions")
      .select("*")
      .order("sort", { ascending: false });
    if (error) setErr(error.message);
    else setSessions(data);
  };
  useEffect(() => {
    loadSessions();
  }, []);

  const loadGroups = async (session) => {
    const { data, error } = await supabase
      .from("team_groups")
      .select("id, name, sort, team_members(*)")
      .eq("session_id", session.id)
      .order("sort");
    if (error) {
      setErr(error.message);
      return;
    }
    setGroups(
      data.map((g) => ({
        ...g,
        team_members: g.team_members.sort((a, b) => a.sort - b.sort),
      })),
    );
  };

  const openEditor = async (session) => {
    setOpenSession(session);
    await loadGroups(session);
  };

  const addSession = async () => {
    if (!newYear.trim()) return;
    setBusy(true);
    setErr("");
    const sort = (sessions[0]?.sort ?? 0) + 1;
    const { data, error } = await supabase
      .from("team_sessions")
      .insert({ year: newYear.trim(), sort })
      .select()
      .single();
    if (error) setErr(error.message);
    else {
      // start with the standard four groups
      await supabase
        .from("team_groups")
        .insert(
          STANDARD_GROUPS.map((name, i) => ({
            session_id: data.id,
            name,
            sort: i,
          })),
        );
      setNewYear("");
      await loadSessions();
    }
    setBusy(false);
  };

  const deleteSession = async (s) => {
    if (
      !confirm(
        `Delete session ${s.year} and its whole team? This cannot be undone.`,
      )
    )
      return;
    const { error } = await supabase
      .from("team_sessions")
      .delete()
      .eq("id", s.id);
    if (error) setErr(error.message);
    else {
      if (openSession?.id === s.id) setOpenSession(null);
      await loadSessions();
    }
  };

  const markCurrent = async (s) => {
    await supabase
      .from("team_sessions")
      .update({ is_current: false })
      .neq("id", s.id);
    const { error } = await supabase
      .from("team_sessions")
      .update({ is_current: true })
      .eq("id", s.id);
    if (error) setErr(error.message);
    else await loadSessions();
  };

  const addGroup = async (name) => {
    if (!name.trim()) return;
    const sort = (groups[groups.length - 1]?.sort ?? -1) + 1;
    const { error } = await supabase
      .from("team_groups")
      .insert({ session_id: openSession.id, name: name.trim(), sort });
    if (error) setErr(error.message);
    else await loadGroups(openSession);
  };

  const deleteGroup = async (g) => {
    if (
      g.team_members.length &&
      !confirm(
        `Delete group "${g.name}" and its ${g.team_members.length} member(s)?`,
      )
    )
      return;
    const { error } = await supabase
      .from("team_groups")
      .delete()
      .eq("id", g.id);
    if (error) setErr(error.message);
    else await loadGroups(openSession);
  };

  const moveGroup = async (idx, dir) => {
    const other = groups[idx + dir];
    if (!other) return;
    await swapSort("team_groups", groups[idx], other);
    await loadGroups(openSession);
  };

  const moveMember = async (g, idx, dir) => {
    const other = g.team_members[idx + dir];
    if (!other) return;
    await swapSort("team_members", g.team_members[idx], other);
    await loadGroups(openSession);
  };

  const deleteMember = async (m) => {
    if (!confirm(`Remove ${m.name}?`)) return;
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", m.id);
    if (error) setErr(error.message);
    else await loadGroups(openSession);
  };

  const saveMember = async () => {
    const { groupId, member, draft } = memberEdit;
    if (!draft.name.trim()) {
      setErr("Name is required");
      return;
    }
    setBusy(true);
    setErr("");
    let error;
    if (member) {
      ({ error } = await supabase
        .from("team_members")
        .update(draft)
        .eq("id", member.id));
    } else {
      const g = groups.find((x) => x.id === groupId);
      const sort = (g.team_members[g.team_members.length - 1]?.sort ?? -1) + 1;
      ({ error } = await supabase
        .from("team_members")
        .insert({ ...draft, group_id: groupId, sort }));
    }
    if (error) setErr(error.message);
    else {
      setMemberEdit(null);
      await loadGroups(openSession);
    }
    setBusy(false);
  };

  const onPhotoPicked = (file) => {
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const onCropDone = async (blob) => {
    setCropSrc(null);
    setBusy(true);
    try {
      const url = await uploadMedia("team", blob);
      setMemberEdit((me) => ({
        ...me,
        draft: { ...me.draft, photo_url: url },
      }));
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  };

  // ---------- render ----------
  if (!openSession) {
    return (
      <div>
        <h2>Team Archive — Sessions</h2>
        {err && <p className="admin-err">{err}</p>}
        <div className="admin-addrow">
          <input
            placeholder="New session, e.g. 2026-27"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
          />
          <button className="admin-btn" onClick={addSession} disabled={busy}>
            + Add session
          </button>
        </div>
        <div className="admin-list">
          {sessions.map((s) => (
            <div className="admin-listrow" key={s.id}>
              <strong>{s.year}</strong>
              {s.is_current && <span className="admin-chip">Current</span>}
              <span className="admin-spacer" />
              {!s.is_current && (
                <button
                  className="admin-btn admin-btn-ghost"
                  onClick={() => markCurrent(s)}
                >
                  Mark current
                </button>
              )}
              <button className="admin-btn" onClick={() => openEditor(s)}>
                Edit team
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => deleteSession(s)}
              >
                Delete
              </button>
            </div>
          ))}
          {!sessions.length && (
            <p className="admin-muted">
              No sessions yet — add one above, or use the Import tab to bring in
              the current website data.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        className="admin-btn admin-btn-ghost"
        onClick={() => setOpenSession(null)}
      >
        ← All sessions
      </button>
      <h2>Team {openSession.year}</h2>
      {err && <p className="admin-err">{err}</p>}

      <div className="admin-addrow">
        {STANDARD_GROUPS.filter((n) => !groups.some((g) => g.name === n)).map(
          (n) => (
            <button
              key={n}
              className="admin-btn admin-btn-ghost"
              onClick={() => addGroup(n)}
            >
              + {n}
            </button>
          ),
        )}
        <button
          className="admin-btn admin-btn-ghost"
          onClick={() => {
            const n = prompt("Custom group name (e.g. Advisors):");
            if (n) addGroup(n);
          }}
        >
          + Custom group…
        </button>
      </div>

      {groups.map((g, gi) => (
        <div className="admin-group" key={g.id}>
          <div className="admin-grouphead">
            <h3>{g.name}</h3>
            <span className="admin-spacer" />
            <button
              className="admin-iconbtn"
              onClick={() => moveGroup(gi, -1)}
              disabled={gi === 0}
              title="Move group up"
            >
              ↑
            </button>
            <button
              className="admin-iconbtn"
              onClick={() => moveGroup(gi, 1)}
              disabled={gi === groups.length - 1}
              title="Move group down"
            >
              ↓
            </button>
            <button
              className="admin-btn admin-btn-ghost"
              onClick={() =>
                setMemberEdit({
                  groupId: g.id,
                  member: null,
                  draft: { ...emptyMember },
                })
              }
            >
              + Add member
            </button>
            <button
              className="admin-btn admin-btn-danger"
              onClick={() => deleteGroup(g)}
            >
              Delete group
            </button>
          </div>
          <div className="admin-memberlist">
            {g.team_members.map((m, mi) => (
              <div className="admin-membercard" key={m.id}>
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name} />
                ) : (
                  <div className="admin-nophoto">no photo</div>
                )}
                <div className="admin-memberinfo">
                  <strong>{m.name}</strong>
                  <span>{m.role}</span>
                </div>
                <button
                  className="admin-iconbtn"
                  onClick={() => moveMember(g, mi, -1)}
                  disabled={mi === 0}
                >
                  ↑
                </button>
                <button
                  className="admin-iconbtn"
                  onClick={() => moveMember(g, mi, 1)}
                  disabled={mi === g.team_members.length - 1}
                >
                  ↓
                </button>
                <button
                  className="admin-btn admin-btn-ghost"
                  onClick={() =>
                    setMemberEdit({
                      groupId: g.id,
                      member: m,
                      draft: {
                        name: m.name,
                        role: m.role,
                        linkedin: m.linkedin,
                        color: m.color,
                        photo_url: m.photo_url,
                        rollno: m.rollno,
                        department: m.department,
                        course: m.course,
                      },
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => deleteMember(m)}
                >
                  ✕
                </button>
              </div>
            ))}
            {!g.team_members.length && (
              <p className="admin-muted">No members in this group yet.</p>
            )}
          </div>
        </div>
      ))}

      {memberEdit && (
        <div className="admin-modal">
          <div className="admin-modal-box">
            <h3>
              {memberEdit.member
                ? `Edit ${memberEdit.member.name}`
                : "Add member"}
            </h3>
            <label>
              Name
              <input
                value={memberEdit.draft.name}
                onChange={(e) =>
                  setMemberEdit({
                    ...memberEdit,
                    draft: { ...memberEdit.draft, name: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Role
              <input
                value={memberEdit.draft.role}
                onChange={(e) =>
                  setMemberEdit({
                    ...memberEdit,
                    draft: { ...memberEdit.draft, role: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Roll Number
              <input
                value={memberEdit.draft.rollno}
                onChange={(e) =>
                  setMemberEdit({
                    ...memberEdit,
                    draft: {
                      ...memberEdit.draft,
                      rollno: e.target.value,
                    },
                  })
                }
              />
            </label>

            <label>
              Department
              <input
                value={memberEdit.draft.department}
                onChange={(e) =>
                  setMemberEdit({
                    ...memberEdit,
                    draft: {
                      ...memberEdit.draft,
                      department: e.target.value,
                    },
                  })
                }
              />
            </label>

            <label>
              Course
              <input
                value={memberEdit.draft.course}
                onChange={(e) =>
                  setMemberEdit({
                    ...memberEdit,
                    draft: {
                      ...memberEdit.draft,
                      course: e.target.value,
                    },
                  })
                }
              />
            </label>

            <label>
              LinkedIn URL
              <input
                value={memberEdit.draft.linkedin}
                onChange={(e) =>
                  setMemberEdit({
                    ...memberEdit,
                    draft: { ...memberEdit.draft, linkedin: e.target.value },
                  })
                }
                placeholder="https://www.linkedin.com/in/…"
              />
            </label>
            <label>
              Card color
              <select
                value={memberEdit.draft.color}
                onChange={(e) =>
                  setMemberEdit({
                    ...memberEdit,
                    draft: { ...memberEdit.draft, color: e.target.value },
                  })
                }
              >
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("card-", "")}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-photorow">
              {memberEdit.draft.photo_url ? (
                <img src={memberEdit.draft.photo_url} alt="preview" />
              ) : (
                <div className="admin-nophoto">no photo</div>
              )}
              <label className="admin-btn admin-btn-ghost admin-filebtn">
                {memberEdit.draft.photo_url ? "Change photo…" : "Upload photo…"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    e.target.files[0] && onPhotoPicked(e.target.files[0])
                  }
                />
              </label>
            </div>
            <div className="admin-row-end">
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setMemberEdit(null)}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                className="admin-btn"
                onClick={saveMember}
                disabled={busy}
              >
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {cropSrc && (
        <PhotoCropper
          src={cropSrc}
          onDone={onCropDone}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  );
}

export default TeamAdmin;
