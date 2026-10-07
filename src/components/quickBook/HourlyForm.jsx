import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import checkDark from "../../assets/check-dark.svg";
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
} from "../common/formStyles.js";
import DurationSelect from "../carDetails/DurationSelect.jsx";
import { FIELD, fieldProps, pickerProps } from "./quickBookStyles.js";
import { hourlySchema } from "../../schemas/formSchemas.js";
import { sanitizePhone } from "../../utils/validators.js";
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
const MAX_STOPS = 6;

const defaultValues = {
  pickupLocation: "",
  date: "",
  startTime: "",
  hours: "",
  carType: "",
  car: "",
  passengers: "",
  hasStops: false,
  stops: [{ location: "" }, { location: "" }],
  notes: "",
};

// The white tick box ending the "specific stops" line (Figma: a white square;
// ticked it shows the dark check, assets/check-dark.svg: 21.5 x 19.1, 2px in
// and 3px down, in a 26px box).
const STOPS_BOX =
  "peer appearance-none h-[26px] w-[26px] shrink-0 cursor-pointer rounded-[4px] bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

// "Book Your Hourly Chauffeur Service": step two for the Hourly service, laid
// out like the car reservation form: pickup / date, start time / number of
// hours, three dropdowns (car type, car, passengers), the "specific stops"
// line - ticking it reveals the stop fields (two to start, "Add Stop" for
// more) - then the optional notes and "Confirm Booking". `details` are the
// first step's values, sent along with this form's.
export default function HourlyForm({ details }) {
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

  const { control, register, handleSubmit, reset } = useForm({
    resolver: zodResolver(hourlySchema(t)),
    defaultValues,
  });
  const { fields: stopFields, append } = useFieldArray({
    control,
    name: "stops",
  });
  const hasStops = useWatch({ control, name: "hasStops" });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetBookingStatus());
  }, [dispatch]);

  const onSubmit = async ({ stops, ...values }) => {
    const payload = {
      type: "quick-book",
      ...details,
      ...values,
      // Only the stops that were ticked on and filled in
      stops: values.hasStops
        ? stops.map((stop) => stop.location.trim()).filter(Boolean)
        : [],
    };
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

  const twoColumns =
    "grid grid-cols-2 gap-x-[252px] gap-y-[62px] max-lg:gap-x-12 max-md:grid-cols-1 max-md:gap-y-[38px]";
  const threeColumns =
    "grid grid-cols-3 gap-x-[62px] gap-y-[62px] max-lg:gap-x-8 max-md:grid-cols-1 max-md:gap-y-[38px]";

  return (
    <section className="font-display px-[47px] mt-[44px] mb-[120px] max-md:px-6 max-md:mt-6 max-md:mb-16">
      <div
        ref={cardRef}
        className={`${FORM_CARD} ${FORM_CARD_DARK_IN_LIGHT} pb-[58px]`}
      >
        <h2 className={`${FORM_TITLE} !leading-[100%] light:!text-white`}>
          {t("quickBook.hourly.title")}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-[49px] flex flex-col gap-y-[62px] max-md:mt-12 max-md:gap-y-[38px]"
        >
          <div className={twoColumns}>
            <ControlledField
              control={control}
              name="pickupLocation"
              as={TextField}
              placeholder={t("quickBook.hourly.pickupLocation")}
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="date"
              as={DatePicker}
              placeholder={t("quickBook.hourly.date")}
              {...pickerProps}
            />
            <ControlledField
              control={control}
              name="startTime"
              as={TimePicker}
              placeholder={t("quickBook.hourly.startTime")}
              {...pickerProps}
            />
            <ControlledField
              control={control}
              name="hours"
              as={TextField}
              type="text"
              inputMode="numeric"
              transform={sanitizePhone}
              placeholder={t("quickBook.hourly.hours")}
              {...fieldProps}
            />
          </div>

          <div className={threeColumns}>
            <ControlledField
              control={control}
              name="carType"
              as={DurationSelect}
              placeholder={t("quickBook.hourly.carType")}
              {...pickerProps}
              options={carTypeOptions}
            />
            <ControlledField
              control={control}
              name="car"
              as={DurationSelect}
              placeholder={t("quickBook.hourly.car")}
              {...pickerProps}
              options={carOptions}
            />
            <ControlledField
              control={control}
              name="passengers"
              as={DurationSelect}
              placeholder={t("quickBook.hourly.passengers")}
              {...pickerProps}
              options={passengerOptions}
            />
          </div>

          {/* The question rests on a line like the fields, the white box at
              its end */}
          <label className="flex h-[37px] cursor-pointer items-end justify-between gap-4 border-b-[0.5px] border-white/35 pb-[10px]">
            <span className="font-display font-medium text-[22px] leading-[27px] text-fg capitalize max-md:text-[17px] max-md:leading-snug">
              {t("quickBook.hourly.stopsQuestion")}
            </span>
            <span className="relative flex h-[26px] w-[26px] shrink-0">
              <input
                type="checkbox"
                {...register("hasStops")}
                className={STOPS_BOX}
              />
              <img
                src={checkDark}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-[2px] top-[3px] h-[19.09px] w-[21.51px] opacity-0 transition-opacity peer-checked:opacity-100"
              />
            </span>
          </label>

          {/* Figma: the stops row sits 65px under the line above (the others 62) */}
          {hasStops ? (
            <div className={`${threeColumns} mt-[3px] max-md:mt-0`}>
              {stopFields.map((field, index) => (
                <Controller
                  key={field.id}
                  control={control}
                  name={`stops.${index}.location`}
                  render={({ field: input }) => (
                    <label className="block">
                      <span className="block text-[14px] leading-[17px] text-fg max-md:text-[13px]">
                        {t("quickBook.hourly.stop", { number: index + 1 })}
                      </span>
                      <input
                        {...input}
                        placeholder={t("quickBook.hourly.enterLocation")}
                        className={`mt-[6px] w-full bg-transparent outline-none text-fg placeholder:text-fg capitalize ${FIELD}`}
                      />
                    </label>
                  )}
                />
              ))}
              {stopFields.length < MAX_STOPS ? (
                <div className="col-start-3 flex items-end justify-end max-lg:col-start-auto max-md:justify-start">
                  <HollowButton
                    onDark
                    type="button"
                    onClick={() => append({ location: "" })}
                    className="!h-[56px] !w-[215px] !gap-[20px] !rounded-[10px] !border-[0.5px] !border-[#F9F9F9] !p-0 !text-[22px] !leading-[27px] max-md:!h-[48px] max-md:!w-auto max-md:!px-6 max-md:!text-[18px]"
                  >
                    <svg
                      width="20.56"
                      height="20.56"
                      viewBox="0 0 20.56 20.56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M10.28 0v20.56M0 10.28h20.56" />
                    </svg>
                    {/* Medium, unlike the hollow buttons' Semibold: its own span beats the
                      button's !font-semibold */}
                    <span className="font-medium">
                      {t("quickBook.hourly.addStop")}
                    </span>
                  </HollowButton>
                </div>
              ) : null}
            </div>
          ) : null}

          <ControlledField
            control={control}
            name="notes"
            as={TextAreaField}
            label={t("quickBook.hourly.notes")}
            labelClassName="font-display font-medium text-[22px] leading-[27px] capitalize text-fg mb-[10px] max-md:text-[17px] max-md:leading-snug max-md:mb-3"
            className="w-[1195px] ms-[6px] max-lg:w-full max-lg:ms-0"
            textareaClassName="!block !h-[161px] !rounded-[10px] !border-[0.5px] !border-white/60 !p-4 !text-[18px] focus:!border-teal-accent max-md:!h-[140px] max-md:!text-[15px]"
          />

          <div className="relative flex justify-center -mt-[3px] max-md:mt-0">
            <HollowButton
              onDark
              type="submit"
              className="!relative !px-[47px] !py-[13px] !text-[22px] !leading-[27px] max-md:!px-8 max-md:!py-3 max-md:!text-[18px]"
              disabled={status === SUBMIT_STATUS.SUBMITTING}
            >
              {/* The label keeps the button's size while the tick shows */}
              <span className={sentFlash ? "invisible" : undefined}>
                {status === SUBMIT_STATUS.SUBMITTING
                  ? t("booking.sending")
                  : t("quickBook.hourly.confirm")}
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
