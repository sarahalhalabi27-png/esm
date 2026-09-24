import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-page text-fg font-display">
      {/* 1440px design frame (matches Figma), centered on wider screens.
          w-full lets it shrink below 1440 on smaller screens (responsive
          phase 1) while staying pixel-identical on desktop. */}
      <div className="w-full max-w-[1440px] mx-auto overflow-hidden">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
