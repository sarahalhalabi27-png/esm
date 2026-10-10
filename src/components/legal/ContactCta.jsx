import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookingButton } from "../common/BookingFields.jsx";

// The closing call to action of the text pages: a short line and the
// "Contact Us" button (the forms' button, in its on-the-page look).
export default function ContactCta() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto mt-[110px] flex max-w-[860px] flex-col items-center text-center max-md:mt-14">
      <h2 className="text-[25px] font-semibold leading-[30px] capitalize text-teal-accent max-md:text-xl">
        {t("legal.ctaTitle")}
      </h2>
      <p className="mt-4 text-[18px] font-medium leading-[1.6] text-fg/85 max-md:text-base">
        {t("legal.ctaText")}
      </p>
      <BookingButton
        as={Link}
        variant="page"
        to="/contact"
        // Opens Contact Us at its form rather than at the top (see ContactUsPage)
        state={{ scrollTo: "contact-form" }}
        className="mt-8 px-12"
      >
        {t("legal.ctaButton")}
      </BookingButton>
    </section>
  );
}
