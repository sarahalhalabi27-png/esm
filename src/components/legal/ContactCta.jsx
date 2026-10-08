import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// The closing call to action of the text pages: a short line and the hollow
// "Contact Us" button (same look as the forms' buttons).
export default function ContactCta() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto mt-[110px] flex max-w-[860px] flex-col items-center text-center max-md:mt-14">
      <h2 className="text-[25px] font-semibold leading-[30px] capitalize text-teal-accent max-md:text-xl">
        {t("legal.ctaTitle")}
      </h2>
      <p className="mt-4 text-[20px] font-medium leading-[135%] text-fg/85 max-md:text-base">
        {t("legal.ctaText")}
      </p>
      <Link
        to="/contact"
        // Opens Contact Us at its form rather than at the top (see ContactUsPage)
        state={{ scrollTo: "contact-form" }}
        className="mt-8 inline-flex items-center justify-center rounded-[10px] border border-line px-[47px] py-[13px] text-[22px] font-semibold leading-[27px] capitalize text-fg transition-colors hover:bg-fg hover:text-page max-md:px-8 max-md:py-3 max-md:text-[18px]"
      >
        {t("legal.ctaButton")}
      </Link>
    </section>
  );
}
