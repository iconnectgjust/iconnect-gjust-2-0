import { Link } from "react-router-dom";
import { photoSrc } from "./lib/publicData";
import "./TeamCard.css";

// Shared team member card. Shows a LinkedIn overlay on hover when a URL is set.
function TeamCard({ member, index = 0 }) {
  return (
    <div
      key={member.name + index}
      className={`smallcard ${member.color || "card-blue"} reveal fade-up delay-1`}
    >
      <div className="teamcard-imgwrap">
        <img src={photoSrc(member.img)} alt={member.name} loading="lazy" />
        <Link
          className="teamcard-linkedin"
          to={`/team/${member.slug}`}
          aria-label={`View ${member.name}'s profile`}
        >
          <span>Connect</span>
        </Link>
      </div>
      <h2>{member.name}</h2>
      <p>{member.role}</p>
    </div>
  );
}

export default TeamCard;
