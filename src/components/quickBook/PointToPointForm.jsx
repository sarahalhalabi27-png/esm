import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import ControlledField from "../common/ControlledField.jsx";
import DatePicker from "../common/DatePicker.jsx";
import TimePicker from "../common/TimePicker.jsx";
import useFormReveal from "../common/useFormReveal.js";
import {
  BOOKING_TWO_COLUMNS,
  BookingInput,
  BookingPicker,
  BookingTextArea,
  OptionalField,
  BOOKING_PAIR_COLUMNS,
} from "../common/BookingFields.jsx";
import {
  CarChoiceRow,
  ConfirmRow,
  ServiceFormShell,
} from "./ServiceFormParts.jsx";
import { pointToPointSchema } from "../../schemas/formSchemas.js";
import {
  submitBooking,
  resetBookingStatus,
  selectBookingStatus,
} from "../../store/bookingSlice.js";

const SENT_FLASH_MS = 1800;

// Small tablets (768-1023px): the fields flow into one two-column grid (the
// wrappers around them dissolve: md:max-lg:contents) - pickup and drop-off,
// date and time, car type and car, then Passengers with the notes beside it -
// so each row holds two with none left alone; the button takes a full row.
const TABLET_FORM =
  "md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-x-[var(--col-gap,5.5rem)] md:max-lg:gap-y-[var(--field-gap,1.25rem)]";

const defaultValues = {
  pickupLocation: "",
  dropOffLocation: "",
  date: "",
  time: "",
  carType: "",
  car: "",
  passengers: "",
  notes: "",
};

// "Book Your Point-To-Point Ride": step two for the Point-To-Point service, in
// the booking-card look shared with the other forms (common/BookingFields.jsx,
// quickBook/ServiceFormParts.jsx): pickup / drop-off, date / time, three lists
// (car type, car, passengers), the optional notes box and "Confirm Booking".
// `details` are the first step's values, sent along with this form's.
export default function PointToPointForm({ details }) {
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
    resolver: zodResolver(pointToPointSchema(t)),
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

  return (
    <ServiceFormShell
      cardRef={cardRef}
      title={t("quickBook.pointToPoint.title")}
      onSubmit={handleSubmit(onSubmit)}
      formClassName={TABLET_FORM}
    >
      <div className={`${BOOKING_TWO_COLUMNS} md:max-lg:contents`}>
        <ControlledField
          control={control}
          name="pickupLocation"
          as={BookingInput}
          icon={MapPin}
          label={t("quickBook.pointToPoint.pickupLocation")}
          placeholder={t("booking.locationPlaceholder")}
          required
        />
        <ControlledField
          control={control}
          name="dropOffLocation"
          as={BookingInput}
          icon={MapPin}
          label={t("quickBook.pointToPoint.dropOffLocation")}
          placeholder={t("booking.dropOffPlaceholder")}
          required
        />
      </div>

      <div className={`${BOOKING_PAIR_COLUMNS} md:max-lg:contents`}>
        <ControlledField
          control={control}
          name="date"
          as={BookingPicker}
          pair
          picker={DatePicker}
          icon={CalendarDays}
          label={t("quickBook.pointToPoint.date")}
          placeholder={t("booking.datePlaceholder")}
        />
        <ControlledField
          control={control}
          name="time"
          as={BookingPicker}
          pair
          picker={TimePicker}
          icon={Clock}
          label={t("quickBook.pointToPoint.time")}
          placeholder={t("booking.timePlaceholder")}
        />
      </div>

      <CarChoiceRow
        control={control}
        group="pointToPoint"
        className="md:max-lg:contents"
      />

      {/* Tablets: beside Passengers, as tall as that field */}
      <div className="md:max-lg:[&_textarea]:h-[var(--box-h,2.5rem)] md:max-lg:[&_textarea]:py-2">
        <OptionalField label={t("formPlaceholders.addNote")}>
          <ControlledField
            control={control}
            name="notes"
            as={BookingTextArea}
            label={t("quickBook.pointToPoint.notes")}
            placeholder={t("formPlaceholders.message")}
          />
        </OptionalField>
      </div>

      <div className="md:max-lg:col-span-2">
        <ConfirmRow
          status={status}
          sentFlash={sentFlash}
          label={t("quickBook.pointToPoint.confirm")}
        />
      </div>
    </ServiceFormShell>
  );
}
