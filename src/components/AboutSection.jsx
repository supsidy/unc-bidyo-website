import AboutSectionSkeleton from "./skeletons/AboutSectionSkeleton";

export default function AboutSection({ isLoading = false }) {
  if (isLoading) {
    return (
      <div aria-busy="true" aria-hidden="true">
        <AboutSectionSkeleton />
      </div>
    );
  }

  return (
    <section
      id="about"
      aria-busy={isLoading}
      className="relative overflow-hidden bg-gradient-to-br from-bidyo-crimsonBlack via-bidyo-crimsonDeep to-bidyo-crimsonBlack px-6 py-20 lg:px-10 lg:py-28"
    >
      {/* fade in from the previous section so the seam isn't a hard cut */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bidyo-crimsonBlack to-transparent" />
      {/* fade out to the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bidyo-crimsonBlack" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Theatrical team lineup */}
        <div className="lg:col-span-6">
          <img
            src="/images/team/grouppic.png"
            alt="UNC BIDYO team silhouette lineup"
            className="h-auto w-full"
            style={{
              maskImage:
                "radial-gradient(ellipse 95% 95% at 50% 50%, black 82%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 95% 95% at 50% 50%, black 82%, transparent 100%)",
            }}
          />
        </div>

        {/* Copy */}
        <div className="lg:col-span-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/60">
            About the Org
          </p>
          <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">
            We are UNC BIDYO.
          </h2>
          <p className="mt-6 text-justify text-base leading-relaxed text-white/80">
            The organization was founded as a space for students who embody vision, truth, and memory to come together and grow. While showcasing the genuine, everyday moments of every "UNCean" remains central to its purpose, the organization is equally devoted to fostering skill-sharing and building connections among individuals who share the same passions and goals. In this way, it reflects what UNCeans truly value: to share, to show, and to stand.
          </p>
        </div>
      </div>
    </section>
  );
}
