import { Link } from "react-router-dom";
import { photoSrc } from "./lib/publicData";
import "./TeamCard.css";

// Shared team member card. Shows a LinkedIn overlay on hover when a URL is set.
// For the current year, "Connect" opens the member's own profile page
// (/team/:slug). For archived years, it links out to their LinkedIn instead,
// since a past member's /team/:slug page may no longer reflect who they are
// now (or may not resolve to them at all if they share a slug collision
// with someone in the current roster). If an archived member has no
// LinkedIn on file, no Connect link is rendered.
function TeamCard({ member, index = 0, isCurrent = false }) {
  return (
    <div
      key={member.name + index}
      className={`smallcard ${member.color || "card-blue"} reveal fade-up delay-1`}
    >
      <div className="teamcard-imgwrap">
        <img src={photoSrc(member.img)} alt={member.name} loading="lazy" />
        {isCurrent ? (
          <Link
            className="teamcard-linkedin"
            to={`/team/${member.slug}`}
            aria-label={`View ${member.name}'s profile`}
          >
            <span>Connect</span>
          </Link>
        ) : member.linkedin ? (
          <a
            className="teamcard-linkedin"
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${member.name}'s LinkedIn profile`}
          >
            <span>Connect</span>
          </a>
        ) : null}
      </div>
      <h2>{member.name}</h2>
      <p>{member.role}</p>
    </div>
  );
}

export default TeamCard;