import { useEffect, useState } from "react";

// Follows the <html data-theme> attribute (set by ThemeToggle), so a
// component can switch a media source with the theme (e.g. dark vs light
// video) and only the one in use is downloaded.
export default function useIsLightTheme() {
  const read = () =>
    document.documentElement.getAttribute("data-theme") === "light";
  const [isLight, setIsLight] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setIsLight(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return isLight;
}
