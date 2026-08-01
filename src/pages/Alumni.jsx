import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Alumni.css";
import Seo from "../Seo";
import AlumniRegisterModal from "./AlumniRegisterModal";
import { fetchApprovedAlumni } from "../lib/alumniApi";
import useScrollAnimation from "../ScrollAnimation";
import "../ScrollAnimation.css";

const BENEFITS = [
  {
    icon: "bx-link-alt",
    title: "Stay connected",
    text: "Keep your link with Team iConnect alive long after graduation — invitations, updates and reunions come to you.",
  },
  {
    icon: "bx-network-chart",
    title: "Network with alumni",
    text: "Find iConnect seniors across companies, startups, research labs and universities, and reach them directly.",
  },
  {
    icon: "bx-bulb",
    title: "Mentor startups & students",
    text: "Guide the next batch through PDUIIC's seed funding, hackathons and pitch events — where you once stood.",
  },
  {
    icon: "bx-trophy",
    title: "Share achievements",
    text: "Your milestones become part of iConnect's story and show current members what is possible.",
  },
  {
    icon: "bx-calendar-star",
    title: "Join future events",
    text: "Return as a speaker, judge or panellist at Konark, E-Summit and iConnect Learners sessions.",
  },
  {
    icon: "bx-star",
    title: "Inspire current members",
    text: "Nothing motivates a fresher more than seeing where people from their own society ended up.",
  },
];

const PAGE_SIZE = 12;

function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useScrollAnimation(alumni);

  useEffect(() => {
    let alive = true;
    fetchApprovedAlumni().then((rows) => {
      if (!alive) return;
      setAlumni(rows);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const roleOptions = useMemo(() => {
    const set = new Set();
    alumni.forEach((a) => (a.roles || []).forEach((r) => r && set.add(r)));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [alumni]);

  const companyOptions = useMemo(() => {
    const set = new Set();
    alumni.forEach((a) => a.current_organization && set.add(a.current_organization));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [alumni]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alumni.filter((a) => {
      if (q && !a.full_name.toLowerCase().includes(q)) return false;
      if (roleFilter && !(a.roles || []).includes(roleFilter)) return false;
      if (companyFilter && a.current_organization !== companyFilter) return false;
      return true;
    });
  }, [alumni, query, roleFilter, companyFilter]);

  useEffect(() => setVisible(PAGE_SIZE), [query, roleFilter, companyFilter]);

  const shown = filtered.slice(0, visible);
  const hasFilters = query || roleFilter || companyFilter;

  const clearFilters = () => {
    setQuery("");
    setRoleFilter("");
    setCompanyFilter("");
  };

  return (
    <div className="alumnipage">
      <Seo
        title="Alumni Network | Team iConnect — GJUS&T Hisar"
        description="The iConnect Alumni Network — where members of the student innovation team at PDUIIC, GJUS&T Hisar are now. Browse the alumni directory or register your own profile."
        path="/alumni"
      />

      {/* ---------- Hero ---------- */}
      <header className="alumnipage-hero">
        <h1>ALUMNI NETWORK</h1>
        <p>The people who built iConnect — and where they went next.</p>
        <button className="al-cta" onClick={() => setModalOpen(true)}>
          Submit your profile
        </button>
        {!loading && alumni.length > 0 && (
          <div className="al-stats">
            <div><strong>{alumni.length}</strong><span>Alumni registered</span></div>
            <div><strong>{companyOptions.length}</strong><span>Organizations</span></div>
            <div><strong>{roleOptions.length}</strong><span>Roles held</span></div>
          </div>
        )}
      </header>

      {/* ---------- About the network ---------- */}
      <section className="al-about">
        <h2 className="reveal fade-up">About the Alumni Network</h2>
        <p className="reveal fade-up">
          Every year a new team carries iConnect forward, and every year a batch moves on —
          into companies, startups, research and higher studies across the country. The Alumni
          Network exists so that journey does not end at graduation. It keeps former members
          part of the society they helped build, and gives current students direct access to
          people who have already walked the path they are on.
        </p>
        <p className="reveal fade-up">
          Registering takes two minutes. Once our team verifies your details, your profile
          joins the public directory below — visible to students, faculty and fellow alumni.
        </p>
      </section>

      {/* ---------- Why join ---------- */}
      <section className="al-why">
        <h2 className="reveal fade-up">Why join the Alumni Network</h2>
        <div className="al-whygrid">
          {BENEFITS.map((b, i) => (
            <div className={`al-whycard reveal fade-up delay-${(i % 3) + 1}`} key={b.title}>
              <i className={`bx ${b.icon}`}></i>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Directory ---------- */}
      <section className="al-directory" id="directory">
        <h2 className="reveal fade-up">Alumni Directory</h2>

        {loading ? (
          <p className="al-muted">Loading the directory…</p>
        ) : alumni.length === 0 ? (
          <div className="al-empty">
            <i className="bx bx-planet"></i>
            <h3>The network is being mapped</h3>
            <p>
              We are collecting profiles from past batches. If you were part of iConnect,
              be among the first to join the directory.
            </p>
            <button className="al-cta" onClick={() => setModalOpen(true)}>Submit your profile</button>
            <p className="al-alt">
              Meanwhile, browse the <Link to="/team">team archive</Link> to see every batch.
            </p>
          </div>
        ) : (
          <>
            <div className="al-filters">
              <div className="al-search">
                <i className="bx bx-search"></i>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name…"
                  aria-label="Search alumni by name"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Filter by role held at iConnect"
              >
                <option value="">All roles</option>
                {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>

              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                aria-label="Filter by organization"
              >
                <option value="">All organizations</option>
                {companyOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              {hasFilters && (
                <button className="al-clear" onClick={clearFilters}>Clear</button>
              )}
            </div>

            <p className="al-count" role="status">
              {filtered.length} {filtered.length === 1 ? "profile" : "profiles"}
              {hasFilters ? " matching your filters" : ""}
            </p>

            {filtered.length === 0 ? (
              <p className="al-muted">No alumni match those filters yet.</p>
            ) : (
              <div className="al-grid">
                {shown.map((a) => (
                  <article className="al-card" key={a.id}>
                    <Link to={`/alumni/${a.slug}`} className="al-cardlink">
                      <div className="al-avatar">
                        {a.photo_url
                          ? <img src={a.photo_url} alt={a.full_name} loading="lazy" width="96" height="96" />
                          : <span aria-hidden="true">{a.full_name.charAt(0)}</span>}
                      </div>
                      <h3>{a.full_name}</h3>
                      {a.current_designation && <p className="al-desig">{a.current_designation}</p>}
                      {a.current_organization && <p className="al-org">{a.current_organization}</p>}
                    </Link>

                    {(a.roles || []).length > 0 && (
                      <ul className="al-roles">
                        {a.roles.map((r, i) => (
                          <li key={r + i} className={i === 0 ? "al-role al-role-primary" : "al-role"}>{r}</li>
                        ))}
                      </ul>
                    )}

                    {a.linkedin && (
                      <a
                        className="al-linkedin"
                        href={a.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${a.full_name} on LinkedIn`}
                      >
                        <i className="bx bxl-linkedin"></i> LinkedIn
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}

            {visible < filtered.length && (
              <button className="al-more" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load more ({filtered.length - visible} remaining)
              </button>
            )}

            <div className="al-joinstrip">
              <p>Were you part of iConnect?</p>
              <button className="al-cta" onClick={() => setModalOpen(true)}>Submit your profile</button>
            </div>
          </>
        )}
      </section>

      <AlumniRegisterModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default Alumni;
