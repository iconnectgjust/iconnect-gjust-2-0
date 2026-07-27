import "./FiveIs.css";
import data from "./data/fiveIs.json";
import useScrollAnimation from "./ScrollAnimation";
import "./ScrollAnimation.css";

function FiveIs() {
  useScrollAnimation();

  return (
    <section className="five-is" id="fiveis">
      <h2 className="five-is-heading reveal fade-up">THE FIVE I&apos;S WE FUEL</h2>
      <p className="five-is-sub reveal fade-up">
        Everything iConnect does maps to five pillars — the journey from hearing about an idea to shipping it.
      </p>
      <div className="five-is-grid">
        {data.pillars.map((p, idx) => (
          <div className={`five-is-card reveal fade-up delay-${(idx % 3) + 1}`} key={p.word} style={{ "--pillar-color": p.color }}>
            <i className={`bx ${p.icon}`}></i>
            <h3>{p.word}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FiveIs;
