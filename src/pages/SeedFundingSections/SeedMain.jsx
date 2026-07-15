import "./SeedMain.css";
import mainimage from "../../assets/SeedMainImage.png";
import "../../ScrollAnimation.css";
import useScrollAnimation from "../../ScrollAnimation";
import React from "react";

const handleScrollLink = (e, targetId) => {
  e.preventDefault();

  if (location.pathname === "/seedfunding") {
    const el = document.getElementById(targetId);

    if (el) {
      const offset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + offset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  } else {
    window.location.href = `/seedfunding#${targetId}`;
  }
};

function SeedMain() {
useScrollAnimation();

  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content reveal slide-left">
          <div className="badge">
            <span className="dot"></span>
            <h2>Offline Presentations - July 22, 2026</h2>
          </div>

          <h1>
            Seed Funding <br />
            Opportunity 2026
          </h1>

          <div className="underline"></div>

          <p className="subtitle">Empowering Ideas to Grow</p>

          <p className="description">
            Supporting student innovators with funding, mentorship and
            opportunities to transform ideas into impactful ventures.
          </p>

          <div className="hero-buttons">
            <a
              href="https://forms.gle/5cdaBqPBvoDccumW9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="apply-btn">
                Apply Now <span>→</span>
              </button>
            </a>

            <a
              href="https://drive.google.com/drive/folders/16Ze2L7r3lwMVsdE2l6OTn-8TPtw7UEcu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="update-btn">
                More Details <span>→</span>
              </button>
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="hero-image reveal slide-right">
          <img src={mainimage} alt="Seed Funding" />
        </div>
      </div>
    </section>
  );
}

export default SeedMain;
