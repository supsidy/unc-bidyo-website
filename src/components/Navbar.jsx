import { useBookingModal } from "../context/BookingModalContext";

export default function Navbar() {
  const { openBooking } = useBookingModal();

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <img
            src="/images/bidyo.png"
            alt="UNC BIDYO logo"
            className="h-14 w-14 shrink-0 rounded-full object-cover sm:h-16 sm:w-16"
          />
          <span className="font-display text-lg tracking-tight text-bidyo-crimsonBlack">
            UNC BIDYO
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-neutral-700 md:flex">
          <a href="#about" className="transition hover:text-bidyo-crimson">About</a>
          <a href="#offer" className="transition hover:text-bidyo-crimson">What We Offer</a>
          <a href="#highlights" className="transition hover:text-bidyo-crimson">Highlights</a>
        </nav>

        <button
          type="button"
          onClick={openBooking}
          className="rounded-full bg-bidyo-crimsonBlack px-5 py-2 text-sm font-bold text-white transition hover:bg-bidyo-crimson"
        >
          Inquire Now
        </button>
      </div>
    </header>
  );
}
