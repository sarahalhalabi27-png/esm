import CityLineArtIllustration from "./CityLineArtIllustration.jsx";

// Reusable dark banner with a skyline silhouette, used at the top of
// every inner page (Services, About, Fleet, Blog, Contact).
export default function PageHeroBand({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden border-b border-white/5 ${className}`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(63,224,176,0.08), transparent 70%)",
        }}
      />
      <CityLineArtIllustration className="absolute bottom-0 left-0 w-full h-40 md:h-52 opacity-70" />
      <div className="relative max-w-content mx-auto px-6 pt-10 pb-24 md:pb-32">
        {children}
      </div>
    </div>
  );
}
