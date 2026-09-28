import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

// 1440px design frame (matches Figma), centered on wider screens. w-full lets
// it shrink below 1440 on smaller screens (responsive phase 1) while staying
// pixel-identical on desktop.
const frame = "w-full max-w-[1440px] mx-auto";

// The header sits in its own full-width sticky bar, outside the frames: an
// overflow-hidden ancestor disables position: sticky, so inside the frame the
// navbar just scrolled away. Page content only clips sideways (overflow-x-clip
// keeps sections' negative top margins sliding under the header, as before);
// the footer keeps full clipping (its -40px bottom margin is meant to be cut).
//
// Optional slots: `top` renders right after the header, `bleed` spans the
// whole screen width (outside the frame), then `children` continue in the
// frame.
export default function PageLayout({ top, bleed, children }) {
  return (
    <div className="min-h-screen bg-page text-fg font-display">
      <div className="sticky top-0 z-50 bg-page">
        <div className={`${frame} overflow-hidden`}>
          <SiteHeader />
        </div>
      </div>

      {bleed ? (
        <>
          <div className={`${frame} overflow-x-clip`}>{top}</div>
          {bleed}
          <div className={`${frame} overflow-x-clip`}>
            <main>{children}</main>
          </div>
        </>
      ) : (
        <div className={`${frame} overflow-x-clip`}>
          <main>
            {top}
            {children}
          </main>
        </div>
      )}

      <div className={`${frame} overflow-hidden`}>
        <SiteFooter />
      </div>
    </div>
  );
}
