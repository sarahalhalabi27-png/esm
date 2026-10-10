import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../common/TextField.jsx";
import TextAreaField from "../common/TextAreaField.jsx";
import HollowButton from "../common/HollowButton.jsx";
import {
  CARD_FIELD_PROPS as fieldProps,
  CARD_PICKER_PROPS as pickerProps,
  FORM_CARD,
  FORM_CARD_DARK_IN_LIGHT,
  FORM_TITLE,
  SUBMIT_BUTTON,
} from "../common/formStyles.js";
import ControlledField from "../common/ControlledField.jsx";
import DatePicker from "../common/DatePicker.jsx";
import TimePicker from "../common/TimePicker.jsx";
import DurationSelect from "./DurationSelect.jsx";
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

// Fields: the shared card-form field (CARD_FIELD in formStyles.js). Light mode
// keeps all of it white on a solid #072E2A card (see FORM_CARD_DARK_IN_LIGHT).
// On hover the button fills white with #072E2A text.

// The card (radius 25, 1px white/60% border, teal/10% background) is at most
// 880px wide, centred, with 48px sides on desktop (Figma had it 1346 wide with
// a 252px column gap; narrowed to common form proportions). Rows are 32px
// apart, columns 40px. Rows: name, contact, duration + the (read-only) car
// model, then pick-up and drop-off date/time in four columns, the message box
// and the button (hollow: just its border over the card's fill).
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

  // Every row sits on the same 4-column grid (40px gutters), so the halves
  // of the two-column rows line up with the date/time row below them.
  const twoColumns =
    "grid grid-cols-2 gap-x-10 gap-y-8 max-md:grid-cols-1 max-md:gap-y-[38px]";

  return (
    <section className="font-display px-[47px] mt-[120px] mb-[120px] max-md:px-6 max-md:mt-14 max-md:mb-16">
      {/* Compact enough (about 610px) to fit on a laptop screen under the
          header without scrolling. */}
      <div
        ref={cardRef}
        className={`${FORM_CARD} ${FORM_CARD_DARK_IN_LIGHT} mx-auto max-w-[880px] lg:!ps-12 lg:!pe-12 lg:!pt-8 pb-10`}
      >
        <h2 className={`${FORM_TITLE} light:!text-white`}>
          {t("carDetails.form.title")}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-8 flex flex-col gap-y-8 max-md:mt-12 max-md:gap-y-[38px]"
        >
          <div className={twoColumns}>
            <ControlledField
              control={control}
              name="firstName"
              as={TextField}
              transform={sanitizeName}
              placeholder={t("carDetails.form.firstName")}
              autoComplete="given-name"
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="lastName"
              as={TextField}
              transform={sanitizeName}
              placeholder={t("carDetails.form.lastName")}
              autoComplete="family-name"
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="email"
              as={TextField}
              type="email"
              placeholder={t("carDetails.form.email")}
              autoComplete="email"
              {...fieldProps}
              // Addresses are shown as typed, not capitalised like the names
              inputClassName={`${fieldProps.inputClassName} !normal-case`}
            />
            <ControlledField
              control={control}
              name="phone"
              as={TextField}
              type="tel"
              transform={sanitizePhone}
              placeholder={t("carDetails.form.phone")}
              autoComplete="tel"
              {...fieldProps}
            />
          </div>

          <div className={twoColumns}>
            <ControlledField
              control={control}
              name="bookingDuration"
              as={DurationSelect}
              placeholder={t("carDetails.form.bookingDuration")}
              {...pickerProps}
              options={durationOptions}
            />
            {/* The car being booked: shown, not editable */}
            <TextField
              placeholder={t("carDetails.form.carModel")}
              value={car.name}
              readOnly
              onChange={() => {}}
              {...fieldProps}
              // "Your Fleet" sits 6px above the car's name (clear of the row above)
              floatingLabelActiveClassName="bottom-[calc(100%+6px)] text-[14px] leading-[17px] text-teal-accent"
            />
          </div>

          {/* Pick-up and drop-off on one row (two per row on tablets) */}
          <div className="grid grid-cols-4 gap-x-10 gap-y-8 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-y-[38px]">
            <ControlledField
              control={control}
              name="pickUpDate"
              as={DatePicker}
              placeholder={t("carDetails.form.pickUpDate")}
              {...pickerProps}
            />
            <ControlledField
              control={control}
              name="pickUpTime"
              as={TimePicker}
              placeholder={t("carDetails.form.pickUpTime")}
              {...pickerProps}
            />
            <ControlledField
              control={control}
              name="dropOffDate"
              as={DatePicker}
              placeholder={t("carDetails.form.dropOffDate")}
              {...pickerProps}
            />
            <ControlledField
              control={control}
              name="dropOffTime"
              as={TimePicker}
              placeholder={t("carDetails.form.dropOffTime")}
              {...pickerProps}
            />
          </div>

          <ControlledField
            control={control}
            name="message"
            as={TextAreaField}
            label={t("carDetails.form.message")}
            labelClassName="font-display font-medium text-[18px] leading-[27px] capitalize text-fg mb-2 max-md:text-base max-md:leading-snug max-md:mb-3"
            // Full width of the card, 80px tall (two lines), radius 10, 0.5px
            // white/60% border; its label 8px above the box.
            className="w-full"
            textareaClassName="!block !h-[80px] !rounded-[10px] !border-[0.5px] !border-white/60 !px-4 !py-3 !text-[18px] focus:!border-teal-accent max-md:!h-[110px] max-md:!text-[15px]"
          />

          {/* One row gap under the message box, 48px above the card's bottom
              edge (SUBMIT_BUTTON sets its size). The success note hangs below the button, outside the flow, so it
              doesn't change those spacings. */}
          <div className="relative flex justify-center">
            <HollowButton
              onDark
              type="submit"
              className={`!relative ${SUBMIT_BUTTON}`}
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
            </HollowButton>
            {status === SUBMIT_STATUS.SUCCESS ? (
              <p
                className="absolute top-full mt-3 text-sm text-teal-accent"
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
