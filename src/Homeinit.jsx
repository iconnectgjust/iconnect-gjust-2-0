import "./Homeinit.css";
import esummit from "./assets/Esummit.jpg";
import fest from "./assets/KonarkTechfest.jpg";
import learn from "./assets/LearnersClub.jpg";
import pitch from "./assets/PitchPoint.jpg";
import sih from "./assets/SIH.jpg";
import seedFunding from "./assets/SeedCardimage.png"
import { useState} from "react";
import { Link } from 'react-router-dom';

function Homeinit(){
    const [showEsummitMessage, setShowEsummitMessage] = useState(false);

    const handleEsummitClick = (e) => {
    e.preventDefault();
    setShowEsummitMessage(true);
    setTimeout(() => {
      setShowEsummitMessage(false);
    }, 2500);
  };

    return(
        <>

        {/* Sliding message */}
      {showEsummitMessage && <div className="esummit-toast">🚧 Coming Soon</div>}

            <section id="initiative" className="blacksec">
                <div className="initheading">OUR INITIATIVES</div>
                <div className="cardcontainer">
                    <div className="leftcont">
                        <div className="initcard">
                            <article className="initimgcont">
                                <img src={fest} alt="Konark Techfest — flagship tech fest of GJUS&T" loading="lazy"/>
                            </article>
                            <h2>Konark TechFest</h2>
                            <p className="initdesc">Our flagship tech fest, celebrating creativity, coding, and cutting-edge technology with workshops, hackathons, and competitions.</p>
                            <a className="esummitlink" href="https://konark26.iconnectgjust.in" target="_blank" rel="noopener noreferrer">Learn more</a>
                        </div>
                        <div className="initcard">
                            <article className="initimgcont">
                                <img src={esummit} alt="E-Summit — entrepreneurship summit at GJUS&T" loading="lazy"/>
                            </article>
                            <h2>E-Summit</h2>
                            <p className="initdesc">A grand entrepreneurship summit featuring keynote speakers, startup founders, panel discussions, and idea showcases.</p>
                             <a className="esummitlink" href="https://esummit.iconnectgjust.in" target="_blank" rel="noopener noreferrer">Learn more</a>
                        </div>
                    </div>
                    <div className="leftcont">
                            <div className="initcard">
                                <article className="initimgcont">
                                    <img src={seedFunding} alt="Seed Funding opportunity for student innovators" loading="lazy"/>
                                </article>
                                <h2>Seed Funding </h2>
                                <p className="initdesc">This opportunity aims to empower student innovators by providing seed funding, mentorship, workspace, and institutional support to transform innovative ideas into impactful startup ventures.</p>
                                <Link className="esummitlink" to="/seedfunding" target="_blank" rel="noopener noreferrer">Learn more</Link>
                            </div>
                            <div className="initcard">
                                <article className="initimgcont">
                                    <img src={pitch} alt="Pitch Point — startup pitch competition" loading="lazy"/>
                                </article>
                                <h2>Pitch Point</h2>
                                <p className="initdesc">A high-energy pitch competition where young innovators and aspiring entrepreneurs present their startup ideas to real investors and mentors.</p>
                                <button type="button" className="esummitlink initbtn" onClick={handleEsummitClick}>Learn more</button>
                            </div>
                    </div>
                    <div className="rightcont">
                        <div className="initcard">
                             <article className="initimgcont">
                                <img src={learn} alt="iConnect Learners — student upskilling initiative" loading="lazy"/>
                            </article>
                            <h2>iConnect Learners</h2>
                            <p className="initdesc">A continuous learning initiative focused on student upskilling via training sessions, technical talks, and hands-on workshops.</p>
                            <button type="button" className="esummitlink initbtn" onClick={handleEsummitClick}>Learn more</button>
                        </div>
                        <div className="initcard">
                             <article className="initimgcont">
                                <img src={sih} alt="Smart India Hackathon" loading="lazy"/>
                            </article>
                            <h2>Smart India Hackathon(SIH)</h2>
                            <p className="initdesc">A national-level hackathon where our team not only competes but also organizes internal hackathons and mentorship drives.</p>
                            <a className="esummitlink" href="https://sih.gov.in/" target="_blank" rel="noopener noreferrer">Learn more</a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default Homeinit