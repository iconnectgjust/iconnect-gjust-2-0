import "./JourneyTimeline.css";
import data from "../../data/journey.json";
import useScrollAnimation from "../../ScrollAnimation";
import "../../ScrollAnimation.css";

function JourneyTimeline() {
  useScrollAnimation();

  return (
    <section className="journey">
      <h1 className="reveal fade-up">OUR JOURNEY</h1>
      <div className="journey-line">
        {data.milestones.map((m, idx) => (
          <div
            className={`journey-item ${idx % 2 === 0 ? "journey-left" : "journey-right"} reveal fade-up`}
            key={m.title + idx}
          >
            <div className="journey-dot"></div>
            <div className="journey-card">
              <span className="journey-year">{m.year}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default JourneyTimeline;
