import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AnnouncementBar.css";
import { fetchSettings } from "./lib/publicData";

function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem("announcement-dismissed") === "1"
  );

  useEffect(() => {
    fetchSettings().then((s) => setAnnouncement(s.announcement));
  }, []);

  const visible = announcement?.enabled && !dismissed;

  // Pushes the fixed navbar down while the bar is shown
  useEffect(() => {
    document.body.classList.toggle("has-announcement", !!visible);
    return () => document.body.classList.remove("has-announcement");
  }, [visible]);

  if (!visible) return null;

  const dismiss = () => {
    sessionStorage.setItem("announcement-dismissed", "1");
    setDismissed(true);
  };

  return (
    <div className="announcement-bar" role="status">
      <p>
        {announcement.text}
        {announcement.link && (
          <Link to={announcement.link} className="announcement-link">
            {announcement.linkText || "Learn more"} →
          </Link>
        )}
      </p>
      <button className="announcement-close" onClick={dismiss} aria-label="Dismiss announcement">
        <i className="bx bx-x"></i>
      </button>
    </div>
  );
}

export default AnnouncementBar;
