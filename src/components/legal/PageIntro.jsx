import { useTranslation } from "react-i18next";
import HorizonArc from "../common/HorizonArc.jsx";

// The top of the text pages (Terms, Privacy, Disclaimer, FAQ): a centred title
// over the site's curved teal horizon line, the "last updated" note (when
// given) and a short intro.
export default function PageIntro({ title, intro, updated = false }) {
  const { t } = useTranslation();

  return (
    <header className="w-full max-w-[1440px] mx-auto px-[50px] pt-[70px] text-center max-md:px-6 max-md:pt-10">
      <h1 className="text-[45px] font-semibold leading-[110%] capitalize text-fg max-md:text-[30px]">
        {title}
      </h1>

      <div className="mt-6 max-md:mt-4">
        <HorizonArc />
      </div>

      {updated ? (
        <p className="mt-2 text-[18px] font-medium leading-[27px] text-teal-accent max-md:text-base">
          {t("legal.updatedLabel")}: {t("legal.updated")}
        </p>
      ) : null}

      <p className="mx-auto mt-8 max-w-[860px] text-[20px] font-medium leading-[1.5] capitalize text-fg/85 max-md:mt-6 max-md:text-[17px] max-md:leading-relaxed">
        {intro}
      </p>
    </header>
  );
}
