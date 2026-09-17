import PageLayout from "../components/layout/PageLayout.jsx";
import ServicesPageHero from "../components/services/ServicesPageHero.jsx";
import ServiceTimelineGrid from "../components/home/ServiceTimelineGrid.jsx";
import PromotionalOfferBanner from "../components/home/PromotionalOfferBanner.jsx";

export default function ServicesPage() {
  return (
    <PageLayout>
      <ServicesPageHero />
      <ServiceTimelineGrid />
      <PromotionalOfferBanner />
    </PageLayout>
  );
}
