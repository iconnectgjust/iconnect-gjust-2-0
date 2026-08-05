import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Team.css";
import "./Aboutussections/Coreteamabout.css";
import TeamCard from "../TeamCard";
import TeamInfo from "./TeamInfo";
import Seo from "../Seo";
import { fetchTeamYears } from "../lib/publicData";
import useScrollAnimation from "../ScrollAnimation";
import "../ScrollAnimation.css";

function Team() {
  const { param } = useParams();
  const navigate = useNavigate();
  const [years, setYears] = useState([]);

  // Re-run the reveal/observer setup whenever the visible view changes —
  // not just once when `years` first loads. Team never unmounts when
  // swapping between the archive grid and a member's TeamInfo (they're
  // rendered conditionally from the same component instance), so without
  // `param` in here the old observer keeps watching detached DOM nodes
  // and newly-rendered `.reveal` cards on "Back to Archive" never get
  // revealed until a hard reload remounts everything.
  useScrollAnimation([years, param]);

  useEffect(() => { fetchTeamYears().then(setYears); }, []);

  if (!years.length) {
    return <div className="teampage"><header className="teampage-hero"><h1>TEAM ARCHIVE</h1><p>Loading…</p></header></div>;
  }

  // /team/:param serves two things off one route: a year ("/team/2024")
  // shows that year's archive, anything else ("/team/riyansh") is treated
  // as a member's slug and shows their profile card instead.
  const yearMatch = param ? years.find((y) => String(y.year) === param) : null;

  if (param && !yearMatch) {
    return <TeamInfo slug={param} />;
  }

  const selected = yearMatch || years.find((y) => y.current) || years[0];

  return (
    <div className="teampage">
      <Seo
        title={`Team ${selected.year} | Team iConnect — GJUS&T Hisar`}
        description={`The iConnect core team of ${selected.year} at PDUIIC, GJUS&T Hisar — browse every batch in the team archive.`}
        path={`/team/${selected.year}`}
      />

      <header className="teampage-hero">
        <h1>TEAM ARCHIVE</h1>
        <p>Every batch that carried iConnect forward — preserved, year by year.</p>
        <div className="teampage-years">
          {years.map((y) => (
            <button
              key={y.year}
              className={`teampage-yearchip ${y.year === selected.year ? "teampage-yearchip-active" : ""}`}
              onClick={() => navigate(`/team/${y.year}`)}
            >
              {y.year}{y.current ? " · Current" : ""}
            </button>
          ))}
        </div>
      </header>

      <section className="whitesec teampage-body">
        {selected.groups.map((group) => (
          <div key={group.name}>
            <h2 className="teampage-group reveal fade-up">{group.name}</h2>
            <div className="teamgrid">
              {group.members.map((m, i) => (
                <TeamCard member={m} index={i} key={m.name + i} />
              ))}
            </div>
          </div>
        ))}
        <p className="teampage-note">
          A new batch is added here every year — alumni never disappear from iConnect&apos;s history.
        </p>
      </section>
    </div>
  );
}

export default Team;