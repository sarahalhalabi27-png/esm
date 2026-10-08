import { useTranslation } from "react-i18next";
import PageLayout from "../components/layout/PageLayout.jsx";
import PageIntro from "../components/legal/PageIntro.jsx";
import LegalSection from "../components/legal/LegalSection.jsx";
import ContactCta from "../components/legal/ContactCta.jsx";
import SmokeBackdrop from "../components/common/SmokeBackdrop.jsx";

// A legal text page - Terms Of Services, Privacy Policy or Disclaimer - built
// from the translations under legal.<doc> (title, intro and numbered
// sections of paragraphs), in the site's look: title over the teal horizon,
// teal numbered headings, the faint smoke behind.
export default function LegalPage({ doc }) {
  const { t } = useTranslation();
  const sections = t(`legal.${doc}.sections`, { returnObjects: true });

  return (
    <PageLayout>
      <div className="relative isolate">
        <SmokeBackdrop />
        <PageIntro
          title={t(`legal.${doc}.title`)}
          intro={t(`legal.${doc}.intro`)}
          updated
        />

        <div className="mx-auto mt-[70px] mb-[140px] w-full max-w-[1240px] px-[50px] max-md:mt-10 max-md:mb-16 max-md:px-6">
          <div className="flex flex-col gap-10 max-md:gap-7">
            {Array.isArray(sections) &&
              sections.map((section, index) => (
                <LegalSection
                  key={section.heading}
                  number={index + 1}
                  heading={section.heading}
                  paragraphs={section.body}
                />
              ))}
          </div>
          <ContactCta />
        </div>
      </div>
    </PageLayout>
  );
}
