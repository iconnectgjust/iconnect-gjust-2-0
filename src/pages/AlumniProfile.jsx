import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./AlumniProfile.css";
import Seo from "../Seo";
import { fetchAlumniBySlug } from "../lib/alumniApi";

function formatJoined(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function AlumniProfile() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    let alive = true;
    setProfile(undefined);
    fetchAlumniBySlug(slug).then((p) => alive && setProfile(p || null));
    return () => { alive = false; };
  }, [slug]);

  if (profile === undefined) {
    return (
      <div className="alp">
        <div className="alp-state">Loading profile…</div>
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="alp">
        <Seo
          title="Alumni profile not found | Team iConnect"
          description="This alumni profile is not available."
          path={`/alumni/${slug}`}
          noindex
        />
        <div className="alp-state">
          <h1>Profile not found</h1>
          <p>This alumni profile does not exist, or is awaiting verification.</p>
          <Link className="alp-back" to="/alumni">← Back to the Alumni Directory</Link>
        </div>
      </div>
    );
  }

  const roles = profile.roles || [];
  const joined = formatJoined(profile.approved_at);

  // Person structured data helps search engines understand the page.
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    ...(profile.current_designation && { jobTitle: profile.current_designation }),
    ...(profile.current_organization && {
      worksFor: { "@type": "Organization", name: profile.current_organization },
    }),
    ...(profile.photo_url && { image: profile.photo_url }),
    ...(profile.linkedin && { sameAs: [profile.linkedin] }),
    alumniOf: {
      "@type": "Organization",
      name: "Team iConnect, PDUIIC, GJUS&T Hisar",
      url: "https://www.iconnectgjust.in/",
    },
  };

  return (
    <div className="alp">
      <Seo
        title={`${profile.full_name} | iConnect Alumni — GJUS&T Hisar`}
        description={
          `${profile.full_name} — ${roles[0] || "member"} at Team iConnect, PDUIIC GJUS&T Hisar` +
          `${profile.current_designation ? `, now ${profile.current_designation}` : ""}` +
          `${profile.current_organization ? ` at ${profile.current_organization}` : ""}.`
        }
        path={`/alumni/${profile.slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <nav className="alp-crumbs" aria-label="Breadcrumb">
        <Link to="/alumni">Alumni Network</Link>
        <span aria-hidden="true">/</span>
        <span>{profile.full_name}</span>
      </nav>

      <header className="alp-header">
        <div className="alp-avatar">
          {profile.photo_url
            ? <img src={profile.photo_url} alt={profile.full_name} width="160" height="160" />
            : <span aria-hidden="true">{profile.full_name.charAt(0)}</span>}
        </div>

        <div className="alp-head-text">
          <h1>{profile.full_name}</h1>
          {profile.current_designation && <p className="alp-desig">{profile.current_designation}</p>}
          {profile.current_organization && <p className="alp-org">{profile.current_organization}</p>}

          {profile.linkedin && (
            <a
              className="alp-linkedin"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bx bxl-linkedin"></i> View LinkedIn profile
            </a>
          )}
        </div>
      </header>

      <section className="alp-body">
        {roles.length > 0 && (
          <div className="alp-block">
            <h2>Roles at iConnect</h2>
            <ol className="alp-roles">
              {roles.map((r, i) => (
                <li key={r + i} className={i === 0 ? "alp-role alp-role-primary" : "alp-role"}>
                  <span>{r}</span>
                  {i === 0 && <em>Primary role</em>}
                </li>
              ))}
            </ol>
          </div>
        )}

        {profile.summary && (
          <div className="alp-block">
            <h2>About</h2>
            <p className="alp-summary">{profile.summary}</p>
          </div>
        )}

        {joined && (
          <p className="alp-joined">
            Part of the iConnect Alumni Network since {joined}.
          </p>
        )}

        <Link className="alp-back" to="/alumni">← Back to the Alumni Directory</Link>
      </section>
    </div>
  );
}

export default AlumniProfile;
