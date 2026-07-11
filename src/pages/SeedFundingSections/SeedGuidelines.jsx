import "./SeedGuidelines.css";
import "../../ScrollAnimation.css";
import useScrollAnimation from "../../ScrollAnimation";
import React from "react";

const guidelines = [
  {
    title: "Selection Process",
    items: [
      "Innovation & Creativity",
      "Feasibility & Market Potential",
      "Social & Economic Impact",
      "Team Capability",
    ],
  },
  {
    title: "Utilization of Funds",
    items: [
      "Prototype Development",
      "Research & Validation",
      "Business Model Testing",
      "Initial Marketing / Branding",
    ],
  },
  {
    title: "Monitoring & Reporting",
    items: [
      "Progress report every 2 months",
      "Submit the final report and presentation at the end of the funding period.",
      "The project's initial duration is 6 months, subject to satisfactory progress and achievement of objectives.",
    ],
  },
  {
    title: "Intellectual Property",
    items: [
      "IP generated belongs to students",
      "Acknowledgement must be given to PDUIIC, GJUS&T",
    ],
  },
  {
    title: "Non Compliance",
    items: [
      "Misuse of funds may lead to cancellation of funding and disciplinary action",
    ],
  },
  {
    title: "Additional Support",
    items: ["Access to University Labs", "Networking Opportunities"],
  },
];

function SeedGuidelines() {
  useScrollAnimation();

  return (
    <section className="funding-guidelines">
      <p className="guidelines-eyebrow">Funding Guidelines</p>

      <h2 className="guidelines-heading reveal slide-left">
        Programme policies & responsibilities
      </h2>

      <div className="guidelines-grid">
        {guidelines.map((section) => (
          <div className="guideline-card reveal fade-up delay-3" key={section.title}>
            <h3>{section.title}</h3>

            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SeedGuidelines;
