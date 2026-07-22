import { useEffect, useState } from "react";
import { preloadImage } from "../utils/preloadImages";

const HERO_IMAGE = "/images/hero/hero.png";

export default function Preloader({ onDone }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(() => {
      if (!cancelled) finish();
    }, 5000); // safety fallback — never block more than 5s

    preloadImage(HERO_IMAGE).then(() => {
      clearTimeout(timeout);
      if (!cancelled) finish();
    });

    function finish() {
      setFadeOut(true);
      setTimeout(onDone, 400); // matches transition duration below
    }

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-bidyo-crimson via-bidyo-crimsonDeep to-bidyo-crimsonBlack transition-opacity duration-400 ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
    </div>
  );
}
