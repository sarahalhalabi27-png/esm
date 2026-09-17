import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white font-display">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
