/**
 * Skeleton primitives
 * --------------------
 * Small, composable building blocks used by every skeleton component below.
 * Two tone modes:
 *  - "dark"  -> public site (crimson/charcoal gradients, light-on-dark)
 *  - "light" -> admin portal (white cards on neutral-50, dark-on-light)
 */

const TONE_CLASSES = {
  dark: "bg-white/10",
  light: "bg-neutral-200 dark:bg-neutral-700",
};

export function SkeletonBox({ tone = "dark", className = "", style }) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`animate-pulse rounded-md ${TONE_CLASSES[tone]} ${className}`}
    />
  );
}

export function SkeletonText({
  tone = "dark",
  lines = 1,
  className = "",
  lastLineWidth = "70%",
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          tone={tone}
          className="h-3 w-full"
          style={i === lines - 1 && lines > 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ tone = "dark", size = "h-12 w-12", className = "" }) {
  return <SkeletonBox tone={tone} className={`${size} rounded-full shrink-0 ${className}`} />;
}

export function SkeletonButton({ tone = "dark", className = "h-11 w-32" }) {
  return <SkeletonBox tone={tone} className={`rounded-full ${className}`} />;
}

export function SkeletonImage({ tone = "dark", className = "" }) {
  return <SkeletonBox tone={tone} className={`rounded-3xl ${className}`} />;
}