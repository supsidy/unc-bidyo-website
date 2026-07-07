import { useEffect, useState } from "react";
import highlights from "../data/highlights";

const BASE_INTERVAL_MS = 4800; // roughly how long each image holds
const JITTER_MS = 1400; // per-tile randomness so cadences drift apart
const CROSSFADE_MS = 1400; // slow, elegant fade — never a hard cut

function SlideshowTile({ images, title, className = "", startOffset = 0 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return undefined;

    // Each tile gets its own starting point (startOffset, spaced out by
    // the grid below) and its own cadence, chosen once at mount. That's
    // enough to keep 8 tiles from ever turning over in the same frame,
    // without needing to touch the interval on every tick.
    const cadence = BASE_INTERVAL_MS + Math.random() * JITTER_MS;
    let intervalId;

    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        setIndex((i) => (i + 1) % images.length);
      }, cadence);
    }, startOffset);

    return () => {
      clearTimeout(startTimer);
      clearInterval(intervalId);
    };
  }, [images.length, startOffset]);

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-bidyo-charcoal transition-transform duration-500 hover:scale-[1.02] ${className}`}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={title}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
        />
      ))}

      {/* Gradient scrim + label sit above every frame, unaffected by the crossfade beneath them */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <p className="pointer-events-none absolute inset-x-4 bottom-4 font-display text-sm uppercase tracking-wide text-white sm:text-base">
        {title}
      </p>
    </div>
  );
}

// Spans for the 8-tile bento pattern. The feature tile (index 0) keeps its
// 2x2 shape at every breakpoint. The rest of the bento — the tall and wide
// tiles — only switches on at `lg`, where these exact spans tile a
// 4-column x 4-row grid with zero gaps (verified: 4 + 1+2+1 + 2+2+2+2 = 16
// cells). Below `lg`, everything but the feature tile falls back to a
// plain 1x1 — except tile 8 (index 7), which spans 2 columns x 1 row on
// mobile/tablet, then reverts to its normal 1x2 shape at `lg`.
const TILE_SPANS = [
  "col-span-2 row-span-2",
  "",
  "lg:row-span-2",
  "",
  "lg:col-span-2",
  "lg:row-span-2",
  "lg:col-span-2",
  "col-span-2 lg:col-span-1 lg:row-span-2",
];

export default function HighlightsSection() {
  return (
    <section id="highlights" className="bg-bidyo-crimsonBlack px-6 pb-24 pt-4 lg:px-10 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-3xl tracking-widest text-white sm:text-4xl">
          HIGHLIGHTS
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-white/60">
          A look back at the moments we've covered across campus.
        </p>

        <div className="mt-12 grid grid-flow-dense grid-cols-2 auto-rows-[140px] gap-4 sm:grid-cols-3 sm:auto-rows-[160px] lg:grid-cols-4 lg:auto-rows-[190px] lg:gap-5">
          {highlights.map((highlight, i) => (
            <SlideshowTile
              key={highlight.id}
              images={highlight.images}
              title={highlight.title}
              className={TILE_SPANS[i] ?? ""}
              startOffset={i * 550}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
