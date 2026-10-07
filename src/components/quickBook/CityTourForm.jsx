import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
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
} from "../common/formStyles.js";
import DurationSelect from "../carDetails/DurationSelect.jsx";
import { fieldProps, pickerProps } from "./quickBookStyles.js";
import { cityTourSchema } from "../../schemas/formSchemas.js";
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
  city: "",
  date: "",
  startTime: "",
  duration: "",
  carType: "",
  car: "",
  passengers: "",
  places: "",
  notes: "",
};

// Both text boxes (places to visit, optional notes) share the reservation
// form's message box look; "Places To Visit" is the shorter one.
const BOX_CLASS = "w-[1195px] ms-[6px] max-lg:w-full max-lg:ms-0";
const BOX_LABEL =
  "font-display font-medium text-[22px] leading-[27px] capitalize text-fg mb-[10px] max-md:text-[17px] max-md:leading-snug max-md:mb-3";
const BOX_TEXTAREA =
  "!block !rounded-[10px] !border-[0.5px] !border-white/60 !p-4 !text-[18px] focus:!border-teal-accent max-md:!text-[15px]";

// "Book Your City Tour Experience": step two for the City Tour service, laid
// out like the car reservation form: city / date, start time / duration,
// three dropdowns (car type, car, passengers), the "places to visit" box, the
// optional notes and "Confirm Booking". `details` are the first step's
// values, sent along with this form's.
export default function CityTourForm({ details }) {
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
    resolver: zodResolver(cityTourSchema(t)),
    defaultValues,
  });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetBookingStatus());
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(
        submitBooking({ type: "quick-book", ...details, ...values })
      ).unwrap();
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
          {t("quickBook.cityTour.title")}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-[49px] flex flex-col gap-y-[62px] max-md:mt-12 max-md:gap-y-[38px]"
        >
          <div className={twoColumns}>
            <ControlledField
              control={control}
              name="city"
              as={TextField}
              placeholder={t("quickBook.cityTour.city")}
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="date"
              as={DatePicker}
              placeholder={t("quickBook.cityTour.date")}
              {...pickerProps}
            />
            <ControlledField
              control={control}
              name="startTime"
              as={TimePicker}
              placeholder={t("quickBook.cityTour.startTime")}
              {...pickerProps}
            />
            <ControlledField
              control={control}
              name="duration"
              as={TextField}
              placeholder={t("quickBook.cityTour.duration")}
              {...fieldProps}
            />
          </div>

          <div className={threeColumns}>
            <ControlledField
              control={control}
              name="carType"
              as={DurationSelect}
              placeholder={t("quickBook.cityTour.carType")}
              {...pickerProps}
              options={carTypeOptions}
            />
            <ControlledField
              control={control}
              name="car"
              as={DurationSelect}
              placeholder={t("quickBook.cityTour.car")}
              {...pickerProps}
              options={carOptions}
            />
            <ControlledField
              control={control}
              name="passengers"
              as={DurationSelect}
              placeholder={t("quickBook.cityTour.passengers")}
              {...pickerProps}
              options={passengerOptions}
            />
          </div>

          <ControlledField
            control={control}
            name="places"
            as={TextAreaField}
            label={t("quickBook.cityTour.places")}
            labelClassName={BOX_LABEL}
            className={BOX_CLASS}
            textareaClassName={`${BOX_TEXTAREA} !h-[85px] max-md:!h-[85px]`}
          />

          <ControlledField
            control={control}
            name="notes"
            as={TextAreaField}
            label={t("quickBook.cityTour.notes")}
            labelClassName={BOX_LABEL}
            className={BOX_CLASS}
            textareaClassName={`${BOX_TEXTAREA} !h-[161px] max-md:!h-[140px]`}
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
                  : t("quickBook.cityTour.confirm")}
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
