import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MessageSquare, Phone } from "lucide-react";
import {
  BOOKING_CARD,
  BOOKING_FIELDS,
  BOOKING_TITLE,
  BOOKING_TWO_COLUMNS,
  BookingHairline,
  BookingInput,
  BookingTextArea,
  BookingButton,
} from "../common/BookingFields.jsx";
import useFormReveal from "../common/useFormReveal.js";
import ControlledField from "../common/ControlledField.jsx";
import { contactSchema } from "../../schemas/formSchemas.js";
import { sanitizeName, sanitizePhone } from "../../utils/validators.js";
import {
  submitContact,
  resetContactStatus,
  selectContactStatus,
} from "../../store/contactSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

const defaultValues = {
  fullName: "",
  subject: "",
  phone: "",
  email: "",
  message: "",
};

// Right column of Contact Us, in the booking-card look shared with the home
// booking form and the reservation form (common/BookingFields.jsx): full name
// and subject, phone and email, the message box (112px tall), then the
// "Contact Us" button centred under them, below a title and a hairline like
// the reservation form's. The card carries the id the footer pages scroll to.
export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const cardRef = useFormReveal(i18n.dir() === "rtl");
  const dispatch = useDispatch();
  const status = useSelector(selectContactStatus);
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(contactSchema(t)),
    defaultValues,
  });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetContactStatus());
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(submitContact(values)).unwrap();
      reset(defaultValues);
    } catch {
      // status is set to "error" by the slice
    }
  };

  return (
    <div
      ref={cardRef}
      id="contact-form"
      className={`${BOOKING_CARD} [--area-h:7rem] lg:px-8`}
    >
      <h2 className={BOOKING_TITLE}>{t("contactPage.form.title")}</h2>
      <BookingHairline />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={BOOKING_FIELDS}
      >
        <div className={BOOKING_TWO_COLUMNS}>
          <ControlledField
            control={control}
            name="fullName"
            as={BookingInput}
            transform={sanitizeName}
            label={t("contactPage.form.fullName")}
            placeholder={t("booking.namePlaceholder")}
            autoComplete="name"
            required
          />
          <ControlledField
            control={control}
            name="subject"
            as={BookingInput}
            icon={MessageSquare}
            label={t("contactPage.form.subject")}
            placeholder={t("formPlaceholders.subject")}
          />
          <ControlledField
            control={control}
            name="phone"
            as={BookingInput}
            type="tel"
            inputMode="numeric"
            transform={sanitizePhone}
            icon={Phone}
            label={t("contactPage.form.phone")}
            placeholder={t("booking.phonePlaceholder")}
            autoComplete="tel"
          />
          <ControlledField
            control={control}
            name="email"
            as={BookingInput}
            type="email"
            icon={Mail}
            label={t("contactPage.form.email")}
            placeholder={t("formPlaceholders.email")}
            autoComplete="email"
            required
          />
        </div>

        <ControlledField
          control={control}
          name="message"
          as={BookingTextArea}
          label={t("contactPage.form.message")}
          placeholder={t("formPlaceholders.message")}
          required
        />

        <div className="relative flex justify-center">
          <BookingButton
            type="submit"
            className="px-12 max-md:w-full"
            disabled={status === SUBMIT_STATUS.SUBMITTING}
          >
            {status === SUBMIT_STATUS.SUBMITTING
              ? t("contactPage.form.sending")
              : t("contactPage.form.submit")}
          </BookingButton>
          {status === SUBMIT_STATUS.SUCCESS ? (
            <p
              className="absolute top-full mt-3 text-sm text-[#24B9A5]"
              role="status"
            >
              {t("contactPage.form.success")}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
