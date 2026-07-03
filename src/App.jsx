import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import AboutSection from "./components/AboutSection";
import OfferCarousel from "./components/OfferCarousel";
import TeamSection from "./components/TeamSection";
import HighlightsSection from "./components/HighlightsSection";
import Footer from "./components/Footer";
import BookingForm from "./components/BookingForm";
import { BookingModalProvider } from "./context/BookingModalContext";

export default function App() {
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
