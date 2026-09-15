import { useEffect, useState } from "react";
import { usePhotoboothModal } from "../context/PhotoboothModalContext";

const DRIVE_URL =
  "https://drive.google.com/drive/folders/1_f-AUnO9PhMtE9pb9m86EnOgdkmKEv51"; // TODO: replace with the actual UNC BIDYO Drive folder link
const ILLUSTRATION_SRC = "/images/thanks.png"; // TODO: replace with your illustration/logo path

export default function PhotoboothModal() {
  const { isOpen, closePhotobooth } = usePhotoboothModal();
  const [visible, setVisible] = useState(false);

  // Escape key + background scroll lock
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closePhotobooth();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closePhotobooth]);

  // Trigger the fade-in on the next frame after mount so the browser
  // registers the initial (invisible) state before transitioning.
  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      return undefined;
    }

    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={closePhotobooth}
      role="dialog"
      aria-modal="true"
      aria-labelledby="photobooth-modal-title"
    >
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ease-out ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colored header band with illustration */}
        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-bidyo-crimson">
          {/* Decorative soft blob behind the illustration */}
          <div className="pointer-events-none absolute -bottom-6 right-6 h-28 w-28 rounded-full bg-white/10" />

          {/* Close button */}
          <button
            type="button"
            onClick={closePhotobooth}
            aria-label="Close modal"
            className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-base text-bidyo-crimson shadow transition hover:bg-white"
          >
            ✕
          </button>

          {/* Illustration/logo — bleeds slightly below the band */}
          <img
            src={ILLUSTRATION_SRC}
            alt=""
            aria-hidden="true"
            className="relative z-10 h-50 w-100 -mb-8 object-contain drop-shadow-xl"
          />
        </div>

        {/* Body */}
        <div className="px-8 pb-9 pt-10 text-center">
          <h2
            id="photobooth-modal-title"
            className="text-xl font-semibold leading-snug text-neutral-900"
          >
            Your Photos Are Ready!
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Thank you for visiting the UNC BIDYO photobooth! Click below to
            access and download your soft-copy pictures.
          </p>

          <a
            href={DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl bg-bidyo-crimson px-6 text-sm font-semibold text-white shadow-md transition hover:bg-red-600"
          >
            Access Google Drive
          </a>

          <p className="mt-5 text-xs leading-relaxed text-neutral-400">
            Photos remain available in the Drive folder for a limited time.
          </p>
        </div>
      </div>
    </div>
  );
}
