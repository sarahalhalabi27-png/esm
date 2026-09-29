import { useTranslation } from "react-i18next";
import SceneHero from "../common/SceneHero.jsx";
import fleetScene from "../../assets/our-luxury-fleet/hero-bg.webp";

export default function FleetPageHero() {
  const { t } = useTranslation();
  return (
    <SceneHero image={fleetScene} title={t("fleetPage.title")} fullBleed />
  );
}
