import PageLayout from "../components/layout/PageLayout.jsx";
import HeroBanner from "../components/home/HeroBanner.jsx";
import QuickBookingForm from "../components/home/QuickBookingForm.jsx";
import FleetPreviewGrid from "../components/home/FleetPreviewGrid.jsx";
import TrustHighlights from "../components/home/TrustHighlights.jsx";
import PopularCarTypes from "../components/home/PopularCarTypes.jsx";
import WhyChooseUsGrid from "../components/home/WhyChooseUsGrid.jsx";
import PartnersMarquee from "../components/home/PartnersMarquee.jsx";
import ServiceTimelineGrid from "../components/home/ServiceTimelineGrid.jsx";
import PromotionalOfferBanner from "../components/home/PromotionalOfferBanner.jsx";

export default function OverviewPage() {
  return (
    <PageLayout>
      <HeroBanner />
      <QuickBookingForm />
      <FleetPreviewGrid />
      <TrustHighlights />
      <PopularCarTypes />
      <WhyChooseUsGrid />
      <PartnersMarquee />
      <ServiceTimelineGrid />
      <PromotionalOfferBanner />
    </PageLayout>
  );
}
