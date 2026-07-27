import { Link } from "react-router-dom";
import Seo from "./Seo";
import logo from "./assets/iconlogo.png";

function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "24px",
      fontFamily: '"Roboto", sans-serif',
    }}>
      <Seo
        title="Page Not Found | Team iConnect — GJUS&T Hisar"
        description="The page you are looking for does not exist on the iConnect website."
        path="/404"
        noindex
      />
      <img src={logo} alt="iConnect logo" style={{ width: "90px", marginBottom: "24px" }} />
      <h1 style={{
        fontSize: "clamp(3rem, 10vw, 6rem)",
        background: "linear-gradient(90deg, #ff0055, #ff9900, #00cc88, #0099ff, #8428f1)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        marginBottom: "12px",
      }}>404</h1>
      <p style={{ fontSize: "1.2rem", color: "#bbb", marginBottom: "32px" }}>
        Oops — this page wandered off to ideate. It does not exist.
      </p>
      <Link to="/" style={{
        padding: "14px 34px",
        borderRadius: "40px",
        border: "1px solid #fff",
        color: "#fff",
        textDecoration: "none",
        fontSize: "1.05rem",
      }}>
        ← Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
