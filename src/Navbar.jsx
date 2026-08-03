import './Navbar.css';
import navimage from "./assets/iconnectlogo.png";
import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';

const HOME_SECTIONS = ["aboutus", "initiative", "gallery", "contact"];

function Navbar() {
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  const pressClick = () => {
    setNav(!nav);
  };

  const handleScrollLink = (e, targetId) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById(targetId);
      if (el) {
        const offset = -100;
        const y = el.getBoundingClientRect().top + window.pageYOffset + offset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${targetId}`;
    }
    setNav(false);
  };

  useEffect(() => {
    setNav(false);
  }, [location]);

  // Glass effect + scrollspy
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      if (location.pathname !== "/") return;
      let current = "";
      for (const id of HOME_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const linkClass = (match) => (match ? "nav-active" : "");

  return (
    <>
      <div className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className='logo'>
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src={navimage} alt="iConnect Logo" height="68px" width="180px" />
          </Link>
        </div>

        <div id='navlinks' className={`navlinks ${nav ? 'mobile-active' : ''}`}>
          <ul id="navbar">
            <li><Link className={linkClass(isHome && !activeSection)} to="/" onClick={(e) => { e.preventDefault();if (location.pathname === "/") {window.scrollTo({ top: 0, behavior: "smooth" });} else {window.location.href = "/";}setNav(false);}}>Home</Link></li>
            <li><Link className={linkClass(location.pathname === "/about")} to="/about" onClick={pressClick}>About Us</Link></li>
            <li><a className={linkClass(isHome && activeSection === "initiative")} href="#initiative" onClick={(e) => handleScrollLink(e, "initiative")}>Initiatives</a></li>
            <li><Link className={linkClass(location.pathname === "/gallery")} to="/gallery" onClick={pressClick}>Gallery</Link></li>
            <li><Link className={linkClass(location.pathname === "/pduiic")} to="/pduiic" onClick={pressClick}>PDUIIC</Link></li>
            <li><Link className={linkClass(location.pathname.startsWith("/team"))} to="/team" onClick={pressClick}>Team</Link></li>
            <li><Link className={linkClass(location.pathname === "/alumni")} to="/alumni" onClick={pressClick}>Alumni</Link></li>
            <li><Link className={linkClass(location.pathname === "/contact")} to="/contact" onClick={pressClick}>Contact</Link></li>
            <li><a href="https://esummit26.iconnectgjust.in/" target='_blank'>E-Summit'26</a></li>
            <li><Link className={linkClass(location.pathname === "/seedfunding")} to="/seedfunding" onClick={pressClick}>Seed Funding</Link></li>
          </ul>
          <a href="#" id="close" onClick={pressClick}><i className='bx bx-x'></i></a>
        </div>

        <div id="mobile" onClick={pressClick} className={nav ? 'mobile-active' : ''}>
          {!nav && <i className='bx bx-menu'></i>}
        </div>
      </div>
    </>
  );
}

export default Navbar;
