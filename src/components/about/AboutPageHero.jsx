import { useTranslation } from "react-i18next";
import SceneHero from "../common/SceneHero.jsx";
import aboutScene from "../../assets/about/about-hero.webp";

export default function AboutPageHero() {
  const { t } = useTranslation();
  return <SceneHero image={aboutScene} title={t("aboutPage.heroTitle")} />;
}

// Intro line under the scene (100px under the arc, centred, within the page
// gutters)
export function AboutIntro() {
  const { t } = useTranslation();
  return (
    <p className="font-display w-full mt-[100px] px-6 md:px-10 lg:px-[50px] text-center text-[20px] font-medium leading-[1.5] capitalize text-fg max-md:mt-6 max-md:text-lg max-md:leading-snug">
      {t("aboutPage.intro")}
    </p>
  );
}
