import PageLayout from "../components/layout/PageLayout.jsx";
import ContactPageHero from "../components/contact/ContactPageHero.jsx";
import ContactForm from "../components/contact/ContactForm.jsx";
import ContactInfoPanel from "../components/contact/ContactInfoPanel.jsx";
import LocationMapPanel from "../components/contact/LocationMapPanel.jsx";
import SmokeBackdrop from "../components/common/SmokeBackdrop.jsx";

// Contact Us (Figma, 1440 frame): the hero; then the contact details at the
// 50px gutter and the form (474 wide, ending 77px before the right gutter);
// then the map, 1390 wide.
export default function ContactUsPage() {
  return (
    <PageLayout>
      <ContactPageHero />
      <section className="relative isolate w-full max-w-[1440px] mx-auto px-[50px] mt-[60px] mb-[140px] max-md:px-6 max-md:mt-8 max-md:mb-16">
        <SmokeBackdrop />
        <div className="flex justify-between gap-16 max-lg:flex-col max-lg:gap-14">
          <ContactInfoPanel />
          <div className="w-[474px] shrink-0 me-[77px] max-lg:w-full max-lg:me-0">
            <ContactForm />
          </div>
        </div>
        <div className="mt-[160px] -mx-[20px] max-md:mx-0 max-md:mt-14">
          <LocationMapPanel />
        </div>
      </section>
    </PageLayout>
  );
}
