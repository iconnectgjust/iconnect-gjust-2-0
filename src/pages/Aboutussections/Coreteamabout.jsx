import "./Coreteamabout.css";
import rahulKumar from "../../assets/rahulKumar.png";
import rashi from "../../assets/rashi.png";
import anshul from "../../assets/anshul.png";
import rahul from "../../assets/rahul.png";
import sagar from "../../assets/sagar.png";
import sanju from "../../assets/sanju.png";
import shreya from "../../assets/shreya.png";
import garima from "../../assets/garima.png";
import jatinJangra from "../../assets/jatinJangra.png";
import jatin from "../../assets/jatin.png";
import gautam from "../../assets/gautam.jpg";
import manvi from "../../assets/manvi.png";
import ankush from "../../assets/ankush.png";
import gourav from "../../assets/gaurav.png";
import priya from "../../assets/priya.png";
import lavanya from "../../assets/lavanya.png";
import akhil from "../../assets/akhil.png";
import grecika from "../../assets/grecika.png";

import "../../ScrollAnimation.css";
import useScrollAnimation from "../../ScrollAnimation";

const captains = [
  { img: rashi, name: "Rashi", role: "Captain", color: "card-red" },
  { img: rahulKumar, name: "Rahul Kumar", role: "Captain", color: "card-red" },
];

const heads = [
  { img: anshul, name: "Anshul Bhyan", role: "HR Head", color: "card-purple" },
  { img: rahul, name: "Rahul", role: "Innovation & Incubation Head", color: "card-purple" },
  { img: sagar, name: "Sagar", role: "IIC Head", color: "card-purple" },
];

const leads = [
  { img: sanju, name: "Sanju Singh", role: "Marketing Lead", color: "card-yellow" },
  { img: shreya, name: "Shreya Mittal", role: "Operation Lead", color: "card-yellow" },
  { img: garima, name: "Garima Verma", role: "Information System Lead", color: "card-yellow" },
];

const coordinators = [
  { img: jatinJangra, name: "Jatin Jangra", role: "Media Coordinator", color: "card-blue" },
  { img: jatin, name: "Jatin", role: "Infographics Coordinator", color: "card-blue" },
  { img: gautam, name: "Gautam", role: "Infographics Coordinator", color: "card-blue" },
  { img: manvi, name: "Manvi", role: "Content Writing Coordinator", color: "card-blue" },
  { img: ankush, name: "Ankush", role: "Executive & Hospitality Coordinator", color: "card-blue" },
  { img: gourav, name: "Gourav", role: "Logistics Coordinator", color: "card-blue" },
  { img: priya, name: "Priya Yadav", role: "Planning Coordinator", color: "card-blue" },
  { img: lavanya, name: "Lavanya", role: "Website Coordinator", color: "card-blue" },
  { img: akhil, name: "Akhil Sharma", role: "Data Coordinator", color: "card-blue" },
  { img: grecika, name: "Grecika", role: "Promotion Coordinator", color: "card-blue" },
];

function renderCard(member, index) {
  return (
    <div
      key={member.name + index}
      className={`smallcard ${member.color} reveal fade-up delay-1`}
    >
      <img src={member.img} alt="about section" loading="lazy" />
      <h2>{member.name}</h2>
      <p>{member.role}</p>
    </div>
  );
}

function Coreteamabout() {
  useScrollAnimation();

  return (
    <>
      <section className="whitesec">
        <h1 className="reveal fade-up">CORE TEAM</h1>

        <div className="teamrow">{captains.map(renderCard)}</div>
        <div className="teamrow">{heads.map(renderCard)}</div>
        <div className="teamrow">{leads.map(renderCard)}</div>

        <div className="teamgrid">{coordinators.map(renderCard)}</div>
      </section>
    </>
  );
}

export default Coreteamabout;