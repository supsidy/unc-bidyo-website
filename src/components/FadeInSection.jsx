import { useEffect, useRef, useState } from "react";

/**
 * Wraps its children and fades + slides them in the first time they scroll
 * into view. Uses IntersectionObserver so it's cheap (no scroll listeners).
 *
 * Usage:
 *   <FadeInSection>
 *     <TeamSection />
 *   </FadeInSection>
 */
export default function FadeInSection({
  children,
  className = "",
  delay = 0, // ms, useful for staggering multiple sections
  threshold = 0.15, // how much of the section must be visible to trigger
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Fire once, then stop watching — we don't want it to fade
          // out/in again every time the user scrolls past it.
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-[opacity,transform] duration-700 ease-out will-change-transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
