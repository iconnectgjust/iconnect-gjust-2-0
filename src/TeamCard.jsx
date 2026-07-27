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
        {member.linkedin && (
          <a
            className="teamcard-linkedin"
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
          >
            <i className="bx bxl-linkedin"></i>
            <span>Connect</span>
          </a>
        )}
      </div>
      <h2>{member.name}</h2>
      <p>{member.role}</p>
    </div>
  );
}

export default TeamCard;
