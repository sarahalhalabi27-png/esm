import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../common/TextField.jsx";
import TextAreaField from "../common/TextAreaField.jsx";
import HollowButton from "../common/HollowButton.jsx";
import ControlledField from "../common/ControlledField.jsx";
import DatePicker from "../common/DatePicker.jsx";
import TimePicker from "../common/TimePicker.jsx";
import DrawnCheck from "../common/DrawnCheck.jsx";
import useFormReveal from "../common/useFormReveal.js";
import {
  FORM_CARD,
  FORM_CARD_DARK_IN_LIGHT,
  FORM_TITLE,
  SUBMIT_BUTTON,
} from "../common/formStyles.js";
import DurationSelect from "../carDetails/DurationSelect.jsx";
import { fieldProps, pickerProps } from "./quickBookStyles.js";
import { airportTransferSchema } from "../../schemas/formSchemas.js";
import {
  POINT_TO_POINT_CAR_TYPES,
  POINT_TO_POINT_CARS,
  POINT_TO_POINT_PASSENGERS,
} from "../../data/quickBookServices.js";
import {
  submitBooking,
  resetBookingStatus,
  selectBookingStatus,
} from "../../store/bookingSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

const SENT_FLASH_MS = 1800;

const defaultValues = {
  transferType: "",
  date: "",
  airport: "",
  flightNumber: "",
  flightTime: "",
  arrivalTime: "",
  pickupTime: "",
  dropOffLocation: "",
  pickupLocation: "",
  carType: "",
  car: "",
  passengers: "",
  notes: "",
};

// The fields under "Airport" once a transfer type is picked: [name, kind],
// two per row. To the airport: flight number, arrival time, drop-off; from
// it: flight time, pickup time, pickup location (Figma).
const TYPE_FIELDS = {
  toAirport: [
    ["airport", "text"],
    ["flightNumber", "text"],
    ["arrivalTime", "time"],
    ["dropOffLocation", "text"],
  ],
  fromAirport: [
    ["airport", "text"],
    ["flightTime", "time"],
    ["pickupTime", "time"],
    ["pickupLocation", "text"],
  ],
};

const TRANSFER_TYPES = ["toAirport", "fromAirport"];

// "Select Transfer Type:" radio: a teal ring, with a filled dot when picked.
function TransferTypeRadio({ value, onChange, name, options }) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-x-[150px] gap-y-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2 font-display text-[18px] font-medium leading-[27px] text-fg max-md:text-base"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="relative h-5 w-5 shrink-0 rounded-full border-[1.5px] border-teal-accent after:absolute after:inset-[3px] after:rounded-full after:bg-teal-accent after:opacity-0 after:transition-opacity peer-checked:after:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white/80"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

// "Book Your Airport Transfer": step two for the Airport Transfer service,
// laid out like the car reservation form. The transfer type (to / from the
// airport) with the date beside it, then - once a type is picked - its own
// four fields (airport, flight number or time, arrival or pickup time,
// drop-off or pickup location), three dropdowns (car type, car, passengers),
// the optional notes and "Confirm Booking". `details` are the first step's
// values, sent along with this form's.
export default function AirportTransferForm({ details }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const status = useSelector(selectBookingStatus);
  const cardRef = useFormReveal(i18n.dir() === "rtl");
  // Briefly show a drawn tick in the button once the booking is sent.
  const [sentFlash, setSentFlash] = useState(false);
  useEffect(() => {
    if (!sentFlash) return undefined;
    const timer = setTimeout(() => setSentFlash(false), SENT_FLASH_MS);
    return () => clearTimeout(timer);
  }, [sentFlash]);

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(airportTransferSchema(t)),
    defaultValues,
  });
  const transferType = useWatch({ control, name: "transferType" });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetBookingStatus());
  }, [dispatch]);

  const onSubmit = async (values) => {
    // Keep only the fields of the picked transfer type
    const shown = new Set(TYPE_FIELDS[values.transferType].map(([n]) => n));
    const payload = { type: "quick-book", ...details };
    for (const [key, value] of Object.entries(values)) {
      const isTypeField = Object.values(TYPE_FIELDS).some((list) =>
        list.some(([name]) => name === key)
      );
      if (!isTypeField || shown.has(key)) payload[key] = value;
    }
    try {
      await dispatch(submitBooking(payload)).unwrap();
      reset(defaultValues);
      setSentFlash(true);
    } catch {
      // status is set to "error" by the slice
    }
  };

  const options = (keys, group) =>
    keys.map((value) => ({
      value,
      label: t(`quickBook.pointToPoint.${group}.${value}`),
    }));
  const carTypeOptions = options(POINT_TO_POINT_CAR_TYPES, "carTypes");
  const carOptions = options(POINT_TO_POINT_CARS, "cars");
  const passengerOptions = POINT_TO_POINT_PASSENGERS.map((value) => ({
    value,
    label: value,
  }));
  const transferOptions = TRANSFER_TYPES.map((value) => ({
    value,
    label: t(`quickBook.airportTransfer.${value}`),
  }));

  const twoColumns =
    "grid grid-cols-2 gap-x-[252px] gap-y-[62px] max-lg:gap-x-12 max-md:grid-cols-1 max-md:gap-y-[38px]";
  const threeColumns =
    "grid grid-cols-3 gap-x-[62px] gap-y-[62px] max-lg:gap-x-8 max-md:grid-cols-1 max-md:gap-y-[38px]";

  const renderField = ([name, kind]) => (
    <ControlledField
      key={name}
      control={control}
      name={name}
      as={kind === "time" ? TimePicker : TextField}
      placeholder={t(`quickBook.airportTransfer.${name}`)}
      {...(kind === "time" ? pickerProps : fieldProps)}
    />
  );

  return (
    <section className="font-display px-[47px] mt-[44px] mb-[120px] max-md:px-6 max-md:mt-6 max-md:mb-16">
      <div
        ref={cardRef}
        className={`${FORM_CARD} ${FORM_CARD_DARK_IN_LIGHT} md:!pt-[42px] pb-[58px]`}
      >
        <h2 className={`${FORM_TITLE} !leading-[100%] light:!text-white`}>
          {t("quickBook.airportTransfer.title")}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-[49px] flex flex-col gap-y-[62px] max-md:mt-12 max-md:gap-y-[38px]"
        >
          {/* The transfer type (its label above the radios) sits beside the
              date, the date on the radios' line */}
          <div className={`${twoColumns} items-end`}>
            <div>
              <p className="mb-[22px] font-display text-[18px] font-medium leading-[27px] text-fg max-md:text-base">
                {t("quickBook.airportTransfer.transferType")}
              </p>
              <ControlledField
                control={control}
                name="transferType"
                as={TransferTypeRadio}
                options={transferOptions}
              />
            </div>
            <ControlledField
              control={control}
              name="date"
              as={DatePicker}
              placeholder={t("quickBook.airportTransfer.date")}
              {...pickerProps}
            />
          </div>

          {transferType ? (
            <div className={twoColumns}>
              {TYPE_FIELDS[transferType].map(renderField)}
            </div>
          ) : null}

          <div className={threeColumns}>
            <ControlledField
              control={control}
              name="carType"
              as={DurationSelect}
              placeholder={t("quickBook.airportTransfer.carType")}
              {...pickerProps}
              options={carTypeOptions}
            />
            <ControlledField
              control={control}
              name="car"
              as={DurationSelect}
              placeholder={t("quickBook.airportTransfer.car")}
              {...pickerProps}
              options={carOptions}
            />
            <ControlledField
              control={control}
              name="passengers"
              as={DurationSelect}
              placeholder={t("quickBook.airportTransfer.passengers")}
              {...pickerProps}
              options={passengerOptions}
            />
          </div>

          <ControlledField
            control={control}
            name="notes"
            as={TextAreaField}
            label={t("quickBook.airportTransfer.notes")}
            labelClassName="font-display font-medium text-[18px] leading-[27px] capitalize text-fg mb-[10px] max-md:text-base max-md:leading-snug max-md:mb-3"
            className="w-full min-[1440px]:w-[1195px] ms-[6px] max-lg:ms-0"
            textareaClassName="!block !h-[161px] !rounded-[10px] !border-[0.5px] !border-white/60 !p-4 !text-[18px] focus:!border-teal-accent max-md:!h-[140px] max-md:!text-[15px]"
          />

          <div className="relative flex justify-center -mt-[3px] max-md:mt-0">
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
                  : t("quickBook.airportTransfer.confirm")}
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
