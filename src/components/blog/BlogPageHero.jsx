import { useTranslation } from "react-i18next";
import SceneHero from "../common/SceneHero.jsx";
import useIsLightTheme from "../../hooks/useIsLightTheme.js";

// Full-width looping video (dark or light version, per theme — only the one
// shown is downloaded) under the curved horizon, like the other page heroes.
// The 1280 x 720 videos (1440 x 810 at that width) only use the band from
// ~17% to ~91% of their height — the rest is empty background — so the hero
// shows the whole scene and just trims that background: a 1440 x 600 box the
// video covers, shifted to 66% (object-position) so the band's top meets the
// box's top. (Figma's box is 1440 x 525, which would cut into the scene; a
// video exported at that ratio would fit it exactly.)
export default function BlogPageHero() {
  const { t } = useTranslation();
  const isLight = useIsLightTheme();
  return (
    <SceneHero
      video={isLight ? "/blog-video-light.mp4" : "/blog-video-dark.mp4"}
      title={t("blogPage.heroTitle")}
      fullBleed
      flushTop
      mediaClassName="aspect-[1440/600] object-cover object-[50%_66%]"
    />
  );
}
