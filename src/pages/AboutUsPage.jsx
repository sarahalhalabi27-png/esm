import PageLayout from "../components/layout/PageLayout.jsx";
import AboutPageHero from "../components/about/AboutPageHero.jsx";
import CompanyTimeline from "../components/about/CompanyTimeline.jsx";
import CompanyStatsBar from "../components/about/CompanyStatsBar.jsx";

export default function AboutUsPage() {
  return (
    <PageLayout>
      <AboutPageHero />
      <CompanyTimeline />
      <CompanyStatsBar />
    </PageLayout>
  );
}
