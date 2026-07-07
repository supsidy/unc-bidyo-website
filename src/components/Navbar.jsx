import { useState, useEffect } from "react";
import { useBookingModal } from "../context/BookingModalContext";

export default function Navbar() {
  const { openBooking } = useBookingModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Main bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0">
            <img
              src="/images/bidyo-white.png"
              alt="UNC BIDYO logo"
              className={`absolute inset-0 h-14 w-14 rounded-full object-cover transition-opacity duration-300 ${
                scrolled ? "opacity-0" : "opacity-100"
              }`}
            />
            <img
              src="/images/bidyo.png"
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-14 w-14 rounded-full object-cover transition-opacity duration-300 ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <span
            className={`font-display text-base font-bold tracking-tight transition-colors duration-300 ${
              scrolled ? "text-bidyo-crimsonBlack" : "text-white"
            }`}
          >
            UNC BIDYO
          </span>
        </div>

        {/* Desktop nav */}
        <nav
          className={`hidden items-center gap-8 text-sm font-bold md:flex transition-colors duration-300 ${
            scrolled ? "text-neutral-600" : "text-white/85"
          }`}
        >
          <a href="#about" className="transition hover:text-bidyo-crimson">About</a>
          <a href="#offer" className="transition hover:text-bidyo-crimson">What We Offer</a>
          <a href="#highlights" className="transition hover:text-bidyo-crimson">Highlights</a>
        </nav>

        {/* Desktop CTA */}
        <button
          type="button"
          onClick={openBooking}
          className={`hidden md:inline-flex rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
            scrolled
              ? "bg-bidyo-crimsonBlack text-white hover:bg-bidyo-crimson"
              : "border border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          }`}
        >
          Inquire Now
        </button>

        {/* Mobile hamburger — animated to ✕ when open, color swaps with scroll state */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="relative md:hidden flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
        >
          <span
            className={`block h-[2px] w-6 rounded-full origin-center transition-all duration-300 ${
              scrolled ? "bg-bidyo-crimsonBlack" : "bg-white"
            } ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${
              scrolled ? "bg-bidyo-crimsonBlack" : "bg-white"
            } ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
          />
          <span
            className={`block h-[2px] w-6 rounded-full origin-center transition-all duration-300 ${
              scrolled ? "bg-bidyo-crimsonBlack" : "bg-white"
            } ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile dropdown — stays solid white regardless of scroll state, it's an overlay panel */}
      <div
        className={`md:hidden overflow-hidden bg-white transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-72 border-t border-neutral-100 shadow-sm" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 bg-white px-6 py-4">
          <a href="#about"
            onClick={closeMenu}
            className="rounded-xl px-3 py-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 hover:text-bidyo-crimson">
            About
          </a>
          <a href="#offer"
            onClick={closeMenu}
            className="rounded-xl px-3 py-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 hover:text-bidyo-crimson">
            What We Offer
          </a>
          <a href="#highlights"
            onClick={closeMenu}
            className="rounded-xl px-3 py-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 hover:text-bidyo-crimson">
            Highlights
          </a>
          <button
            type="button"
            onClick={() => { openBooking(); closeMenu(); }}
            className="mt-2 w-full rounded-full bg-bidyo-crimsonBlack py-3 text-sm font-bold text-white transition hover:bg-bidyo-crimson"
          >
            Inquire Now
          </button>
        </nav>
      </div>

    </header>
  );
}
