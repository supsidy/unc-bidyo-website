import { useBookingModal } from "../context/BookingModalContext";

export default function HeroBanner_VariationB() {
  const { openBooking } = useBookingModal();
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-bidyo-crimsonBlack via-bidyo-crimsonDeep to-bidyo-crimsonBlack px-8 pb-16 pt-28 lg:px-16 lg:py-0 xl:px-24">
      {/* ambient glow so the red doesn't read as a flat fill */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-bidyo-crimson/30 blur-[120px]" />

      {/* ---------- BACKGROUND ART — pinned to the right edge, never spanning under the
          headline column at any breakpoint. Hidden on phones (no room to keep it clear
          of the stacked text), then a narrowing band from sm up to a clean half-screen
          at lg, always fading in on its own left edge so it dissolves into the gradient. ---------- */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[70%] sm:block md:w-[62%] lg:w-1/2"
        style={{ animation: "heroFloat 9s ease-in-out infinite" }}
      >
        <img
          src="/images/hero/hero.png"
          alt=""
          role="presentation"
          className="h-full w-full object-cover mix-blend-lighten "
          style={{
            transform: "scale(1.15) translateX(-40px)",
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 22%, black 48%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 22%, black 48%)",
          }}
        />
      </div>

      {/* fade to the next section so the seam isn't a hard cut */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bidyo-crimsonBlack" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-12 xl:gap-16">
        {/* ---------- LEFT: TEXT ---------- */}
        <div className="flex flex-col items-start gap-6 lg:col-span-6 mt-12 lg:mt-24">
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white lg:text-5xl xl:text-6.5xl">
            Capturing the moments of every
          </h1>
          <h1
            className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-bidyo-crimson lg:text-6xl xl:text-7xl"
            style={{ WebkitTextStroke: "1.5px white" }}
          >
            UNCean.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-white/75 xl:text-lg">
            A vibrant organization and a home for aspiring photographers,
            videographers, editors, actors, directors, and creative minds at the
            University of Nueva Caceres. When the doors of creative opportunity
            close, we are here to open them. Welcome to BIDYO!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={openBooking}
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold uppercase tracking-[0.08em] text-bidyo-crimsonBlack shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 hover:text-white hover:shadow-xl"
            >
              Inquire Now
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
            <a
              href="#team"
              className="inline-flex h-14 items-center justify-center border-white/80 px-8 text-sm font-bold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:underline hover:underline-offset-4 "
            >
              Meet the Team
            </a>
          </div>
        </div>

        {/* ---------- RIGHT: spacer that keeps the copy clear of the background art on large screens
            (the art itself is the absolutely-positioned layer above, not a grid item) ---------- */}
        <div className="hidden lg:col-span-6 lg:block" aria-hidden="true" />
      </div>

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
