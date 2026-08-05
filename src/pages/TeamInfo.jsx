import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./TeamInfo.css";
import Seo from "../Seo";
import { photoSrc } from "../lib/publicData";
import { fetchTeamMember } from "../lib/teammembersdata";
import useScrollAnimation from "../ScrollAnimation";
import "../ScrollAnimation.css";

function TeamInfo({ slug: slugProp }) {
  const { slug: slugParam } = useParams();
  const slug = slugProp || slugParam;
  const [member, setMember] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | found | notfound

  useScrollAnimation(member);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setMember(null);

    fetchTeamMember(slug).then((data) => {
      if (cancelled) return;
      if (!data) {
        setStatus("notfound");
        return;
      }
      setMember(data);
      setStatus("found");
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="teaminfo-page">
        <div className="teaminfo-state">
          <p className="teaminfo-loading">Loading member details…</p>
        </div>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="teaminfo-page">
        <div className="teaminfo-state reveal fade-up">
          <h1>Member Not Found</h1>
          <p>We couldn&apos;t find a team member matching this profile.</p>
          <Link to="/team" className="teaminfo-back">
            ← Back to Team Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="teaminfo-page">
      <Seo
        title={`${member.name} | Team iConnect — GJUS&T Hisar`}
        description={`${member.name}, ${member.role} at iConnect, PDUIIC, GJUS&T Hisar.`}
        path={`/team/${member.slug}`}
      />

      <div className={`teaminfo-card ${member.color || ""} reveal fade-up`}>
        <div className="teaminfo-cardtop">
          <span className="teaminfo-eyebrow">Team Member Information</span>
        </div>

        <div className="teaminfo-main">
          <div className="teaminfo-photowrap">
            <img src={photoSrc(member.img)} alt={member.name} className="teaminfo-photo" />
          </div>

          <div className="teaminfo-info">
            <h1 className="teaminfo-name">{member.name}</h1>
            <p className="teaminfo-role">{member.role}</p>

            <div className="teaminfo-details">
              {member.rollno && (
                <div className="teaminfo-row">
                  <span className="teaminfo-label">Roll Number</span>
                  <span className="teaminfo-value">{member.rollno}</span>
                </div>
              )}
              {member.course && (
                <div className="teaminfo-row">
                  <span className="teaminfo-label">Course</span>
                  <span className="teaminfo-value">{member.course}</span>
                </div>
              )}
              {member.department && (
                <div className="teaminfo-row">
                  <span className="teaminfo-label">Department</span>
                  <span className="teaminfo-value">{member.department}</span>
                </div>
              )}
              <div className="teaminfo-row">
                <span className="teaminfo-label">Role</span>
                <span className="teaminfo-value">{member.role}</span>
              </div>
              <div className="teaminfo-row">
                <span className="teaminfo-label">LinkedIn</span>
                <span className="teaminfo-value">
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="teaminfo-linkedin-link"
                    >
                      <i className="bx bxl-linkedin-square"></i> View Profile
                    </a>
                  ) : (
                    <span className="teaminfo-value-muted">Not available</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {member.note && (
          <div className="teaminfo-note">
            <span className="teaminfo-note-title">Official Note</span>
            <p>{member.note}</p>
          </div>
        )}

        <div className="teaminfo-backwrap">
          <Link to="/team" className="teaminfo-back-btn">
            ← Back to Archive
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TeamInfo;