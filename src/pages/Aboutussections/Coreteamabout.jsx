import "./Coreteamabout.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeamCard from "../../TeamCard";
import { fetchTeamYears } from "../../lib/publicData";

import "../../ScrollAnimation.css";
import useScrollAnimation from "../../ScrollAnimation";

function Coreteamabout() {
  const [current, setCurrent] = useState(null);
  useScrollAnimation(current);

  useEffect(() => {
    fetchTeamYears().then((years) => {
      setCurrent(years.find((y) => y.current) || years[0] || null);
    });
  }, []);

  if (!current) return null;

  return (
    <>
      <section className="whitesec">
        <h1 className="reveal fade-up">CORE TEAM</h1>

        {current.groups.map((group) => (
          <div key={group.name}>
            <h2 className="groupheading reveal fade-up">{group.name}</h2>
            <div className={group.members.length <= 3 ? "teamrow" : "teamgrid"}>
              {group.members.map((m, i) => <TeamCard member={m} index={i} key={m.name + i} />)}
            </div>
          </div>
        ))}

        <div className="team-archive-cta reveal fade-up">
          <Link to="/team"><button><span>Team Archive →</span></button></Link>
        </div>
      </section>
    </>
  );
}

export default Coreteamabout;
