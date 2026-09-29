import { useTranslation } from "react-i18next";
import SceneHero from "../common/SceneHero.jsx";
import useIsLightTheme from "../../hooks/useIsLightTheme.js";
import contactSceneDark from "../../assets/contact/background.webp";
import contactSceneLight from "../../assets/contact/background-light.webp";

// Full-width scene under the curved horizon, like the other page heroes —
// the dark or light version per theme (both 2017 x 780, so switching doesn't
// move anything).
export default function ContactPageHero() {
  const { t } = useTranslation();
  const isLight = useIsLightTheme();
  return (
    <SceneHero
      image={isLight ? contactSceneLight : contactSceneDark}
      title={t("contactPage.heroTitle")}
      fullBleed
    />
  );
}
