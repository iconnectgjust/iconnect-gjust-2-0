import "./SeedAbout.css";
import "../../ScrollAnimation.css";
import useScrollAnimation from "../../ScrollAnimation";
import React from "react";

const whoCanApply = [
  {
    title: "UG Students",
    description: "Currently enrolled undergraduates",
  },
  {
    title: "PG Students",
    description: "Masters programme scholars",
  },
  {
    title: "PhD Students",
    description: "Doctoral research candidates",
  },
  {
    title: "Individual or Teams up to 5 members",
    description: "Only full-time students of GJUS&T",
  },
];

const proposalItems = [
  "Problem Statement",
  "Proposed Solution",
  "Innovation & Uniqueness",
  "Business Model",
  "Team Details",
  "Budget Plan",
];

function SeedAbout() {
  useScrollAnimation();

  return (
    <section className="programme-details">
      <p className="eyebrow">Programme Details</p>
      <h1 className="heading reveal slide-left">Everything you need&nbsp; to get started</h1>

      <div className="content-grid">
        <div className="funding-block reveal slide-left">
          <p className="label">Funding Support</p>
          <p className="funding-amount">Upto ₹1.5L</p>
          <p className="funding-description">
            Per selected startup or project — to support prototyping,
            development, and early-stage growth.
          </p>
        </div>

        <div className="dates-block reveal slide-right">
          <p className="label">Important Dates</p>

          <div className="date-row">
            <span className="icon icon-open" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  fill="currentColor"
                />
                <path d="M14 2v6h6" fill="#ffffff" opacity="0.4" />
              </svg>
            </span>
            <div className="date-text">
              <p className="date-title">Applications Open</p>
              <p className="date-value">June 15, 2026</p>
            </div>
            <span className="aboutbadge aboutbadge-open">OPEN</span>
          </div>

          <div className="date-row">
            <span className="icon icon-close" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  fill="currentColor"
                />
                <path d="M14 2v6h6" fill="#ffffff" opacity="0.4" />
              </svg>
            </span>
            <div className="date-text">
              <p className="date-title">Applications Close</p>
              <p className="date-value">July 15, 2026</p>
            </div>
            <span className="aboutbadge aboutbadge-deadline">DEADLINE</span>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="who-can-apply reveal slide-left">
          <p className="label">Who Can Apply</p>
          <ul className="check-list">
            {whoCanApply.map((item) => (
              <li className="check-item" key={item.title}>
                <span className="check-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="currentColor" />
                    <path
                      d="M7 12.5l3 3 7-7"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </span>
                <div>
                  <p className="check-title">{item.title}</p>
                  <p className="check-description">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="proposal-include reveal slide-right">
          <p className="label">Your Proposal Should Include</p>
          <ul className="proposal-list">
            {proposalItems.map((item, index) => (
              <li className="proposal-item" key={item}>
                <span className="proposal-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="proposal-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default SeedAbout;
