import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white font-display">
      {/* Fixed 1440px design frame (matches Figma). Centered on wider screens.
          Responsiveness is intentionally deferred until all pages are done. */}
      <div className="w-[1440px] mx-auto overflow-hidden">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
