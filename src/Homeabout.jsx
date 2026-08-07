import "./Homeabout.css";
import aboutimage from "./assets/aboutImage.jpg";
import leftlogo from "./assets/iconnectlogo.png";
import { Link } from 'react-router-dom';
import CountUp from "./CountUp";

function Homeabout() {
  return (
    <>
      <section id="aboutus" className="whiteabout">
        <div className="aboutcontatiner">
          <div className="about-section">
            <h2>ABOUT US</h2>
            <p>
              Team iConnect is the student organization located at the Pandit Deendayal Upadhyay Innovation & Incubation Center(PDUIIC) at GJUS&T in Hisar. We are a passionate and proactive team dedicated to bridging the gap between students and the tech-driven world. Our mission is to foster a culture of innovation, collaboration and leadership through hands-on events, workshops, and national-level competitions.
              Iconnect is run by a well-defined administrative team, an influential advisory panel, and a mentoring system.
              With a strong focus on building 21st-century skills, we provide platforms for students to ideate, showcase, and scale their talents.
            </p>
          </div>

          <div className="aboutimage">
            <div className="image-bg"></div>
            <img src={aboutimage} alt="Team iConnect at PDUIIC, GJUS&T Hisar" />
          </div>

          <div className="about-button">
                <Link to="/about" style={{ width: "100%" }}><button><span>Know more about us</span></button></Link>
          </div>
        </div>

        <div className="banner">
          <div className="left-section">
            <img src={leftlogo} alt="logo" />
            {/* <div className="text">
              <h1>iConnect</h1>
              <p>
                <span class="team-text">Team</span>
                <span class="pduiic-text"> PDUIIC</span>
              </p>
            </div> */}
          </div>
          <div className="stats">
            <div className="stat-box">
              <h2><CountUp end={56} suffix="+" /></h2>
              <p>EVENTS CONDUCTED</p>
            </div>
            <div className="stat-box">
              <h2><CountUp end={25000} suffix="+" /></h2>
              <p>FOOTFALLS ACROSS<br />EVENTS</p>
            </div>
            <div className="stat-box">
              <h2><CountUp end={1} suffix="M+" duration={1200} /></h2>
              <p>IMPRESSIONS ACROSS<br />THE PLATFORMS</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Homeabout;
