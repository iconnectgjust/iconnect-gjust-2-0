import "./SeedBenefits.css";
import "../../ScrollAnimation.css";
import useScrollAnimation from "../../ScrollAnimation";
import React from "react";

const benefits = [
  {
    number: "01",
    title: "Lab Access",
    description:
      "Full access to university research and development facilities for prototyping.",
  },
  {
    number: "02",
    title: "Mentorship",
    description:
      "One-on-one guidance from industry experts and experienced faculty members.",
  },
  {
    number: "03",
    title: "Networking",
    description:
      "Connect with investors, alumni founders, and the broader startup community.",
  },
  {
    number: "04",
    title: "Ecosystem Exposure",
    description:
      "Access to incubation programmes, demo days, and accelerator partnerships.",
  },
];

function SeedBenefits() {
useScrollAnimation();

  return (
    <section className="beyond-funding">
      <p className="eyebrow">Beyond Funding</p>
      <h2 className="heading reveal slide-left">What you get with the programme</h2>

      <div className="card-grid">
        {benefits.map((item) => (
          <div className="benefit-card reveal fade-up delay-3" key={item.number}>
            <span className="benefit-number">{item.number}</span>
            <h3 className="benefit-title">{item.title}</h3>
            <p className="benefit-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SeedBenefits;
