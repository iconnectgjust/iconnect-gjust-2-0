import "./Manageaboutus.css";
import vishal from "../../assets/vishalgulati.png";
import munish from "../../assets/munishgupta.png";
import vimal from "../../assets/vvimal.jpeg";
import mani from "../../assets/manishrestha.jpeg";
import abhimanyu from "../../assets/abhimanyunain.jpeg";
import sumitsaroha from "../../assets/sumitsaroha.png";
import sunil from "../../assets/ssunil.jpeg";
import rajendar from "../../assets/rajenderr.jpeg";
import bijender from "../../assets/bijenderkaushik.png";
import vijay from "../../assets/vvijay.jpeg";
import narender from "../../assets/narender.jpeg";
import sahil from "../../assets/sahilkaushik.png";
import sumit from "../../assets/sumit.jpeg";

import "../../ScrollAnimation.css";
import useScrollAnimation from "../../ScrollAnimation";

const bigMember = {
  img: vishal,
  name: "Prof. Vishal Gulati",
  role: "Director PDUIIC",
  color: "card-red",
};

const directors = [
  { img: munish, name: "Prof. Munish Gupta", role: "Additional Director PDUIIC", color: "card-purple" },
  { img: vimal, name: "Sh. Vimal K Jha", role: "Deputy Director & P.O.P PDUIIC", color: "card-purple" },
  { img: mani, name: "Dr. Mani Shrestha", role: "Deputy Director PDUIIC", color: "card-purple" },
  { img: abhimanyu, name: "Dr. Abhimanyu Nain", role: "Deputy Director PDUIIC", color: "card-purple" },
];

const pduiicCoordinators = [
  { img: sumitsaroha, name: "Dr. Sumit Saroha", role: "Coordinator PDUIIC", color: "card-yellow" },
  { img: sunil, name: "Dr. Sunil Kumar", role: "Coordinator PDUIIC", color: "card-yellow" },
  { img: rajendar, name: "Dr. Rajender Singh", role: "Coordinator PDUIIC", color: "card-yellow" },
  { img: bijender, name: "Dr. Bijender Kaushik", role: "Coordinator PDUIIC", color: "card-yellow" },
];

const ideaLabCoordinators = [
  { img: vijay, name: "Dr. Vijay Pal Singh", role: "Coordinator Idea Lab", color: "card-green" },
  { img: narender, name: "Dr. Narender Kumar", role: "Coordinator Idea Lab", color: "card-green" },
  { img: sahil, name: "Dr. Sahil Kaushik", role: "Coordinator Idea Lab", color: "card-green" },
  { img: sumit, name: "Dr. Sumit Sharma", role: "Coordinator Idea Lab", color: "card-green" },
];

function renderCard(member, index) {
   useScrollAnimation();

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

function Manageaboutus() {
  useScrollAnimation();

  return (
    <>
      <section className="whitesec">
        <h1 className="reveal fade-up">FACULTY</h1>

        <div className="bigcardrow">
          <div className={`bigcard ${bigMember.color} reveal fade-up delay-1`}>
            <img src={bigMember.img} alt="about section" loading="lazy" />
            <h2>{bigMember.name}</h2>
            <p>{bigMember.role}</p>
          </div>
        </div>

        <div className="teamrow">{directors.map(renderCard)}</div>
        <div className="teamrow">{pduiicCoordinators.map(renderCard)}</div>
        <div className="teamrow">{ideaLabCoordinators.map(renderCard)}</div>
      </section>
    </>
  );
}

export default Manageaboutus
