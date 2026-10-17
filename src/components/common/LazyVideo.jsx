import { useEffect, useRef, useState } from "react";

// A looping, muted background video that only starts downloading once it is
// about to scroll into view (a plain autoplay <video> fetches its file on page
// load, even far below the fold). `poster` is shown until it plays.
export default function LazyVideo({ src, poster, className = "", ...rest }) {
  const ref = useRef(null);
  const [near, setNear] = useState(() => !("IntersectionObserver" in window));

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near, src]);

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      poster={poster}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      {...rest}
    />
  );
}
