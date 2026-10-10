import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock, MapPin, Plane, Ticket } from "lucide-react";
import ControlledField from "../common/ControlledField.jsx";
import DatePicker from "../common/DatePicker.jsx";
import TimePicker from "../common/TimePicker.jsx";
import useFormReveal from "../common/useFormReveal.js";
import {
  BOOKING_TWO_COLUMNS,
  BookingInput,
  BookingPicker,
  BookingRadioGroup,
  BookingTextArea,
  OptionalField,
} from "../common/BookingFields.jsx";
import {
  CarChoiceRow,
  ConfirmRow,
  ServiceFormShell,
} from "./ServiceFormParts.jsx";
import { airportTransferSchema } from "../../schemas/formSchemas.js";
import {
  submitBooking,
  resetBookingStatus,
  selectBookingStatus,
} from "../../store/bookingSlice.js";

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
// it: flight time, pickup time, pickup location.
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

// Each of those fields' icon and the example shown inside it (translation key).
const FIELD_LOOK = {
  airport: { icon: Plane, placeholder: "formPlaceholders.airport" },
  flightNumber: { icon: Ticket, placeholder: "formPlaceholders.flightNumber" },
  arrivalTime: { icon: Clock, placeholder: "booking.timePlaceholder" },
  flightTime: { icon: Clock, placeholder: "booking.timePlaceholder" },
  pickupTime: { icon: Clock, placeholder: "booking.timePlaceholder" },
  dropOffLocation: { icon: MapPin, placeholder: "booking.dropOffPlaceholder" },
  pickupLocation: { icon: MapPin, placeholder: "booking.locationPlaceholder" },
};

const TRANSFER_TYPES = ["toAirport", "fromAirport"];

// "Book Your Airport Transfer": step two for the Airport Transfer service, in
// the booking-card look shared with the other forms (common/BookingFields.jsx,
// quickBook/ServiceFormParts.jsx). The transfer type (to / from the airport)
// with the date beside it, then - once a type is picked - its own four fields
// (airport, flight number or time, arrival or pickup time, drop-off or pickup
// location), three lists (car type, car, passengers), the optional notes and
// "Confirm Booking". `details` are the first step's values, sent along with
// this form's.
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

  const transferOptions = TRANSFER_TYPES.map((value) => ({
    value,
    label: t(`quickBook.airportTransfer.${value}`),
  }));

  const renderField = ([name, kind]) => {
    const { icon, placeholder } = FIELD_LOOK[name];
    return (
      <ControlledField
        key={name}
        control={control}
        name={name}
        as={kind === "time" ? BookingPicker : BookingInput}
        {...(kind === "time" ? { picker: TimePicker } : {})}
        icon={icon}
        label={t(`quickBook.airportTransfer.${name}`)}
        placeholder={t(placeholder)}
      />
    );
  };

  return (
    <ServiceFormShell
      cardRef={cardRef}
      title={t("quickBook.airportTransfer.title")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={BOOKING_TWO_COLUMNS}>
        <ControlledField
          control={control}
          name="transferType"
          as={BookingRadioGroup}
          label={t("quickBook.airportTransfer.transferType")}
          options={transferOptions}
          required
        />
        <ControlledField
          control={control}
          name="date"
          as={BookingPicker}
          picker={DatePicker}
          icon={CalendarDays}
          label={t("quickBook.airportTransfer.date")}
          placeholder={t("booking.datePlaceholder")}
        />
      </div>

      {transferType ? (
        <div className={BOOKING_TWO_COLUMNS}>
          {TYPE_FIELDS[transferType].map(renderField)}
        </div>
      ) : null}

      <CarChoiceRow control={control} group="airportTransfer" />

      <OptionalField label={t("formPlaceholders.addNote")}>
        <ControlledField
          control={control}
          name="notes"
          as={BookingTextArea}
          label={t("quickBook.airportTransfer.notes")}
          placeholder={t("formPlaceholders.message")}
        />
      </OptionalField>

      <ConfirmRow
        status={status}
        sentFlash={sentFlash}
        label={t("quickBook.airportTransfer.confirm")}
      />
    </ServiceFormShell>
  );
}
