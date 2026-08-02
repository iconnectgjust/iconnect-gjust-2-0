import "./Homefooter.css";
import footerlogo from "./assets/FooterLogo.png";
import { useState } from "react";
import { Link } from "react-router-dom";

function Homefooter() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState("idle"); // idle | sending | sent | error

  const handleSubscribe = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubStatus("error");
      return;
    }
    setSubStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/support@iconnectgjust.in", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "New newsletter subscriber — iConnect website",
          email: email,
        }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setSubStatus("sent");
      setEmail("");
    } catch {
      setSubStatus("error");
    }
  };

  return (
    <>
      <section className="footerblack">
        <div className="footercontent">
          <div className="footimage">
            <img src={footerlogo} alt="Team iConnect logo" loading="lazy" />
          </div>

          <div className="footlinks">
            <h2>TEAM iCONNECT</h2>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/pduiic">PDUIIC</Link>
            <Link to="/team">Team Archive</Link>
            <Link to="/alumni">Alumni</Link>
            <a href="/#initiative">Our Initiatives</a>
            <Link to="/gallery">Gallery</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/seedfunding">Seed Funding</Link>
          </div>

          <div className="footfollow">
            <h2>Follow Us</h2>
            <a href="https://www.linkedin.com/company/iconnect-gjust/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/iconnectgjust/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://x.com/iconnectgjust?t=GZGkd_h65aoTtg3M5MnmCg&s=08" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
            <a href="https://www.whatsapp.com/channel/0029VaELUPEGU3BNfgEAmU0h" target="_blank" rel="noopener noreferrer">Whatsapp</a>
            <a href="https://www.youtube.com/@iConnectGJUST" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>

          <div className="footget">
            <h2>GET NOTIFIED</h2>
            <p>Be the first to know about the activities of iConnect.</p>
            <div className="footgetcom">
              <input
                type="email"
                placeholder="Type email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSubStatus("idle"); }}
                aria-label="Email for updates"
              />
              <button onClick={handleSubscribe} disabled={subStatus === "sending"} aria-label="Subscribe">
                <i className={subStatus === "sending" ? "bx bx-loader-alt bx-spin" : "bx bx-envelope"}></i>
              </button>
            </div>
            {subStatus === "sent" && <p className="foot-sub-status foot-sub-ok">✅ You are on the list!</p>}
            {subStatus === "error" && <p className="foot-sub-status foot-sub-err">⚠️ Enter a valid email.</p>}
          </div>
        </div>

        <div className="footerend">
          <span>With ❤︎⁠ from </span>
          <span>Team iConnect, GJUS&T, Hisar</span>
        </div>
      </section>
    </>
  );
}

export default Homefooter;
