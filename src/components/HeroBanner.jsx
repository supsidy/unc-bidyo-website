import { useBookingModal } from "../context/BookingModalContext";

export default function HeroBanner() {
  const { openBooking } = useBookingModal();

  return (
    <section className="px-6 pt-12 lg:px-10 lg:pt-20">
      <div className="relative mx-auto max-w-7xl">
        {/* Main dark charcoal card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-bidyo-charcoal">
          {/* subtle inner glow / texture */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-bidyo-crimson/10" />

          <div className="relative grid grid-cols-1 items-center gap-10 px-8 py-16 sm:px-12 sm:py-20 lg:grid-cols-12 lg:px-16">
            {/* Text column */}
            <div className="relative z-10 lg:col-span-7">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-bidyo-crimson">
                UNC BIDYO
              </p>

              <h1 className="font-display text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Capturing the moments
                <br />
                of every{" "}
                <span className="italic text-bidyo-crimson">UNCean!</span>
              </h1>

              <p className="mt-6 max-w-md text-sm text-neutral-400 sm:text-base">
               Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, in perferendis! Mollitia dicta ipsam provident dolor laudantium, iure consequatur officiis architecto accusantium quam nesciunt placeat sapiente at molestiae totam quo?
              </p>

              <div className="mt-10 flex items-center gap-4">
                <button
                  type="button"
                  onClick={openBooking}
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-bidyo-crimsonBlack shadow-lg transition hover:scale-[1.03] hover:bg-neutral-100"
                >
                  Inquire Now
                </button>
                <a
                  href="#offer"
                  className="text-sm font-semibold text-neutral-300 underline-offset-4 transition hover:text-white hover:underline"
                >
                  See our services
                </a>
              </div>
            </div>

            {/* Gear graphic column - overlapping, bleeds off the card edge */}
            <div className="relative z-10 lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[18rem] sm:max-w-[20rem] lg:absolute lg:-right-10 lg:-top-24 lg:mx-0 lg:max-w-[24rem] xl:-right-16">
                <img
                  src="/images/gimbal.png"
                  alt="Camera mounted on a professional gimbal stabilizer"
                  className="h-full w-full rounded-3xl object-contain p-2 shadow-2xl ring-1 ring-white/10 sm:p-4"
                />
                {/* red accent glow behind the gear image */}
                <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-bidyo-crimson/30 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
