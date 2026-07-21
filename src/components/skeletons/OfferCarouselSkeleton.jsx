import { SkeletonBox, SkeletonText } from "./Skeleton";

/**
 * Content-only skeleton: the carousel track, nav arrows, and dots — no
 * heading and no section/padding wrapper. Meant to be dropped in place of
 * the real carousel markup inside OfferCarousel.jsx, which already renders
 * its own heading above this block, so nothing gets duplicated.
 */
export function OfferCarouselSkeletonContent({ slideCount = 3 }) {
  return (
    <>
      <div className="relative mt-16">
        <div className="flex gap-8 overflow-hidden">
          {Array.from({ length: slideCount }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-3xl"
              style={{ width: "60%" }}
            >
              <SkeletonBox tone="dark" className="h-full w-full rounded-3xl" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <SkeletonBox tone="dark" className="h-2.5 w-16" />
                <SkeletonBox tone="dark" className="mt-2 h-6 w-32" />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 sm:left-6 sm:block">
          <SkeletonBox tone="dark" className="h-12 w-12 rounded-full" />
        </div>
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 sm:right-6 sm:block">
          <SkeletonBox tone="dark" className="h-12 w-12 rounded-full" />
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: slideCount }).map((_, i) => (
          <SkeletonBox
            key={i}
            tone="dark"
            className={`h-2 rounded-full ${i === 0 ? "w-8" : "w-2"}`}
          />
        ))}
      </div>
    </>
  );
}

/** Full standalone section — for use as a page-level/Suspense fallback. */
export default function OfferCarouselSkeleton({ slideCount = 3 }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-bidyo-crimsonBlack via-bidyo-crimsonDeep to-bidyo-crimsonBlack py-20 lg:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <SkeletonBox tone="dark" className="mx-auto h-8 w-64 sm:h-9" />
        <SkeletonText tone="dark" lines={1} className="mx-auto mt-4 max-w-md" />
        <OfferCarouselSkeletonContent slideCount={slideCount} />
      </div>
    </section>
  );
}