import PageHeroBand from "../common/PageHeroBand.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";

export default function BlogPageHero() {
  return (
    <PageHeroBand>
      <SectionEyebrow>Latest Car News</SectionEyebrow>
      <p className="text-gray-400 text-sm max-w-xl">
        Keep Track Of The Latest Car Rental News. Style Our Blog Provides
        Updates On Popular Models, Special Promotions, And Insider Insights For
        A Seamless Rental Experience.
      </p>
    </PageHeroBand>
  );
}
