import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import navimage from "../../assets/iConnectSeedLogo.png";
import "./SeedNavbar.css";

function SeedNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const location = useLocation();

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

    setMenuOpen(false);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="logo">
            <Link
              to="/seedfunding"
              onClick={() => {
                if (location.pathname === "/seedfunding") {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }
              }}
            >
              <img
                src={navimage}
                alt="iConnect Logo"
                height="68px"
                width="180px"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li>
              <Link
                to="/seedfunding"
                onClick={() => {
                  setActiveTab("home");
                  setMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={activeTab === "home" ? "active-link" : ""}
              >
                Home
              </Link>
            </li>

            <li>
              <a
                href="#updates"
                className={activeTab === "updates" ? "active-link" : ""}
                onClick={(e) => {
                  setActiveTab("updates");
                  handleScrollLink(e, "updates");
                }}
              >
                Updates
              </a>
            </li>

            {/* Mobile Button */}
            <li className="mobile-btn">
              <a
                href="https://forms.gle/5cdaBqPBvoDccumW9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="apply-btn">Apply Now →</button>{" "}
              </a>
            </li>
          </ul>

          {/* Desktop Button */}
          <a
            className="desktop-btn"
            href="https://forms.gle/5cdaBqPBvoDccumW9"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            <button className="apply-btn">Apply Now →</button>
          </a>

          {/* Mobile Menu */}
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
      </nav>
      <div className="announcement-bar">
          <div className="announcement-track">
            📢 Important : Offline Presentation Round of Seed Funding will held on 28th July, 2026.
          </div>
        </div>
    </>
  );
}

export default SeedNavbar;
