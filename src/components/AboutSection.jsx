export default function AboutSection() {
  return (
    <section id="about" className="bg-bidyo-crimsonBlack px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Theatrical team lineup */}
        <div className="lg:col-span-6">
          <div className="overflow-hidden rounded-[2.5rem] bg-bidyo-charcoal">
            <img
              src="/images/ry.jpg"
              alt="UNC BIDYO team silhouette lineup"
              className="h-full w-full object-cover grayscale"
            />
          </div>
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
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt fuga ullam quos sapiente dignissimos natus fugit, ducimus minus, modi nemo tempore explicabo earum et. Ducimus maiores officiis quia quos aperiam!
          </p>
        </div>
      </div>
    </section>
  );
}
