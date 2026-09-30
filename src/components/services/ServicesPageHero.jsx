import { useTranslation } from "react-i18next";
import SceneHero from "../common/SceneHero.jsx";
import servicesScene from "../../assets/service-scenes/services-bg.webp";

export default function ServicesPageHero() {
  const { t } = useTranslation();
  return (
    <SceneHero image={servicesScene} title={t("servicesPage.heroTitle")} />
  );
}
