import { useTranslation } from "react-i18next";
import { Car, CarFront, Users } from "lucide-react";
import ControlledField from "../common/ControlledField.jsx";
import DrawnCheck from "../common/DrawnCheck.jsx";
import {
  BOOKING_CARD,
  BOOKING_FIELDS,
  BOOKING_THREE_COLUMNS,
  BOOKING_TITLE,
  BookingHairline,
  BookingSelect,
  BookingButton,
} from "../common/BookingFields.jsx";
import {
  POINT_TO_POINT_CAR_TYPES,
  POINT_TO_POINT_CARS,
  POINT_TO_POINT_PASSENGERS,
} from "../../data/quickBookServices.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

// The pieces the four Quickly Book step-two forms (Point-To-Point, Hourly,
// Airport Transfer, City Tour) have in common, in the booking-card look of
// common/BookingFields.jsx.

// The page section and card (at most 880px wide, centred) with the form's
// title and hairline; the fields go inside as `children`.
export function ServiceFormShell({ cardRef, title, onSubmit, children }) {
  return (
    <section className="font-display px-6 md:px-10 lg:px-[50px] mt-[44px] mb-[120px] max-md:mt-6 max-md:mb-16">
      <div
        ref={cardRef}
        className={`${BOOKING_CARD} mx-auto max-w-[880px] lg:px-10`}
      >
        <h2 className={BOOKING_TITLE}>{title}</h2>
        <BookingHairline />

        <form onSubmit={onSubmit} noValidate className={BOOKING_FIELDS}>
          {children}
        </form>
      </div>
    </section>
  );
}

// Car type, car and passengers: three lists in one row. `group` is the
// service's translation group (its labels are quickBook.<group>.carType...).
export function CarChoiceRow({ control, group }) {
  const { t } = useTranslation();
  const options = (keys, name) =>
    keys.map((value) => ({
      value,
      label: t(`quickBook.pointToPoint.${name}.${value}`),
    }));
  const passengerOptions = POINT_TO_POINT_PASSENGERS.map((value) => ({
    value,
    label: value,
  }));

  return (
    <div className={BOOKING_THREE_COLUMNS}>
      <ControlledField
        control={control}
        name="carType"
        as={BookingSelect}
        icon={Car}
        label={t(`quickBook.${group}.carType`)}
        placeholder={t("formPlaceholders.select")}
        options={options(POINT_TO_POINT_CAR_TYPES, "carTypes")}
      />
      <ControlledField
        control={control}
        name="car"
        as={BookingSelect}
        icon={CarFront}
        label={t(`quickBook.${group}.car`)}
        placeholder={t("formPlaceholders.select")}
        options={options(POINT_TO_POINT_CARS, "cars")}
      />
      <ControlledField
        control={control}
        name="passengers"
        as={BookingSelect}
        icon={Users}
        label={t(`quickBook.${group}.passengers`)}
        placeholder={t("formPlaceholders.select")}
        options={passengerOptions}
      />
    </div>
  );
}

// The "Confirm Booking" button, centred. A drawn tick replaces its
// label for a moment once the booking is sent (`sentFlash`); the label keeps
// the button's size meanwhile, and the success note hangs below the button
// outside the flow.
export function ConfirmRow({ status, sentFlash, label }) {
  const { t } = useTranslation();
  return (
    <div className="relative flex justify-center">
      <BookingButton
        type="submit"
        className="px-12 max-md:w-full"
        disabled={status === SUBMIT_STATUS.SUBMITTING}
      >
        <span className={sentFlash ? "invisible" : undefined}>
          {status === SUBMIT_STATUS.SUBMITTING ? t("booking.sending") : label}
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
  );
}
