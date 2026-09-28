import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

// 1440px design frame (matches Figma), centered on wider screens. w-full lets
// it shrink below 1440 on smaller screens (responsive phase 1) while staying
// pixel-identical on desktop.
const frameClass = "w-full max-w-[1440px] mx-auto overflow-hidden";

// Optional slots for a full-width band: `top` renders in the frame right after
// the header, `bleed` spans the whole screen width (outside the frame), then
// `children` continue in the frame with the footer. Without `bleed` the page
// is a single frame as before.
export default function PageLayout({ top, bleed, children }) {
  if (!bleed) {
    return (
      <div className="min-h-screen bg-page text-fg font-display">
        <div className={frameClass}>
          <SiteHeader />
          <main>
            {top}
            {children}
          </main>
          <SiteFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page text-fg font-display">
      <div className={frameClass}>
        <SiteHeader />
        {top}
      </div>
      {bleed}
      <div className={frameClass}>
        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
