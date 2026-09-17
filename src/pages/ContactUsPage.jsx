import PageLayout from "../components/layout/PageLayout.jsx";
import ContactPageHero from "../components/contact/ContactPageHero.jsx";
import ContactForm from "../components/contact/ContactForm.jsx";
import ContactInfoPanel from "../components/contact/ContactInfoPanel.jsx";
import LocationMapPanel from "../components/contact/LocationMapPanel.jsx";

export default function ContactUsPage() {
  return (
    <PageLayout>
      <ContactPageHero />
      <section className="max-w-content mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <ContactForm />
          <ContactInfoPanel />
        </div>
        <LocationMapPanel />
      </section>
    </PageLayout>
  );
}
