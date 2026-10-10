import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CalendarDays, Clock, Timer } from "lucide-react";
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
} from "../common/BookingFields.jsx";
import {
  CarChoiceRow,
  ConfirmRow,
  ServiceFormShell,
} from "./ServiceFormParts.jsx";
import { cityTourSchema } from "../../schemas/formSchemas.js";
import {
  submitBooking,
  resetBookingStatus,
  selectBookingStatus,
} from "../../store/bookingSlice.js";

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

// "Book Your City Tour Experience": step two for the City Tour service, in
// the booking-card look shared with the other forms (common/BookingFields.jsx,
// quickBook/ServiceFormParts.jsx): city / date, start time / duration, three
// lists (car type, car, passengers), the "places to visit" box, the optional
// notes and "Confirm Booking". `details` are the first step's values, sent
// along with this form's.
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

  return (
    <ServiceFormShell
      cardRef={cardRef}
      title={t("quickBook.cityTour.title")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={BOOKING_TWO_COLUMNS}>
        <ControlledField
          control={control}
          name="city"
          as={BookingInput}
          icon={Building2}
          label={t("quickBook.cityTour.city")}
          placeholder={t("formPlaceholders.city")}
          required
        />
        <ControlledField
          control={control}
          name="date"
          as={BookingPicker}
          picker={DatePicker}
          icon={CalendarDays}
          label={t("quickBook.cityTour.date")}
          placeholder={t("booking.datePlaceholder")}
        />
        <ControlledField
          control={control}
          name="startTime"
          as={BookingPicker}
          picker={TimePicker}
          icon={Clock}
          label={t("quickBook.cityTour.startTime")}
          placeholder={t("booking.timePlaceholder")}
        />
        <ControlledField
          control={control}
          name="duration"
          as={BookingInput}
          icon={Timer}
          label={t("quickBook.cityTour.duration")}
          placeholder={t("formPlaceholders.duration")}
        />
      </div>

      <CarChoiceRow control={control} group="cityTour" />

      <ControlledField
        control={control}
        name="places"
        as={BookingTextArea}
        label={t("quickBook.cityTour.places")}
        placeholder={t("formPlaceholders.places")}
      />

      <OptionalField label={t("formPlaceholders.addNote")}>
        <ControlledField
          control={control}
          name="notes"
          as={BookingTextArea}
          label={t("quickBook.cityTour.notes")}
          placeholder={t("formPlaceholders.message")}
        />
      </OptionalField>

      <ConfirmRow
        status={status}
        sentFlash={sentFlash}
        label={t("quickBook.cityTour.confirm")}
      />
    </ServiceFormShell>
  );
}
