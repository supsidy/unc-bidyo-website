import { SkeletonBox } from "./Skeleton";

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

export default function HighlightsSectionSkeleton({
  tileCount = TILE_SPANS.length,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-bidyo-crimsonBlack via-bidyo-crimsonDeep to-bidyo-crimsonBlack px-6 pb-24 pt-4 lg:px-10 lg:pb-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        <SkeletonBox tone="dark" className="mx-auto h-8 w-56 sm:h-9" />
        <SkeletonBox tone="dark" className="mx-auto mt-3 h-3 w-96 max-w-md" />

        <div className="mt-12 grid grid-flow-dense grid-cols-2 auto-rows-[140px] gap-4 sm:grid-cols-3 sm:auto-rows-[160px] lg:grid-cols-4 lg:auto-rows-[190px] lg:gap-5">
          {Array.from({ length: tileCount }).map((_, i) => (
            <SkeletonBox
              key={i}
              tone="dark"
              className={`rounded-3xl ${TILE_SPANS[i] ?? ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
