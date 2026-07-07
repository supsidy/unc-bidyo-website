
export default function HeroBanner_VariationB() {
  return (
    <section
      className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-bidyo-crimsonBlack via-bidyo-crimsonDeep to-bidyo-crimsonBlack px-8 lg:px-16 xl:px-24"
    >
      {/* ambient glow so the red doesn't read as a flat fill */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-bidyo-crimson/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-bidyo-crimson/20 blur-[120px]" />

      {/* fade to the next section so the seam isn't a hard cut */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bidyo-crimsonBlack" />

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-12 xl:gap-16">
        {/* ---------- LEFT: TEXT ---------- */}
        <div className="flex flex-col items-start gap-6 py-16 lg:col-span-6 lg:py-0">
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white lg:text-6xl xl:text-7xl">
            We show up so your moment doesn&rsquo;t get missed.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-white/75 xl:text-xl">
            A student-run crew of shooters and editors covering every UNC
            org event, from first pitch to final bow — so you can be
            present instead of holding a phone up.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#inquire"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold uppercase tracking-[0.08em] text-bidyo-crimsonBlack shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 hover:text-white hover:shadow-xl"
            >
              Inquire Now
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#team"
              className="inline-flex h-14 items-center justify-center rounded-full border-2 border-white/80 px-8 text-sm font-bold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
            >
              Meet the Team
            </a>
          </div>
        </div>

        {/* ---------- RIGHT: VISUAL ---------- */}
        <div className="flex items-center justify-center py-10 lg:col-span-6 lg:py-0">
          <div className="relative w-full max-w-[560px]">
            {/* abstract fluid blobs behind the portrait */}
            <svg
              viewBox="0 0 500 500"
              className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
              style={{ animation: "heroBlobSpin 22s linear infinite" }}
            >
              <path
                fill="#ffffff"
                fillOpacity="0.12"
                d="M414,300Q400,400,300,430Q200,460,130,380Q60,300,90,200Q120,100,220,70Q320,40,390,120Q460,200,414,300Z"
              />
            </svg>
            <svg
              viewBox="0 0 500 500"
              className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
              style={{ animation: "heroBlobSpin 18s linear infinite reverse" }}
            >
              <path
                fill="#f5d59a"
                fillOpacity="0.14"
                d="M370,260Q360,340,280,370Q200,400,140,340Q80,280,110,200Q140,120,220,100Q300,80,350,140Q400,200,370,260Z"
              />
            </svg>

            {/* portrait */}
            <div
              className="relative aspect-[4/5] w-full overflow-hidden"
              style={{ animation: "heroFloat 7s ease-in-out infinite" }}
            >
              <img
                src="public/images/hero/hero.png"
                alt="UNC BIDYO crew member filming on location"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes heroBlobSpin {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
