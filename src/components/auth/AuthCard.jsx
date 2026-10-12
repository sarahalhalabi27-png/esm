import {
  BOOKING_CARD,
  BOOKING_TITLE,
  BookingHairline,
} from "../common/BookingFields.jsx";
import SmokeBackdrop from "../common/SmokeBackdrop.jsx";

// The page section and card (at most 480px wide, centred) shared by the
// login, sign-up, verification and "account ready" screens: the booking-card
// look (common/BookingFields.jsx) with a title and hairline, then `children`
// (a form, so useFormReveal can find it through `cardRef`).
export default function AuthCard({ cardRef, title, children }) {
  return (
    <section className="relative isolate font-display px-6 md:px-10 lg:px-[50px] mt-[60px] mb-[120px] max-md:mt-6 max-md:mb-16">
      <SmokeBackdrop />
      <div
        ref={cardRef}
        className={`${BOOKING_CARD} mx-auto max-w-[480px] lg:px-8`}
      >
        <h2 className={BOOKING_TITLE}>{title}</h2>
        <BookingHairline />
        {children}
      </div>
    </section>
  );
}
