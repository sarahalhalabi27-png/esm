import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import gsap from "gsap";

// Full-size viewer for the Car Interior photos: the photo large on a dark
// backdrop, arrows (and swipe on touch) to step through, a counter.
// Closes with Esc, the close button or a click outside the photo; ←/→ step
// (mirrored in Arabic). Focus moves to the close button on open and back to
// the photo that opened it on close; the page doesn't scroll meanwhile.
// Rendered into <body> so no page transform or clipping can affect it.
export default function InteriorLightbox({
  images,
  index,
  onIndexChange,
  onClose,
  carName,
}) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const backdropRef = useRef(null);
  const photoRef = useRef(null);
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const count = images.length;

  // From the current index (not this render's), so quick repeated steps add up.
  const step = (delta) =>
    onIndexChange((current) => (current + delta + count) % count);

  // Open: focus, scroll lock, fade + slight zoom in; restore on close.
  useEffect(() => {
    const opener = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reduce.matches) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power1.out" }
      );
    }

    return () => {
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, []);

  // Each photo shown (on open and on every step) settles in.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      photoRef.current,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }
    );
  }, [index]);

  // Keyboard: Esc closes, arrows step (visually: → shows the next photo in
  // English, the previous one in Arabic).
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") step(isRtl ? -1 : 1);
      else if (event.key === "ArrowLeft") step(isRtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white border border-white/30 backdrop-blur-sm transition-colors hover:bg-white hover:text-[#072E2A] max-md:w-10 max-md:h-10";
  // Chevrons point physically; "previous" sits at the start side.
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return createPortal(
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("carDetails.gallery.label", { car: carName })}
      dir={isRtl ? "rtl" : "ltr"}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 font-display"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        touchX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchX.current === null) return;
        const dx = event.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        // A swipe towards the start side shows the next photo.
        if (Math.abs(dx) > 50) step(dx < 0 !== isRtl ? 1 : -1);
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={t("carDetails.gallery.close")}
        className="absolute top-6 end-6 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white border border-white/30 transition-colors hover:bg-white hover:text-[#072E2A] max-md:top-4 max-md:end-4"
      >
        <X size={22} strokeWidth={1.75} />
      </button>

      {count > 1 && (
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={t("carDetails.gallery.previous")}
          className={`${arrowClass} start-6 max-md:start-3`}
        >
          <PrevIcon size={24} strokeWidth={1.75} />
        </button>
      )}

      <figure className="m-0 flex flex-col items-center gap-4 px-24 max-md:px-4">
        <img
          ref={photoRef}
          src={images[index]}
          alt={t("carDetails.interiorAlt", { car: carName, index: index + 1 })}
          className="block w-[min(1100px,80vw)] max-h-[78vh] object-contain rounded-[12px] max-md:w-[92vw]"
          draggable={false}
        />
        <figcaption
          className="text-white/80 text-[16px] tabular-nums"
          aria-live="polite"
        >
          {index + 1} / {count}
        </figcaption>
      </figure>

      {count > 1 && (
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={t("carDetails.gallery.next")}
          className={`${arrowClass} end-6 max-md:end-3`}
        >
          <NextIcon size={24} strokeWidth={1.75} />
        </button>
      )}
    </div>,
    document.body
  );
}
