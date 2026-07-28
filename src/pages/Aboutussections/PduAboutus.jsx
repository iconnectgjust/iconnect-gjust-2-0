import "./PduAboutus.css";
import aboutimage from "../../assets/aboutimg.jpeg";
import visionlogo from "../../assets/visionimg.png";

function pduAboutus(){
    return(
        <>
            <section className="white-aboutus">
                 <div className="aaboutcontatiner">
                          <div className="aabout-section">
                            <h2 className="reveal slide-left delay-1">About iConnect</h2>
                            <p className="reveal slide-left delay-1">
                              Team iConnect is the student organization located at the Pandit Deendayal Upadhyay Innovation & Incubation Center(PDUIIC) at GJUS&T in Hisar. We are a passionate and proactive team dedicated to bridging the gap between students and the tech-driven world. Our mission is to foster a culture of innovation, collaboration and leadership through hands-on events, workshops, and national-level competitions.
                              iConnect is run by a well-defined administrative team, an influential advisory panel, and a mentoring system.
                              With a strong focus on building 21st-century skills, we provide platforms for students to ideate, showcase, and scale their talents—whether it’s through entrepreneurship, problem-solving, public speaking, or tech innovation.
                            </p>
                          </div>
                
                          <div className="aaboutimage">
                            <div className="iimage-bg reveal slide-right"></div>
                            <img className="reveal slide-right delay-1" src={aboutimage} alt="PDUIIC building at GJUS&T Hisar" />
                          </div>
                 </div>
                 <div className="visioncontainer">
                    <div className="visionimage reveal slide-left">
                        <img className="reveal zoom-in delay-1" src={visionlogo} alt="footer image" />
                    </div>
                    <div className="visioncontent">
                        <h2 className="reveal slide-right">Our Mission</h2>
                        <p className="reveal slide-right delay-1">1.To cultivate an environment of creativity, inclusivity, and teamwork by connecting students from diverse disciplines.<br/>
                           2.To provide mentorship, resources, and guidance for the development of innovative ideas and entrepreneurial ventures.<br/>
                           3.To enhance students’ technical, managerial, and interpersonal skills through organized events, workshops, and collaborative projects.<br/>
                           4.To contribute to the academic and professional excellence of its members while aligning with the broader objectives of PDUIIC and GJUS&T.<br/>
                           5.To build a network of innovators and leaders committed to societal betterment and sustainable innovation.
                        </p>
                    </div>
                
                 </div>
            </section>
        </>
    );
}

export default pduAboutus;