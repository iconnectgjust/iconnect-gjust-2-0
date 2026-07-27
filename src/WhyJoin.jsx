import { useEffect, useState } from "react";
import "./WhyJoin.css";
import { fetchSettings } from "./lib/publicData";
import useScrollAnimation from "./ScrollAnimation";
import "./ScrollAnimation.css";

const perks = [
  { icon: "bx-badge-check", title: "Real Skills", desc: "Marketing, design, tech, operations — learn by running real events for thousands of students." },
  { icon: "bx-certification", title: "Certificates & Roles", desc: "Verifiable positions of responsibility and certificates that carry weight on your resume." },
  { icon: "bx-network-chart", title: "Network", desc: "Founders, mentors, faculty and a team of ambitious peers — your circle changes here." },
  { icon: "bx-crown", title: "Leadership", desc: "Coordinator to Lead to Head to Captain — a real growth ladder inside the society." },
];

function WhyJoin() {
  const [recruitment, setRecruitment] = useState(null);
  useScrollAnimation(recruitment);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    fetchSettings().then((s) => setRecruitment(s.recruitment));
  }, []);

  const notifyMe = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/support@iconnectgjust.in", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "Recruitment notify-me — iConnect website",
          email: email,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="whyjoin" id="whyjoin">
      <h2 className="whyjoin-heading reveal fade-up">WHY JOIN iCONNECT</h2>
      <div className="whyjoin-grid">
        {perks.map((p, idx) => (
          <div className={`whyjoin-card reveal fade-up delay-${(idx % 3) + 1}`} key={p.title}>
            <i className={`bx ${p.icon}`}></i>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>

      {recruitment?.enabled && (
        <div className="recruit-banner reveal fade-up">
          <div className="recruit-text">
            <span className="recruit-status">{recruitment.status}</span>
            <h3>{recruitment.headline}</h3>
            <p>{recruitment.text}</p>
          </div>
          <div className="recruit-action">
            <div className="recruit-inputrow">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                aria-label="Email for recruitment updates"
              />
              <button onClick={notifyMe} disabled={status === "sending"}>
                {status === "sending" ? "..." : "Notify me"}
              </button>
            </div>
            {status === "sent" && <p className="recruit-ok">✅ You&apos;ll be the first to know!</p>}
            {status === "error" && <p className="recruit-err">⚠️ Enter a valid email.</p>}
          </div>
        </div>
      )}
    </section>
  );
}

export default WhyJoin;
