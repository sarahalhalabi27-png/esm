import { useTranslation } from "react-i18next";
import PageLayout from "../components/layout/PageLayout.jsx";
import PageIntro from "../components/legal/PageIntro.jsx";
import FaqList from "../components/legal/FaqList.jsx";
import ContactCta from "../components/legal/ContactCta.jsx";
import SmokeBackdrop from "../components/common/SmokeBackdrop.jsx";

// The FAQ page: the same title block as the legal pages, then the questions
// (translations under legal.faq.items) as cards that open one at a time.
export default function FaqPage() {
  const { t } = useTranslation();
  const items = t("legal.faq.items", { returnObjects: true });

  return (
    <PageLayout>
      <div className="relative isolate">
        <SmokeBackdrop />
        <PageIntro title={t("legal.faq.title")} intro={t("legal.faq.intro")} />

        <div className="mx-auto mt-[70px] mb-[140px] w-full max-w-[1240px] px-[50px] max-md:mt-10 max-md:mb-16 max-md:px-6">
          {Array.isArray(items) ? <FaqList items={items} /> : null}
          <ContactCta />
        </div>
      </div>
    </PageLayout>
  );
}
