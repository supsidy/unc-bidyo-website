import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import AboutSection from "./components/AboutSection";
import OfferCarousel from "./components/OfferCarousel";
import TeamSection from "./components/TeamSection";
import HighlightsSection from "./components/HighlightsSection";
import Footer from "./components/Footer";
import BookingForm from "./components/BookingForm";
import { BookingModalProvider } from "./context/BookingModalContext";
import Preloader from "./components/Preloader"; // NEW

// 1. Import your Admin Portal Controller
import AdminPortal from "./pages/AdminPortal.jsx";

export default function App() {
  // Keep track of the URL pathname in state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // NEW: whether the hero image has finished preloading
  const [siteReady, setSiteReady] = useState(false);

  // Listen to browser forward/backward navigation changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // 2. Intercept: If the URL is '/admin', render the secure portal instead
  if (currentPath === "/admin") {
    return <AdminPortal />;
  }

  // 3. Public Website: Render your original landing page
  return (
    <BookingModalProvider>
      {!siteReady && <Preloader onDone={() => setSiteReady(true)} />}

      <div className="min-h-screen bg-gradient-to-b from-bidyo-crimson via-bidyo-crimsonDeep to-bidyo-crimsonBlack">
        <Navbar />
        <HeroBanner />
        <AboutSection />
        <OfferCarousel />
        <TeamSection />
        <HighlightsSection />
        <Footer />
      </div>

      {/* Rendered at the root so it can overlay the whole page regardless of scroll position */}
      <BookingForm />
    </BookingModalProvider>
  );
}
