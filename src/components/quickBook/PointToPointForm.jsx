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
    >
      <div className={BOOKING_TWO_COLUMNS}>
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

      <div className={BOOKING_PAIR_COLUMNS}>
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

      <CarChoiceRow control={control} group="pointToPoint" />

      <OptionalField label={t("formPlaceholders.addNote")}>
        <ControlledField
          control={control}
          name="notes"
          as={BookingTextArea}
          label={t("quickBook.pointToPoint.notes")}
          placeholder={t("formPlaceholders.message")}
        />
      </OptionalField>

      <ConfirmRow
        status={status}
        sentFlash={sentFlash}
        label={t("quickBook.pointToPoint.confirm")}
      />
    </ServiceFormShell>
  );
}
