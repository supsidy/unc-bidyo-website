import { useState, useEffect, useRef, useCallback } from "react";

// ---- Tunables ----
const SLIDE_WIDTH_RATIO = 0.6;   // each slide's width as a fraction of the container
const GAP_PX = 32;               // space between slides
const SNAP_DURATION_MS = 700;    // eased snap animation when a drag/click settles on a slide
const AUTOPLAY_DELAY = 6000;     // ms between auto-advances
const DRAG_THRESHOLD_RATIO = 0.18; // fraction of a slide's width you must drag to trigger a slide change

export default function OfferCarousel() {
  const [offers, setOffers] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef(null);
  const dragStartXRef = useRef(0);
  const autoplayRef = useRef(null);

  // ---- Dynamically load slide data from src/data/offers.js ----
  useEffect(() => {
    let cancelled = false;

    import("../data/offers.js")
      .then((module) => {
        if (cancelled) return;
        setOffers(Array.isArray(module.default) ? module.default : []);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to load offers.js:", err);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Measure container width responsively (drives slide width) ----
  // Depends on `status`: the container only exists in the DOM once offers finish loading,
  // so this must re-run when status flips to "ready" — otherwise the observer would try
  // to attach to a ref that's still null and never get a second chance to attach.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [status]);

  const slideWidth = containerWidth * SLIDE_WIDTH_RATIO;
  const step = slideWidth + GAP_PX; // distance between two consecutive slides' resting positions

  const clampIndex = useCallback(
    (i) => Math.max(0, Math.min(offers.length - 1, i)),
    [offers.length]
  );

  const goTo = useCallback((i) => setIndex(clampIndex(i)), [clampIndex]);
  const goNext = useCallback(() => setIndex((i) => clampIndex(i + 1)), [clampIndex]);
  const goPrev = useCallback(() => setIndex((i) => clampIndex(i - 1)), [clampIndex]);

  // ---- Autoplay — wraps around, pauses on hover/drag/interaction ----
  useEffect(() => {
    if (status !== "ready" || isPaused || isDragging || offers.length === 0) return;

    autoplayRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % offers.length);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(autoplayRef.current);
  }, [status, isPaused, isDragging, offers.length, index]);

  // ---- Pointer drag — touch only. Desktop relies on arrow buttons/keyboard,
  // so mouse pointers are ignored here to avoid an unnatural click-drag feel.
  const handlePointerDown = (e) => {
    if (e.pointerType !== "touch") return;
    setIsDragging(true);
    setIsPaused(true);
    dragStartXRef.current = e.clientX;
    setDragDelta(0);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || e.pointerType !== "touch") return;
    e.preventDefault(); // stop native horizontal page/scroll panning from fighting the drag
    setDragDelta(e.clientX - dragStartXRef.current);
  };

  const releaseDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);

    const threshold = step * DRAG_THRESHOLD_RATIO;
    if (dragDelta > threshold) goPrev();
    else if (dragDelta < -threshold) goNext();

    setDragDelta(0);
  };

  // ---- Keyboard navigation ----
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  // Where the track sits at rest for the current index, centered in the container,
  // plus whatever the user is currently dragging.
  const baseTranslate = -(index * step) + (containerWidth - slideWidth) / 2;
  const trackTranslate = baseTranslate + dragDelta;

  const trackTransitionStyle = isDragging
    ? "none"
    : `transform ${SNAP_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;

  return (
    <section id="offer" className="relative overflow-hidden bg-gradient-to-br from-bidyo-crimsonBlack via-bidyo-crimsonDeep to-bidyo-crimsonBlack py-20 lg:py-28">
      {/* fade in from the previous section so the seam isn't a hard cut */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bidyo-crimsonBlack to-transparent" />
      {/* fade out to the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bidyo-crimsonBlack" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        {/* Heading */}
        <h2 className="text-center font-display text-3xl tracking-widest text-white sm:text-4xl">
          WHAT WE OFFER
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-sm text-white/60">
          The services that the organization provides. 
        </p>

        {status === "loading" && (
          <p className="mt-16 text-center text-sm text-white/50">Loading services…</p>
        )}

        {status === "error" && (
          <p className="mt-16 text-center text-sm text-red-400">
            Couldn't load our services right now. Please refresh the page.
          </p>
        )}

        {status === "ready" && offers.length > 0 && (
          <>
            <div
              ref={containerRef}
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label="Our services"
              onKeyDown={handleKeyDown}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => {
                setIsPaused(false);
                releaseDrag();
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={releaseDrag}
              onPointerLeave={releaseDrag}
              className="relative mt-16 select-none outline-none"
              style={{ touchAction: "pan-y" }}
            >
              {/* Screen-reader live announcement */}
              <p className="sr-only" aria-live="polite">
                Showing {offers[index]?.title}, slide {index + 1} of {offers.length}
              </p>

              {/* Track */}
              <div
                className="flex"
                style={{
                  gap: `${GAP_PX}px`,
                  transform: `translateX(${trackTranslate}px)`,
                  transition: trackTransitionStyle,
                }}
              >
                {offers.map((offer, i) => {
                  const isActive = i === index;

                  return (
                    <div
                      key={offer.id}
                      role="button"
                      tabIndex={-1}
                      aria-label={`View ${offer.title}`}
                      aria-current={isActive}
                      onClick={() => {
                        if (!isDragging && !isActive) goTo(i);
                      }}
                      className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-3xl bg-bidyo-charcoal"
                      style={{ width: slideWidth || "60%" }}
                    >
                      {/* Background image — moves together with the card, no separate parallax offset */}
                      <img
                        src={offer.image}
                        alt={offer.title}
                        draggable={false}
                        loading="lazy"
                        className="pointer-events-none absolute inset-y-0 left-1/2 h-full w-[145%] max-w-none -translate-x-1/2 scale-[1.02] object-cover"
                        style={{
                          filter: isActive ? "none" : "brightness(0.55)",
                        }}
                      />

                      {/* Gradient scrim */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                      {/* Label */}
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 p-6"
                        style={{
                          opacity: isActive ? 1 : 0.5,
                          transform: isActive ? "translateY(0)" : "translateY(6px)",
                          transition: "opacity 500ms ease, transform 500ms ease",
                        }}
                      >
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                          Service
                        </p>
                        <p className="mt-1 font-display text-2xl uppercase tracking-wide text-white">
                          {offer.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Left arrow */}
              <button
                type="button"
                onClick={goPrev}
                disabled={index === 0}
                aria-label="Previous offer"
                className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 h-12 w-12 place-items-center rounded-full bg-black/40 text-white text-xl backdrop-blur-sm transition-all duration-300 hover:bg-black/70 hover:scale-110 disabled:pointer-events-none disabled:opacity-30 sm:left-6 sm:grid"
              >
                ‹
              </button>

              {/* Right arrow */}
              <button
                type="button"
                onClick={goNext}
                disabled={index === offers.length - 1}
                aria-label="Next offer"
                className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 h-12 w-12 place-items-center rounded-full bg-black/40 text-white text-xl backdrop-blur-sm transition-all duration-300 hover:bg-black/70 hover:scale-110 disabled:pointer-events-none disabled:opacity-30 sm:right-6 sm:grid"
              >
                ›
              </button>
            </div>

            {/* Dot indicators */}
            <div className="mt-8 flex justify-center gap-2">
              {offers.map((offer, i) => (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => {
                    goTo(i);
                    setIsPaused(true);
                  }}
                  aria-label={`Go to ${offer.title}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === index ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
