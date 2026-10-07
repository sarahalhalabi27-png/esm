import PageLayout from "../components/layout/PageLayout.jsx";
import ContactPageHero from "../components/contact/ContactPageHero.jsx";
import ContactForm from "../components/contact/ContactForm.jsx";
import ContactInfoPanel from "../components/contact/ContactInfoPanel.jsx";
import LocationMapPanel from "../components/contact/LocationMapPanel.jsx";
import SmokeBackdrop from "../components/common/SmokeBackdrop.jsx";

// Contact Us (Figma, 1440 frame): the hero; then the contact details at the
// 50px gutter and the form card (640 wide, 250px from the heading, ending at the right gutter);
// then the map, 1390 wide.
export default function ContactUsPage() {
  return (
    <PageLayout>
      <ContactPageHero />
      <section className="relative isolate w-full max-w-[1440px] mx-auto px-[50px] mt-[106px] mb-[143px] max-md:px-6 max-md:mt-8 max-md:mb-16">
        <SmokeBackdrop className="md:!-top-[309px] md:!-left-[20px] md:!h-[1153px] md:!w-[1496px] md:rotate-180" />
        <div className="flex justify-between gap-16 max-lg:flex-col max-lg:gap-14">
          <ContactInfoPanel />
          <div className="w-[640px] shrink-0 me-[2px] max-lg:w-full max-lg:me-0">
            <ContactForm />
          </div>
        </div>
        <div className="mt-[160px] -mx-[20.5px] max-md:mx-0 max-md:mt-14">
          <LocationMapPanel />
        </div>
      </section>
    </PageLayout>
  );
}
