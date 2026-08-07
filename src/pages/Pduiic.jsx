import { Link } from "react-router-dom";
import "./Pduiic.css";
import Seo from "../Seo";
import Homefooter from "../Homefooter";
import { assetUrl } from "../assetMap";
import useScrollAnimation from "../ScrollAnimation";
import "../ScrollAnimation.css";

const keyFacts = [
  { icon: "bx-calendar-check", label: "Established", value: "2018" },
  { icon: "bx-rocket", label: "Digitally launched by", value: "Hon'ble PM Sh. Narendra Modi — 3 Feb 2019" },
  { icon: "bx-building-house", label: "Under the scheme", value: "RUSA 2.0, MHRD, Govt. of India" },
  { icon: "bx-rupee", label: "Budget outlay", value: "₹15 Crores" },
];

const objectives = [
  "Develop a critical mass of motivated students & faculties with entrepreneurial orientation & skills.",
  "Build infrastructure support for innovation and early-stage enterprise development, enabling access to resources and facilities at the university.",
  "Enhance in-house competency development to serve potential and early-stage entrepreneurs and student innovators at the university.",
  "Strengthen inter-departmental, inter-institutional and industrial linkage, incubators and other ecosystems at different levels to improve employability.",
  "Develop overseas collaborations with top-ranked institutions of the world to provide global exposure and mentoring by international faculty and innovators.",
];

const thematicAreas = [
  "Agricultural Sciences", "Business Management", "Engineering", "AI, IoT & Robotics",
  "Life Sciences", "Pharmaceutical Sciences", "Physical Sciences", "Medical Sciences", "Yoga Sciences",
];

const facilities = [
  { icon: "bx-bulb", title: "Idea Lab", desc: "A dedicated space to prototype, tinker and test — with faculty coordinators guiding hands-on building." },
  { icon: "bx-rupee", title: "Seed Funding", desc: "Grants of up to ₹1.5 lakh for student innovators, with guided fund utilization and milestone reviews." },
  { icon: "bx-user-voice", title: "Mentorship", desc: "Faculty and industry mentors matched to your project — from first idea to incorporation, backed by MoUs with industry experts." },
  { icon: "bx-buildings", title: "Workspace & ICT", desc: "Working space, laboratories, workshop facilities, consumables and ICT infrastructure inside the GJUS&T campus." },
  { icon: "bx-chip", title: "Emerging-Tech Labs", desc: "Labs coming up in AI/ML, IoT, Additive Manufacturing, Data Analytics, Robotics and Prototyping." },
  { icon: "bx-link-alt", title: "Ecosystem Connect", desc: "Bridges to incubators, government schemes and industry — supporting internal projects, collaborations and external startups alike." },
];

function Pduiic() {
  useScrollAnimation();
  const buildingImg = assetUrl("pduiic.jpeg") || assetUrl("aboutimg.jpeg");

  return (
    <div className="pduiicpage">
      <Seo
        title="PDUIIC | Pandit Deendayal Upadhyaya Innovation & Incubation Centre — GJUS&T Hisar"
        description="PDUIIC at GJUS&T Hisar — established 2018, digitally launched by PM Narendra Modi under RUSA 2.0 with a ₹15 crore outlay. Idea Lab, seed funding, mentorship, workspace and labs for student innovators in Haryana."
        path="/pduiic"
      />

      <header className="pduiicpage-hero">
        <h1>PDUIIC</h1>
        <p className="pduiicpage-full">Pandit Deendayal Upadhyaya Innovation & Incubation Centre</p>
        <p className="pduiicpage-tag">The innovation engine of GJUS&T, Hisar — and the home of Team iConnect.</p>
      </header>

      <section className="pduiicpage-facts">
        {keyFacts.map((f) => (
          <div className="pduiicpage-fact reveal fade-up" key={f.label}>
            <i className={`bx ${f.icon}`}></i>
            <span className="pduiicpage-factlabel">{f.label}</span>
            <span className="pduiicpage-factvalue">{f.value}</span>
          </div>
        ))}
      </section>

      <section className="pduiicpage-about">
        <div className="pduiicpage-aboutimg reveal fade-up">
          <img src={buildingImg} alt="PDUIIC building at GJUS&T Hisar" loading="lazy" />
        </div>
        <div className="pduiicpage-abouttext reveal fade-up">
          <h2>About the Centre</h2>
          <p>
            Pandit Deendayal Upadhyaya Innovation &amp; Incubation Centre (PDUIIC) was established at
            Guru Jambheshwar University of Science &amp; Technology, Hisar, Haryana in 2018, and was
            formally digitally launched by the Hon&apos;ble Prime Minister Sh. Narendra Modi Ji on
            3rd February 2019 from Sher-e-Kashmir International Convention Centre, Srinagar — under
            the RUSA 2.0 scheme of MHRD, Government of India, simultaneously across twenty-six states,
            one union territory and fifty-one aspirational districts, with a budget outlay of fifteen crores.
          </p>
          <p>
            PDUIIC aims to become the hub of innovation and startup activity in Haryana, working towards
            the vision of <strong>&quot;Make in India&quot;</strong>. It walks with young innovators from
            conceiving an idea to technological development — coordinating and promoting incubation-driven
            activities for budding entrepreneurs and strengthening startups in thematic areas of national concern.
          </p>
          <p>
            The centre shares its resources — space and infrastructure, business support services, mentoring,
            training programs and seed funds. Its support is broad-based: technologies developed wholly at the
            institute, collaborations elsewhere, and external startups where members contribute as consultants or mentors.
          </p>
        </div>
      </section>

      <section className="pduiicpage-objectives">
        <h2 className="reveal fade-up">Objectives</h2>
        <ol className="pduiicpage-objlist">
          {objectives.map((o, idx) => (
            <li className="reveal fade-up" key={idx}>
              <span className="pduiicpage-objnum">{String(idx + 1).padStart(2, "0")}</span>
              <p>{o}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pduiicpage-thematic reveal fade-up">
        <h2>Thematic Areas</h2>
        <p className="pduiicpage-thematicsub">
          Innovative project ideas are invited for prototypes, startups, novel hand-held and
          point-of-care devices, and entrepreneurship — from individuals or groups of national
          and international repute, in:
        </p>
        <div className="pduiicpage-chips">
          {thematicAreas.map((t) => (
            <span className="pduiicpage-chip" key={t}>{t}</span>
          ))}
        </div>
      </section>

      <section className="pduiicpage-director">
        <h2 className="reveal fade-up">Director&apos;s Message</h2>
        <div className="pduiicpage-directorcard reveal fade-up">
          <i className="bx bxs-quote-alt-left pduiicpage-quote"></i>
          <p>
            PDUIIC serves as a platform for students, engineers, young innovators, entrepreneurs and
            faculty members for incubating novel ideas — helping them produce novel products through
            expert guidance of mentors and tie-ups with industry experts. MoUs have been signed with
            industry experts for developing AI &amp; IoT based products and for real-time and virtual
            training programs in Robotics.
          </p>
          <p>
            The centre offers infrastructure and ICT facilities, consumables, laboratory working space
            and workshop facilities, and is establishing labs in AI/ML, IoT, Additive Manufacturing,
            Data Analytics, Robotics and Prototyping. A <strong>&quot;Skill and Innovation Lab&quot;</strong> course
            has been started in every UG/PG program to sensitize students towards skill and innovation —
            identifying research areas, working as a team, learning by doing, and proposing novel ideas.
          </p>
          <p>
            I anticipate all faculty members of GJUS&amp;T, Hisar to motivate young students of the
            university to participate and incubate novel ideas through projects — with outcomes focused
            on product development of societal relevance, moving towards commercialization, startups
            and entrepreneurship.
          </p>
          <span className="pduiicpage-directorsign">— Director, PDUIIC</span>
        </div>
      </section>

      <section className="pduiicpage-facilities">
        <h2 className="reveal fade-up">What a student walks in and gets</h2>
        <div className="pduiicpage-grid">
          {facilities.map((f, idx) => (
            <div className={`pduiicpage-card reveal fade-up delay-${(idx % 3) + 1}`} key={f.title}>
              <i className={`bx ${f.icon}`}></i>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pduiicpage-cta reveal fade-up">
        <h2>Have an idea worth backing?</h2>
        <p>The Seed Funding Opportunity is the front door to the centre.</p>
        <div className="pduiicpage-ctarow">
          <Link to="/seedfunding" className="pduiicpage-btn">Explore Seed Funding</Link>
          <Link to="/contact" className="pduiicpage-btn pduiicpage-btn-outline">Talk to us</Link>
        </div>
      </section>

      <Homefooter />
    </div>
  );
}

export default Pduiic;
