import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout.jsx";
import ContactPageHero from "../components/contact/ContactPageHero.jsx";
import ContactForm from "../components/contact/ContactForm.jsx";
import ContactInfoPanel, {
  ContactIntro,
} from "../components/contact/ContactInfoPanel.jsx";
import LocationMapPanel from "../components/contact/LocationMapPanel.jsx";
import SmokeBackdrop from "../components/common/SmokeBackdrop.jsx";

// Contact Us: the hero; then the heading + intro, under them the contact
// details at the 50px gutter beside the form card (640 wide, ending at the
// right gutter); then the map, 1390 wide.
// When another page links here with `state.scrollTo` (the Contact Us buttons
// of the footer pages), jump straight to that element - just under the sticky
// header - instead of the top of the page. The hero image above loads late and
// pushes the form down, so the jump is repeated while the layout settles, until
// the visitor scrolls on their own.
function useScrollToTarget() {
  const { state, key } = useLocation();
  const targetId = state?.scrollTo;

  useEffect(() => {
    if (!targetId) return undefined;
    let userScrolled = false;
    const stop = () => {
      userScrolled = true;
    };
    const events = ["wheel", "touchstart", "keydown", "mousedown"];
    events.forEach((name) =>
      window.addEventListener(name, stop, { once: true })
    );

    const jump = () => {
      const target = document.getElementById(targetId);
      if (!target || userScrolled) return;
      const header = document.querySelector("header")?.offsetHeight ?? 0;
      const top =
        target.getBoundingClientRect().top + window.scrollY - header - 24;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    };

    jump();
    const observer = new ResizeObserver(jump);
    observer.observe(document.body);
    const done = setTimeout(() => observer.disconnect(), 2500);

    return () => {
      clearTimeout(done);
      observer.disconnect();
      events.forEach((name) => window.removeEventListener(name, stop));
    };
  }, [targetId, key]);
}

export default function ContactUsPage() {
  useScrollToTarget();
  return (
    <PageLayout>
      <ContactPageHero />
      <section className="relative isolate w-full max-w-[1440px] mx-auto px-[50px] mt-[106px] mb-[143px] max-md:px-6 max-md:mt-8 max-md:mb-16">
        <SmokeBackdrop className="md:!-top-[309px] md:!-left-[20px] md:!h-[1153px] md:!w-[1496px] md:rotate-180" />
        {/* The heading and intro on top; under them the contact details and
            the form side by side from xl (the details column narrows on
            1280–1439 screens instead of pushing the 640px form off the edge).
            Below xl they stack with the form first, right under the intro. */}
        <ContactIntro />
        <div className="mt-14 flex justify-between gap-16 max-xl:flex-col-reverse max-xl:gap-14 max-md:mt-10">
          <ContactInfoPanel />
          <div className="w-[640px] shrink-0 me-[2px] max-xl:w-full max-xl:me-0">
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
