import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Car, Clock, Mail, Phone, Timer } from "lucide-react";
import {
  BOOKING_CARD,
  BOOKING_FIELDS,
  BOOKING_FOUR_COLUMNS,
  BOOKING_TITLE,
  BOOKING_TWO_COLUMNS,
  BookingHairline,
  BookingInput,
  BookingPicker,
  BookingSelect,
  BookingTextArea,
  BookingButton,
  OptionalField,
  BOOKING_PAIR_COLUMNS,
} from "../common/BookingFields.jsx";
import ControlledField from "../common/ControlledField.jsx";
import DatePicker from "../common/DatePicker.jsx";
import TimePicker from "../common/TimePicker.jsx";
import { reservationSchema } from "../../schemas/formSchemas.js";
import { sanitizeName, sanitizePhone } from "../../utils/validators.js";
import {
  submitBooking,
  resetBookingStatus,
  selectBookingStatus,
} from "../../store/bookingSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";
import useFormReveal from "../common/useFormReveal.js";
import DrawnCheck from "../common/DrawnCheck.jsx";

const SENT_FLASH_MS = 1800;

const BOOKING_DURATIONS = ["hourly", "daily", "weekly", "monthly"];

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bookingDuration: "",
  pickUpDate: "",
  pickUpTime: "",
  dropOffDate: "",
  dropOffTime: "",
  message: "",
};

// "Reserve Your Luxury Ride Today!": the booking-card look shared with the
// home booking form (common/BookingFields.jsx) in a card at most 880px wide,
// centred. Rows: first / last name, email / phone, booking duration + the
// (read-only) car model, then pick-up and drop-off date / time in four
// columns (two per row on tablets), the message box and the button.
export default function CarReservationForm({ car }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const cardRef = useFormReveal(i18n.dir() === "rtl");
  // Briefly show a drawn tick in the button once a reservation is sent.
  const [sentFlash, setSentFlash] = useState(false);
  useEffect(() => {
    if (!sentFlash) return undefined;
    const timer = setTimeout(() => setSentFlash(false), SENT_FLASH_MS);
    return () => clearTimeout(timer);
  }, [sentFlash]);
  const status = useSelector(selectBookingStatus);
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(reservationSchema(t)),
    defaultValues,
  });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetBookingStatus());
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(
        submitBooking({ carId: car.id, carName: car.name, ...values })
      ).unwrap();
      reset(defaultValues);
      setSentFlash(true);
    } catch {
      // status is set to "error" by the slice
    }
  };

  const durationOptions = BOOKING_DURATIONS.map((value) => ({
    value,
    label: t(`carDetails.form.durations.${value}`),
  }));

  return (
    <section className="font-display px-6 md:px-10 lg:px-[50px] mt-[120px] mb-[120px] max-md:mt-14 max-md:mb-16">
      <div
        ref={cardRef}
        className={`${BOOKING_CARD} mx-auto max-w-[880px] lg:px-10`}
      >
        <h2 className={BOOKING_TITLE}>{t("carDetails.form.title")}</h2>
        <BookingHairline />

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={BOOKING_FIELDS}
        >
          <div className={BOOKING_PAIR_COLUMNS}>
            <ControlledField
              control={control}
              name="firstName"
              as={BookingInput}
              transform={sanitizeName}
              label={t("carDetails.form.firstName")}
              placeholder={t("formPlaceholders.firstName")}
              autoComplete="given-name"
              required
            />
            <ControlledField
              control={control}
              name="lastName"
              as={BookingInput}
              transform={sanitizeName}
              label={t("carDetails.form.lastName")}
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
              label={t("carDetails.form.email")}
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
              label={t("carDetails.form.phone")}
              placeholder={t("booking.phonePlaceholder")}
              autoComplete="tel"
              required
            />
          </div>

          <div className={BOOKING_TWO_COLUMNS}>
            <ControlledField
              control={control}
              name="bookingDuration"
              as={BookingSelect}
              icon={Timer}
              label={t("carDetails.form.bookingDuration")}
              placeholder={t("formPlaceholders.chooseDuration")}
              options={durationOptions}
              required
            />
            {/* The car being booked: shown, not editable */}
            <BookingInput
              icon={Car}
              label={t("carDetails.form.carModel")}
              value={car.name}
              readOnly
              onChange={() => {}}
            />
          </div>

          <div className={BOOKING_FOUR_COLUMNS}>
            <ControlledField
              control={control}
              name="pickUpDate"
              as={BookingPicker}
              pair
              picker={DatePicker}
              icon={CalendarDays}
              label={t("carDetails.form.pickUpDate")}
              placeholder={t("booking.datePlaceholder")}
            />
            <ControlledField
              control={control}
              name="pickUpTime"
              as={BookingPicker}
              pair
              picker={TimePicker}
              icon={Clock}
              label={t("carDetails.form.pickUpTime")}
              placeholder={t("booking.timePlaceholder")}
            />
            <ControlledField
              control={control}
              name="dropOffDate"
              as={BookingPicker}
              pair
              picker={DatePicker}
              icon={CalendarDays}
              label={t("carDetails.form.dropOffDate")}
              placeholder={t("booking.datePlaceholder")}
            />
            <ControlledField
              control={control}
              name="dropOffTime"
              as={BookingPicker}
              pair
              picker={TimePicker}
              icon={Clock}
              label={t("carDetails.form.dropOffTime")}
              placeholder={t("booking.timePlaceholder")}
            />
          </div>

          <OptionalField label={t("formPlaceholders.addNote")}>
            <ControlledField
              control={control}
              name="message"
              as={BookingTextArea}
              label={t("carDetails.form.message")}
              placeholder={t("formPlaceholders.message")}
            />
          </OptionalField>

          {/* The success note hangs below the button, outside the flow, so it
              doesn't change the card's height. */}
          <div className="relative flex justify-center">
            <BookingButton
              type="submit"
              className="px-12 max-md:w-full"
              disabled={status === SUBMIT_STATUS.SUBMITTING}
            >
              {/* The label keeps the button's size while the tick shows */}
              <span className={sentFlash ? "invisible" : undefined}>
                {status === SUBMIT_STATUS.SUBMITTING
                  ? t("booking.sending")
                  : t("carDetails.form.submit")}
              </span>
              {sentFlash && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <DrawnCheck />
                </span>
              )}
            </BookingButton>
            {status === SUBMIT_STATUS.SUCCESS ? (
              <p
                className="absolute top-full mt-3 text-sm text-[#24B9A5]"
                role="status"
              >
                {t("booking.success")}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
