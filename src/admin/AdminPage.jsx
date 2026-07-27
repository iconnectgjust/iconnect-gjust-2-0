import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Admin.css";
import logo from "../assets/iconlogo.png";
import TeamAdmin from "./TeamAdmin";
import GalleryAdmin from "./GalleryAdmin";
import AnnouncementsAdmin from "./AnnouncementsAdmin";
import AlumniAdmin from "./AlumniAdmin";
import Seo from "../Seo";

const TABS = [
  { id: "team", label: "Team Archive", icon: "bx-group", el: <TeamAdmin /> },
  { id: "gallery", label: "Gallery", icon: "bx-image", el: <GalleryAdmin /> },
  { id: "announcements", label: "Announcements", icon: "bx-megaphone", el: <AnnouncementsAdmin /> },
  { id: "alumni", label: "Alumni", icon: "bx-planet", el: <AlumniAdmin /> },
];

function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [tab, setTab] = useState("team");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    setBusy(false);
  };

  if (session === undefined) {
    return <div className="admin-shell admin-center"><p className="admin-muted">Loading…</p></div>;
  }

  if (!session) {
    return (
      <div className="admin-shell admin-center admin-loginbg">
        <Seo title="Admin | Team iConnect" description="Admin panel." path="/admin" noindex />
        <div className="admin-glow admin-glow-1"></div>
        <div className="admin-glow admin-glow-2"></div>
        <form className="admin-login" onSubmit={login}>
          <div className="admin-logoring"><img src={logo} alt="iConnect" /></div>
          <h1>Welcome back</h1>
          <p className="admin-logintag">Sign in to manage the iConnect website</p>
          <label>Email
            <div className="admin-inputwrap">
              <i className="bx bx-envelope"></i>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" placeholder="you@iconnectgjust.in" required />
            </div>
          </label>
          <label>Password
            <div className="admin-inputwrap">
              <i className="bx bx-lock-alt"></i>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••••" required />
            </div>
          </label>
          {err && <p className="admin-err"><i className="bx bx-error-circle"></i> {err}</p>}
          <button className="admin-btn admin-loginbtn" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in →"}</button>
          <p className="admin-muted admin-loginnote">Admin accounts are created in the Supabase dashboard<br />(Authentication → Users)</p>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <Seo title="Admin | Team iConnect" description="Admin panel." path="/admin" noindex />
      <header className="admin-header">
        <div className="admin-brand">
          <img src={logo} alt="iConnect" />
          <span>iConnect <b>Admin</b></span>
        </div>
        <nav className="admin-nav">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? "admin-tab admin-tab-active" : "admin-tab"} onClick={() => setTab(t.id)}>
              <i className={`bx ${t.icon}`}></i> {t.label}
            </button>
          ))}
        </nav>
        <span className="admin-spacer" />
        <span className="admin-muted admin-user"><i className="bx bx-user-circle"></i> {session.user.email}</span>
        <button className="admin-btn admin-btn-ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </header>
      <main className="admin-main">{TABS.find((t) => t.id === tab)?.el}</main>
    </div>
  );
}

export default AdminPage;
