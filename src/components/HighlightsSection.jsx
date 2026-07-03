import highlights from "../data/highlights";

export default function HighlightsSection() {
  return (
    <section id="highlights" className="px-6 pb-24 pt-4 lg:px-10 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-3xl tracking-widest text-white sm:text-4xl">
          HIGHLIGHTS
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-white/60">
          A look back at the moments we've covered across campus.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {highlights.map((highlight, i) => (
            <div
              key={highlight.id}
              className={`overflow-hidden rounded-3xl bg-bidyo-charcoal ${
                i === 0 ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <img
                src={highlight.image}
                alt={highlight.title}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
