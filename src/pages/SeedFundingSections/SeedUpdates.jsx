import "./SeedUpdates.css";
import "../../ScrollAnimation.css";
import useScrollAnimation from "../../ScrollAnimation";
import React, { useState }from "react";

const TABS = ["All", "Announcements", "Deadlines", "Schedules", "Results"];

const announcements = [
  {
    id: 1,
    date: "July 28, 2026",
    time: "10:30 AM Onwards",
    tags: [{ label: "OPEN", type: "open" },
      { label: "URGENT", type: "urgent", dot: true },
    ],
    title: "Offline Presentations",
    description:
      "Shortlisted candidates with the complete team, along with the Project Mentor (Compulsory), must be present during the presentation. Participants are requested to report to the venue at least 15 minutes before their allotted presentation slot with their presentation and any supporting materials. Non-attendance or the absence of the Project Mentor may lead to disqualification from further consideration.",
    category: "Announcements",
  },
  {
    id: 2,
    date: "July 15, 2026",
    time: "11:59 PM",
    tags: [{ label: "CLOSED", type: "deadline" }],
    title: "Application Deadline",
    description:
      "Applications for the Seed Funding Opportunity 2026 will close soon. All interested applicants are encouraged to submit their proposals before the deadline.",
    category: "Deadlines",
  },
  {
    id: 3,
    date: "June 15, 2026",
    time: "10:00 AM",
    tags: [{ label: "CLOSED", type: "deadline" }],
    title: "Applications Now Open for Seed Funding 2026",
    description:
      "Seed funding opportunity 2026 is officially accepting proposal. All eligible UG, PG, and PhD students may submit their proposals through the official portal and at the PDUIIC office.",
    category: "Announcements",
  },
];

function SeedUpdates() {
useScrollAnimation();

  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? announcements
      : announcements.filter((item) => item.category === activeTab);

  return (
    <section id="updates" className="announcements">
      <p className="eyebrow">Updates</p>
      <h2 className="heading reveal slide-left">Announcements &amp; Important notices</h2>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="timeline">
        {filtered.map((item) => (
          <div className="timeline-item" key={item.id}>
            <div className="timeline-line" />
            <div className="timeline-content">
              <div className="timeline-meta">
                <span className="timeline-date">{item.date}</span>
                <span className="timeline-time">{item.time}</span>
              </div>

              <div className="tag-row">
                {item.tags.map((tag) => (
                  <span className={`tag tag-${tag.type}`} key={tag.label}>
                    {tag.dot && <span className="tag-dot" />}
                    {tag.label}
                  </span>
                ))}
              </div>

              <h3 className="timeline-title">{item.title}</h3>
              <p className="timeline-description">{item.description}</p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="empty-state">No updates in this category yet.</p>
        )}
      </div>
    </section>
  );
}

export default SeedUpdates;
