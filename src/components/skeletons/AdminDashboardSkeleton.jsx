import { SkeletonBox } from "./Skeleton";

export function BookingCardSkeleton() {
  return (
    <div className="rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <SkeletonBox tone="light" className="h-11 w-11 rounded-full" />
          <div className="space-y-2">
            <SkeletonBox tone="light" className="h-4 w-48" />
            <SkeletonBox tone="light" className="h-3 w-32" />
          </div>
        </div>
        <SkeletonBox tone="light" className="h-6 w-20 rounded-full" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-neutral-100 pt-6 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonBox tone="light" className="h-2 w-16" />
            <SkeletonBox tone="light" className="h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <SkeletonBox tone="light" className="h-11 w-28 rounded-full" />
        <SkeletonBox tone="light" className="h-11 w-28 rounded-full" />
      </div>
    </div>
  );
}

export function HistoryCardSkeleton() {
  return (
    <div className="rounded-[1.75rem] border border-neutral-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <SkeletonBox tone="light" className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <SkeletonBox tone="light" className="h-4 w-40" />
            <SkeletonBox tone="light" className="h-3 w-28" />
          </div>
        </div>
        <SkeletonBox tone="light" className="h-6 w-20 rounded-full" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-neutral-100 pt-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <SkeletonBox tone="light" className="h-2 w-16" />
            <SkeletonBox tone="light" className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardSkeleton({ count = 3 }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="space-y-2">
            <SkeletonBox tone="light" className="h-2.5 w-24" />
            <SkeletonBox tone="light" className="h-5 w-40" />
          </div>
          <SkeletonBox tone="light" className="h-9 w-24 rounded-full" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="space-y-6">
          {Array.from({ length: count }).map((_, i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}