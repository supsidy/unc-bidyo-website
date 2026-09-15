import { SkeletonBox, SkeletonText } from "./Skeleton";

export default function AboutSectionSkeleton() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-bidyo-crimsonBlack via-bidyo-crimsonDeep to-bidyo-crimsonBlack px-6 py-20 lg:px-10 lg:py-28">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <SkeletonBox
            tone="dark"
            className="aspect-[4/3] w-full rounded-3xl"
          />
        </div>
        <div className="lg:col-span-6">
          <SkeletonBox tone="dark" className="h-3 w-32" />
          <SkeletonBox tone="dark" className="mt-4 h-9 w-64" />
          <SkeletonText tone="dark" lines={4} className="mt-6" />
        </div>
      </div>
    </section>
  );
}
