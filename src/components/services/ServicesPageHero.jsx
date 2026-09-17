import PageHeroBand from "../common/PageHeroBand.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import CarLineArtIllustration from "../common/CarLineArtIllustration.jsx";

export default function ServicesPageHero() {
  return (
    <PageHeroBand>
      <div className="max-w-2xl">
        <SectionEyebrow>ESM Limo Services</SectionEyebrow>
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Premium Transportation Solutions, Tailored To You
        </h1>
        <p className="text-gray-400 text-sm">
          From Luxury Rides To Professional Chauffeur Services, We Ensure A
          Seamless And Stylish Travel Experience Across The UAE.
        </p>
      </div>
      <CarLineArtIllustration className="w-full max-w-sm mt-10" />
    </PageHeroBand>
  );
}
