import PageLayout from "../components/layout/PageLayout.jsx";
import AboutPageHero, {
  AboutIntro,
} from "../components/about/AboutPageHero.jsx";
import CompanyTimeline from "../components/about/CompanyTimeline.jsx";
import CompanyStatsBar from "../components/about/CompanyStatsBar.jsx";
import SmokeBackdrop from "../components/common/SmokeBackdrop.jsx";

export default function AboutUsPage() {
  return (
    <PageLayout>
      <AboutPageHero />

      {/* Smoke behind the intro, timeline and stats (Figma: 1440 x 1303,
          cropped to fill, 5% opacity, from the intro down — dark mode only,
          like the glow it replaced). `isolate` keeps it (-z-10) above the
          page background but under the content. */}
      <div className="relative isolate">
        <SmokeBackdrop />
        <AboutIntro />
        <CompanyTimeline />
        <CompanyStatsBar />
      </div>
    </PageLayout>
  );
}
