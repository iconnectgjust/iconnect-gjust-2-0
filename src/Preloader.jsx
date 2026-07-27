import { useEffect, useState } from "react";
import "./Preloader.css";
import logo from "./assets/iconlogo.png";

const SPIN_MS = 1100;
const FADE_MS = 500;

function Preloader() {
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.classList.add("preloading");
    const fadeTimer = setTimeout(() => setFading(true), SPIN_MS);
    const doneTimer = setTimeout(() => {
      setDone(true);
      document.body.classList.remove("preloading");
    }, SPIN_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      document.body.classList.remove("preloading");
    };
  }, []);

  if (done) return null;

  return (
    <div className={`preloader ${fading ? "preloader-hide" : ""}`} aria-hidden="true">
      <img src={logo} alt="" className="preloader-logo" />
      <div className="preloader-ring"></div>
    </div>
  );
}

export default Preloader;
