import "./SeedFooter.css";
import React from "react";
import footerlogo from "../../assets/iconnectlogo.png";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/iconnect-gjust/",
  },
  { label: "Instagram", href: "https://www.instagram.com/iconnectgjust/" },
  {
    label: "X - Twitter",
    href: "https://x.com/iconnectgjust?t=GZGkd_h65aoTtg3M5MnmCg&s=08",
  },
  { label: "YouTube", href: "https://www.youtube.com/@iConnectGJUST" },
  { label: "WhatsApp", href: "https://www.whatsapp.com/channel/0029VaELUPEGU3BNfgEAmU0h" },
];

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.7 3.6.7.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.1c.6 0 1 .4 1 1 0 1.3.2 2.5.7 3.6.1.4 0 .8-.3 1.1l-2.2 2.1z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M3.5 6.5l7.6 6a1.5 1.5 0 0 0 1.8 0l7.6-6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function SeedFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footlogo">
            <img src={footerlogo} alt="iconnect logo" />
          </div>
          <p className="brand-description">
            An initiative by PDUIIC to empower student innovators with funding,
            mentorship, and startup ecosystem support at Guru Jambheshwar
            University of Science &amp; Technology, Hisar.
          </p>
        </div>

        <div className="footer-contacts">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="contact-list">
            <li className="contact-item">
              <span className="contact-icon">
                <PhoneIcon />
              </span>
              <span>+91 94679 05906</span>
            </li>
            <a href="mailto:support@iconnectgjust.in" className="mail-link">
              <span className="contact-icon">
                <MailIcon />
              </span>
              support@iconnectgjust.in
            </a>
          </ul>

          <div className="footer-address">
            <h3 className="footer-heading">Address</h3>
            <p className="address-text">
              PDUIIC building, GJUS&amp;T, Hisar,
              Haryana - 125001
            </p>
          </div>
        </div>

        <div className="footer-social">
          <h3 className="footer-heading">Social Links</h3>
          <ul className="social-list">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="social-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-credit">
          Build with <span className="heart">🤍</span> by Team iConnect
        </p>
        <p className="footer-rights">
          © Team iConnect, PDUIIC, GJUS&amp;T, Hisar. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default SeedFooter;
