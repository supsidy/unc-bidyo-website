import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import AboutSection from "./components/AboutSection";
import OfferCarousel from "./components/OfferCarousel";
import TeamSection from "./components/TeamSection";
import HighlightsSection from "./components/HighlightsSection";
import Footer from "./components/Footer";
import BookingForm from "./components/BookingForm";
import { BookingModalProvider } from "./context/BookingModalContext";
import FadeInSection from "./components/FadeInSection";

export default function App() {
  return (
    <BookingModalProvider>
      <div className="min-h-screen bg-gradient-to-b from-bidyo-crimsonBlack via-bidyo-crimsonBlack to-bidyo-crimsonBlack">
        <Navbar />
        {/* Hero stays as-is — it's the first thing visible on load, no need to fade it in on scroll */}
        <HeroBanner />
        <FadeInSection className="bg-bidyo-crimsonBlack">
          <AboutSection />
        </FadeInSection>
        <FadeInSection className="bg-bidyo-crimsonBlack">
          <OfferCarousel />
        </FadeInSection>
        <FadeInSection className="bg-bidyo-crimsonBlack">
          <TeamSection />
        </FadeInSection>
        <FadeInSection className="bg-bidyo-crimsonBlack">
          <HighlightsSection />
        </FadeInSection>
        <Footer />
      </div>

      {/* Rendered at the root so it can overlay the whole page regardless of scroll position */}
      <BookingForm />
    </BookingModalProvider>
  );
}
