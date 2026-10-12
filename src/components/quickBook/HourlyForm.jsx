import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock, Hourglass, MapPin, Plus } from "lucide-react";
import ControlledField from "../common/ControlledField.jsx";
import DatePicker from "../common/DatePicker.jsx";
import TimePicker from "../common/TimePicker.jsx";
import useFormReveal from "../common/useFormReveal.js";
import {
  BOOKING_THREE_COLUMNS,
  BOOKING_TWO_COLUMNS,
  BookingButton,
  BookingCheckbox,
  BookingInput,
  BookingPicker,
  BookingTextArea,
  OptionalField,
} from "../common/BookingFields.jsx";
import {
  CarChoiceRow,
  ConfirmRow,
  ServiceFormShell,
} from "./ServiceFormParts.jsx";
import { hourlySchema } from "../../schemas/formSchemas.js";
import { sanitizePhone } from "../../utils/validators.js";
import {
  submitBooking,
  resetBookingStatus,
  selectBookingStatus,
} from "../../store/bookingSlice.js";

const SENT_FLASH_MS = 1800;
const MAX_STOPS = 6;

// Small tablets (768-1023px): the fields flow into one two-column grid (the
// wrappers around them dissolve: md:max-lg:contents) - pickup and date, start
// time and hours, car type and car, then Passengers with the "specific stops"
// tick box beside it - so each row holds two with none left alone. The stop
// fields, the notes and the button take full rows.
const TABLET_FORM =
  "md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-x-[var(--col-gap,5.5rem)] md:max-lg:gap-y-[var(--field-gap,1.25rem)]";

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

// "Book Your Hourly Chauffeur Service": step two for the Hourly service, in
// the booking-card look shared with the other forms (common/BookingFields.jsx,
// quickBook/ServiceFormParts.jsx): pickup / date, start time / number of
// hours, three lists (car type, car, passengers), the "specific stops" tick
// box - ticking it reveals the stop fields (two to start, "Add Stop" for
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

  const { control, handleSubmit, reset } = useForm({
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

  return (
    <ServiceFormShell
      cardRef={cardRef}
      title={t("quickBook.hourly.title")}
      onSubmit={handleSubmit(onSubmit)}
      formClassName={TABLET_FORM}
    >
      <div className={`${BOOKING_TWO_COLUMNS} md:max-lg:contents`}>
        <ControlledField
          control={control}
          name="pickupLocation"
          as={BookingInput}
          icon={MapPin}
          label={t("quickBook.hourly.pickupLocation")}
          placeholder={t("booking.locationPlaceholder")}
          required
        />
        <ControlledField
          control={control}
          name="date"
          as={BookingPicker}
          picker={DatePicker}
          icon={CalendarDays}
          label={t("quickBook.hourly.date")}
          placeholder={t("booking.datePlaceholder")}
        />
        <ControlledField
          control={control}
          name="startTime"
          as={BookingPicker}
          picker={TimePicker}
          icon={Clock}
          label={t("quickBook.hourly.startTime")}
          placeholder={t("booking.timePlaceholder")}
        />
        <ControlledField
          control={control}
          name="hours"
          as={BookingInput}
          type="text"
          inputMode="numeric"
          transform={sanitizePhone}
          icon={Hourglass}
          label={t("quickBook.hourly.hours")}
          placeholder={t("formPlaceholders.hours")}
        />
      </div>

      <CarChoiceRow
        control={control}
        group="hourly"
        className="md:max-lg:contents"
      />

      {/* Tablets: beside Passengers, level with its box */}
      <div className="md:max-lg:flex md:max-lg:items-end md:max-lg:min-h-[var(--box-h,2.5rem)] md:max-lg:self-end">
        <ControlledField
          control={control}
          name="hasStops"
          as={BookingCheckbox}
          label={t("quickBook.hourly.stopsQuestion")}
        />
      </div>

      {hasStops ? (
        <div className={`${BOOKING_THREE_COLUMNS} md:max-lg:col-span-2`}>
          {stopFields.map((field, index) => (
            <ControlledField
              key={field.id}
              control={control}
              name={`stops.${index}.location`}
              as={BookingInput}
              icon={MapPin}
              label={t("quickBook.hourly.stop", { number: index + 1 })}
              placeholder={t("quickBook.hourly.enterLocation")}
            />
          ))}
          {stopFields.length < MAX_STOPS ? (
            <div className="flex items-end max-md:justify-start">
              <BookingButton
                variant="soft"
                type="button"
                onClick={() => append({ location: "" })}
                className="!h-[var(--box-h,2.5rem)] px-5 !text-base"
              >
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                {t("quickBook.hourly.addStop")}
              </BookingButton>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="md:max-lg:col-span-2">
        <OptionalField label={t("formPlaceholders.addNote")}>
          <ControlledField
            control={control}
            name="notes"
            as={BookingTextArea}
            label={t("quickBook.hourly.notes")}
            placeholder={t("formPlaceholders.message")}
          />
        </OptionalField>
      </div>

      <div className="md:max-lg:col-span-2">
        <ConfirmRow
          status={status}
          sentFlash={sentFlash}
          label={t("quickBook.hourly.confirm")}
        />
      </div>
    </ServiceFormShell>
  );
}
