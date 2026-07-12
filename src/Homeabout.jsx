import "./Homeabout.css";
import aboutimage from "./assets/aboutimg.jpeg";
import leftlogo from "./assets/iconnectlogo.png";
import aboutlogo from "./assets/iconlogo.png";
import { Link } from 'react-router-dom';

function Homeabout() {
  return (
    <>
      <section id="aboutus" className="whiteabout">
        <div className="exclamation">
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="90" viewBox="0 0 6 90" fill="none">
            <path d="M3 3L3 87" stroke="black" strokeWidth="6" strokeLinecap="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="black" />
          </svg>
        </div>

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
            <img src={aboutimage} alt="about section" />
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
              <h2>56+</h2>
              <p>EVENT CONDUCTED</p>
            </div>
            <div className="stat-box">
              <h2>25,000+</h2>
              <p>FOOTFALLS ACROSS<br />EVENTS</p>
            </div>
            <div className="stat-box">
              <h2>1M+</h2>
              <p>IMPRESSIONS ACROSS<br />THE PLATFORMS</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Homeabout;
