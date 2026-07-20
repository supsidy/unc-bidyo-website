import { useState, useEffect } from "react";
import Navbar from "./components/Navbar"; //[cite: 2]
import HeroBanner from "./components/HeroBanner"; //[cite: 2]
import AboutSection from "./components/AboutSection"; //[cite: 2]
import OfferCarousel from "./components/OfferCarousel"; //[cite: 2]
import TeamSection from "./components/TeamSection"; //[cite: 2]
import HighlightsSection from "./components/HighlightsSection"; //[cite: 2]
import Footer from "./components/Footer"; //[cite: 2]
import BookingForm from "./components/BookingForm"; //[cite: 2]
import { BookingModalProvider } from "./context/BookingModalContext"; //[cite: 2]

// 1. Import your Admin Portal Controller
import AdminPortal from "./pages/AdminPortal.jsx"; //[cite: 2]

export default function App() {
  // Keep track of the URL pathname in state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

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

  // 3. Public Website: Render your original landing page[cite: 2]
  return (
    <BookingModalProvider>
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