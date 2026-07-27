import "./Wings.css";
import data from "../../data/wings.json";
import useScrollAnimation from "../../ScrollAnimation";
import "../../ScrollAnimation.css";

function Wings() {
  useScrollAnimation();

  return (
    <section className="wings">
      <h1 className="reveal fade-up">HOW WE&apos;RE ORGANIZED</h1>
      <p className="wings-sub reveal fade-up">
        Ten wings, one team. Find where you&apos;d fit before recruitment even opens.
      </p>
      <div className="wings-grid">
        {data.wings.map((w, idx) => (
          <div className={`wings-card reveal fade-up delay-${(idx % 3) + 1}`} key={w.name}>
            <i className={`bx ${w.icon}`}></i>
            <h3>{w.name}</h3>
            <p>{w.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Wings;
