import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./Navbar";
import HomeFront from "./HomeFront";
import Homeabout from "./Homeabout";
import Homeinit from "./Homeinit";
import Homegallery from "./Homegallery";
import Hometouch from "./Hometouch";
import Homefooter from "./Homefooter";
import NotFound from "./NotFound";
import Preloader from "./Preloader";
import ScrollExtras from "./ScrollExtras";
import Seo from "./Seo";
import AnnouncementBar from "./AnnouncementBar";
import FiveIs from "./FiveIs";
import WhyJoin from "./WhyJoin";

// Route-based code splitting: standalone pages load as separate chunks
const AboutusPage = lazy(() => import('./pages/Aboutus'));
const SeedFundingPage = lazy(() => import('./pages/SeedFunding'));
const TeamPage = lazy(() => import('./pages/Team'));
const AlumniPage = lazy(() => import('./pages/Alumni'));
const AlumniProfilePage = lazy(() => import('./pages/AlumniProfile'));
const PduiicPage = lazy(() => import('./pages/Pduiic'));
const ContactPage = lazy(() => import('./pages/Contact'));
const GalleryPage = lazy(() => import('./pages/Gallery'));
const AdminPage = lazy(() => import('./admin/AdminPage'));

const routeFallback = (
  <div style={{
    minHeight: "100vh",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
    fontFamily: '"Roboto", sans-serif',
  }}>
    Loading…
  </div>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/" ) {
      // Scroll to top when a standalone page is loaded
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (location.hash) {
      // Scroll to section if hash exists (e.g. /#gallery)
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Delay to ensure the DOM is fully rendered
      }
    }
  }, [location]);

  return (
    <>
      <Preloader />
      <ScrollExtras />
      <Suspense fallback={routeFallback}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Seo
                  title="Team iConnect | Innovation & Incubation — PDUIIC, GJUS&T Hisar"
                  description="Team iConnect is the student innovation team at PDUIIC, GJUS&T Hisar — organizing Konark Techfest, E-Summit, Seed Funding, Pitch Point and Smart India Hackathon. 56+ events, 25,000+ footfalls, 1M+ impressions."
                  path="/"
                />
                <AnnouncementBar />
                <Navbar />
                <HomeFront />
                <Homeabout />
                <FiveIs />
                <Homeinit />
                <Homegallery />
                <WhyJoin />
                <Hometouch />
                <Homefooter />
              </>
            }
          />
          <Route path="/about" element={
            <>
              <Seo
                title="About Us | Team iConnect — Core Team, Mentors & PDUIIC, GJUS&T Hisar"
                description="Meet Team iConnect — the captains, heads, leads and coordinators running the Pandit Deendayal Upadhyay Innovation & Incubation Centre (PDUIIC) at GJUS&T Hisar, guided by faculty mentors and an advisory panel."
                path="/about"
              />
              <Navbar />
              <AboutusPage />
            </>
          } />
          <Route path="/seedfunding" element={
            <>
              <Seo
                title="Seed Funding 2026 | Up to ₹1.5 Lakh for Student Innovators — iConnect GJUS&T"
                description="Seed Funding Opportunity 2026 at GJUS&T Hisar: grants, mentorship, workspace and institutional support to turn student ideas into startups. Eligibility, guidelines, timeline, FAQs and updates."
                path="/seedfunding"
              />
              <SeedFundingPage />
            </>
          } />
          <Route path="/team" element={<><Navbar /><TeamPage /><Homefooter /></>} />
          <Route path="/team/:param" element={<><Navbar /><TeamPage /><Homefooter /></>} />
          <Route path="/alumni" element={<><Navbar /><AlumniPage /><Homefooter /></>} />
          <Route path="/alumni/:slug" element={<><Navbar /><AlumniProfilePage /><Homefooter /></>} />
          <Route path="/pduiic" element={<><Navbar /><PduiicPage /></>} />
          <Route path="/contact" element={<><Navbar /><ContactPage /></>} />
          <Route path="/gallery" element={<><Navbar /><GalleryPage /></>} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;