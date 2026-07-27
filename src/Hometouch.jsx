import "./Hometouch.css";
import { useState } from "react";

function Hometouch(){
    const [form, setForm] = useState({ name: "", contact: "", email: "", message: "" });
    const [status, setStatus] = useState("idle"); // idle | sending | sent | error

    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setStatus("error");
            return;
        }
        setStatus("sending");
        try {
            const res = await fetch("https://formsubmit.co/ajax/support@iconnectgjust.in", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    _subject: "New message from iConnect website",
                    name: form.name,
                    contact: form.contact,
                    email: form.email,
                    message: form.message,
                }),
            });
            if (!res.ok) throw new Error("send failed");
            setStatus("sent");
            setForm({ name: "", contact: "", email: "", message: "" });
        } catch {
            setStatus("error");
        }
    };

    return(
        <>
            <section id="contact" className="whitetouch">
                <div className="touchcontainer">
                    <div className="contcontents">
                        <h2>Get in touch</h2>
                        <p>You can reach us at any time</p>
                        <div className="frame1">
                            <div>Full Name</div>
                            <input type="text" placeholder="Your name" value={form.name} onChange={handleChange("name")} required></input>
                        </div>
                        <div className="frame1">
                            <div>Contact</div>
                            <input type="tel" placeholder="+91 98765 43210" value={form.contact} onChange={handleChange("contact")}></input>
                        </div>
                        <div className="frame1">
                            <div>Email</div>
                            <input type="email" placeholder="some@example.com" value={form.email} onChange={handleChange("email")} required></input>
                        </div>
                        <div className="frame2">
                            <div>How can we help you?</div>
                            <textarea placeholder="Write your message here..." value={form.message} onChange={handleChange("message")} required></textarea>
                        </div>
                        <button className="contbutton" onClick={handleSubmit} disabled={status === "sending"}>
                            {status === "sending" ? "Sending..." : "Submit"}
                        </button>
                        {status === "sent" && <div className="form-status form-status-ok">✅ Message sent! We will get back to you soon.</div>}
                        {status === "error" && <div className="form-status form-status-err">⚠️ Please fill name, email and message — then try again.</div>}
                        <h3>Contact Us</h3>
                        <div className="iconcontent">
                            <i className='bx bx-envelope'></i>
                            <p>Email us at: <a className="contact-link" href="mailto:support@iconnectgjust.in">support@iconnectgjust.in</a></p>
                        </div>
                         <div className="iconcontent">
                            <i className='bx bx-phone' ></i>
                            <p>Whatsapp us at: <a className="contact-link" href="https://wa.me/919467905906" target="_blank" rel="noopener noreferrer">+91 9467905906</a></p>
                        </div>
                        <h3>Where to find us</h3>
                        <div className="iconcontent">
                            <i className='bx bx-map'></i>
                            <p>PDUIIC — Pandit Deendayal Upadhyay Innovation & Incubation Centre, GJUS&T Campus, Hisar, Haryana 125001</p>
                        </div>
                        <div className="iconcontent">
                            <i className='bx bx-time-five'></i>
                            <p>Team members are around on working days during university hours — drop by or message first on WhatsApp</p>
                        </div>
                        <div className="iconcontent">
                            <i className='bx bx-directions'></i>
                            <p>Joining queries → HR team · Seed funding & ideas → Innovation team · Event queries → Operations team (route via the form above)</p>
                        </div>
                        <div className="endtext">Team iConnect is committed to protecting and respecting your privacy. We use your personal data to respond to your contact requests.</div>
                    </div>
                    <div className="contmap">
                        <iframe title="GJUS&T Hisar on Google Maps" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3483.743530131716!2d75.72533527598264!3d29.172229075374307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3912333b75d2db1d%3A0xd3d27cd450e433e3!2sGuru%20Jambheshwar%20University%20of%20Science%20and%20Technology!5e0!3m2!1sen!2sin!4v1750671634783!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </section>
        </>
    );
}
export default Hometouch;
