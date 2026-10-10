import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConciergeBell, Mail, MapPin, Phone } from "lucide-react";
import ControlledField from "../common/ControlledField.jsx";
import useFormReveal from "../common/useFormReveal.js";
import {
  BOOKING_CARD,
  BOOKING_FIELDS,
  BOOKING_TITLE,
  BOOKING_TWO_COLUMNS,
  BookingHairline,
  BookingInput,
  BookingSelect,
  BookingButton,
  BOOKING_PAIR_COLUMNS,
} from "../common/BookingFields.jsx";
import { quickBookSchema } from "../../schemas/formSchemas.js";
import { sanitizeName, sanitizePhone } from "../../utils/validators.js";
import { QUICK_BOOK_SERVICES } from "../../data/quickBookServices.js";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  service: "",
};

// "Quickly Book Your Luxury Ride" (opened from the home hero's button), step
// one: the booking-card look shared with the home booking form
// (common/BookingFields.jsx), at most 880px wide and centred - first / last
// name, email / phone, location / service in two columns - and "Next", which
// hands the values to `onNext`; the page then swaps this card for the picked
// service's own form (QuickBookFlow).
export default function QuickBookForm({ initialValues, onNext }) {
  const { t, i18n } = useTranslation();
  const cardRef = useFormReveal(i18n.dir() === "rtl");

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(quickBookSchema(t)),
    defaultValues: initialValues ?? defaultValues,
  });

  const serviceOptions = QUICK_BOOK_SERVICES.map((value) => ({
    value,
    label: t(`quickBook.services.${value}`),
  }));

  return (
    <section className="font-display px-6 md:px-10 lg:px-[50px] mt-[44px] mb-[120px] max-md:mt-6 max-md:mb-16">
      <div
        ref={cardRef}
        className={`${BOOKING_CARD} mx-auto max-w-[880px] lg:px-10`}
      >
        <h2 className={BOOKING_TITLE}>{t("quickBook.title")}</h2>
        <BookingHairline />

        <form
          onSubmit={handleSubmit(onNext)}
          noValidate
          className={BOOKING_FIELDS}
        >
          <div className={BOOKING_PAIR_COLUMNS}>
            <ControlledField
              control={control}
              name="firstName"
              as={BookingInput}
              transform={sanitizeName}
              label={t("quickBook.firstName")}
              placeholder={t("formPlaceholders.firstName")}
              autoComplete="given-name"
              required
            />
            <ControlledField
              control={control}
              name="lastName"
              as={BookingInput}
              transform={sanitizeName}
              label={t("quickBook.lastName")}
              placeholder={t("formPlaceholders.lastName")}
              autoComplete="family-name"
              required
            />
          </div>

          <div className={BOOKING_TWO_COLUMNS}>
            <ControlledField
              control={control}
              name="email"
              as={BookingInput}
              type="email"
              icon={Mail}
              label={t("quickBook.email")}
              placeholder={t("formPlaceholders.email")}
              autoComplete="email"
              required
            />
            <ControlledField
              control={control}
              name="phone"
              as={BookingInput}
              type="tel"
              inputMode="numeric"
              transform={sanitizePhone}
              icon={Phone}
              label={t("quickBook.phone")}
              placeholder={t("booking.phonePlaceholder")}
              autoComplete="tel"
              required
            />
            <ControlledField
              control={control}
              name="location"
              as={BookingInput}
              icon={MapPin}
              label={t("quickBook.location")}
              placeholder={t("booking.locationPlaceholder")}
            />
            <ControlledField
              control={control}
              name="service"
              as={BookingSelect}
              icon={ConciergeBell}
              label={t("quickBook.service")}
              placeholder={t("formPlaceholders.chooseService")}
              options={serviceOptions}
              required
            />
          </div>

          <div className="relative flex justify-center">
            <BookingButton type="submit" className="px-12 max-md:w-full">
              {t("quickBook.next")}
            </BookingButton>
          </div>
        </form>
      </div>
    </section>
  );
}
