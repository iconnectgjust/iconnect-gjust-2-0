import "./Contact.css";
import Seo from "../Seo";
import Hometouch from "../Hometouch";
import Homefooter from "../Homefooter";

function Contact() {
  return (
    <div className="contactpage">
      <Seo
        title="Contact Us | Team iConnect — PDUIIC, GJUS&T Hisar"
        description="Reach Team iConnect at PDUIIC, GJUS&T Hisar — send a message, email support@iconnectgjust.in, WhatsApp us, or visit the centre on campus."
        path="/contact"
      />
      <header className="contactpage-hero">
        <h1>CONTACT US</h1>
        <p>Questions, ideas, collaborations — we answer all of them.</p>
      </header>
      <Hometouch />
      <Homefooter />
    </div>
  );
}

export default Contact;
