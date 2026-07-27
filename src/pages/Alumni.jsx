import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Alumni.css";
import { fetchAlumni, photoSrc } from "../lib/publicData";
import Seo from "../Seo";
import useScrollAnimation from "../ScrollAnimation";
import "../ScrollAnimation.css";

function Alumni() {
  const [allBatches, setAllBatches] = useState([]);
  useScrollAnimation(allBatches);

  useEffect(() => { fetchAlumni().then(setAllBatches); }, []);

  const batches = allBatches.filter((b) => b.members?.length > 0);
  const isEmpty = batches.length === 0;

  return (
    <div className="alumnipage">
      <Seo
        title="Alumni Network | Team iConnect — GJUS&T Hisar"
        description="Where iConnect members go next — alumni of the innovation team at PDUIIC, GJUS&T Hisar, across companies, startups and graduate schools."
        path="/alumni"
      />

      <header className="alumnipage-hero">
        <h1>ALUMNI NETWORK</h1>
        <p>The people who built iConnect — and where they went next.</p>
      </header>

      {isEmpty ? (
        <section className="alumnipage-empty">
          <i className="bx bx-planet"></i>
          <h2>The network is being mapped</h2>
          <p>
            We&apos;re collecting profiles from past batches. If you were part of iConnect,
            we&apos;d love to feature where you are now.
          </p>
          <a
            className="alumnipage-cta"
            href="mailto:support@iconnectgjust.in?subject=Alumni%20profile%20for%20the%20iConnect%20website"
          >
            Submit your profile
          </a>
          <p className="alumnipage-alt">
            Meanwhile, browse the <Link to="/team">team archive</Link> to see every batch.
          </p>
        </section>
      ) : (
        batches.map((batch) => (
          <section className="alumnipage-batch" key={batch.year}>
            <h2 className="reveal fade-up">Batch {batch.year}</h2>
            <div className="alumnipage-grid">
              {batch.members.map((m) => (
                <div className="alumnipage-card reveal fade-up" key={m.name}>
                  {m.img && <img src={photoSrc(m.img)} alt={m.name} loading="lazy" />}
                  <h3>{m.name}</h3>
                  <p className="alumnipage-role">{m.role} at iConnect</p>
                  <p className="alumnipage-now">{m.now}</p>
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`}>
                      <i className="bx bxl-linkedin"></i>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

export default Alumni;
