import { useRef } from "react";
import team from "../data/team";

export default function TeamSection() {
  const trackRef = useRef(null);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-team-card]");
    const cardWidth = card ? card.offsetWidth + 40 /* gap-10 */ : 280;
    track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <section id="team" className="px-6 pb-24 pt-4 lg:px-10 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-3xl tracking-widest text-white sm:text-4xl py-4">
          MEET THE TEAM
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-white/60">
          The people behind every shot, edit, and event UNC BIDYO covers.
        </p>

        {/* Stage */}
        <div className="relative mt-12">
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous team member"
            className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white text-xl backdrop-blur-sm transition-all duration-300 hover:bg-black/70 hover:scale-110 sm:-left-14 lg:-left-20"
          >
            ‹
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next team member"
            className="absolute -right-4 top-1/2 z-20 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white text-xl backdrop-blur-sm transition-all duration-300 hover:bg-black/70 hover:scale-110 sm:-right-14 lg:-right-20"
          >
            ›
          </button>

          {/* Track — horizontal scroll-snap carousel */}
          <div
            ref={trackRef}
            className="flex gap-10 overflow-x-auto overflow-y-visible scroll-smooth px-1 py-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {team.map((member) => (
              <div
                key={member.id}
                data-team-card
                className="group relative shrink-0 snap-start"
                style={{ width: "clamp(180px, 22vw, 240px)" }}
              >
                {/* Photo frame — its own positioning context, separate from the name box below,
                    so the image anchors to the PHOTO's bottom, not the whole card's bottom. */}
                <div className="relative">
                  {/* Colored backdrop — stays fixed size, clips to rounded corners */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-bidyo-crimson/40 to-bidyo-crimsonBlack">
                    {/* Rotated role label along the right edge */}
                    <span
                      className="pointer-events-none absolute bottom-4 right-3 z-10 text-xs font-bold uppercase tracking-[0.3em] text-white/70"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {member.role}
                    </span>
                  </div>

                  {/* PNG cutout — NOT clipped, layered above the backdrop, free to overflow on hover.
                      Requires a transparent-background PNG so only the silhouette pops out.
                      Width is locked to the card so it stays centered/aligned; scale (anchored
                      at the bottom) handles the pop-out growth instead of an unconstrained height. */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-20 w-full scale-125 origin-bottom object-contain object-bottom transition-transform duration-500 ease-out group-hover:z-30 group-hover:scale-150"
                  />
                </div>

                {/* Name card */}
                <div className="relative z-0 mt-4 rounded-2xl bg-bidyo-charcoal/80 px-4 py-3 transition-colors duration-300 group-hover:bg-bidyo-charcoal">
                  <p className="font-display text-sm uppercase tracking-wide text-white">
                    {member.name}
                  </p>
                  <p className="mt-1 text-xs text-white/50">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
