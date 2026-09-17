import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../common/TextField.jsx";
import SelectField from "../common/SelectField.jsx";
import TextAreaField from "../common/TextAreaField.jsx";
import PrimaryButton from "../common/PrimaryButton.jsx";
import ControlledField from "../common/ControlledField.jsx";
import { reservationSchema } from "../../schemas/formSchemas.js";
import { sanitizeName, sanitizePhone } from "../../utils/validators.js";
import {
  submitBooking,
  resetBookingStatus,
  selectBookingStatus,
} from "../../store/bookingSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

const bookingDurations = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bookingDuration: "hourly",
  pickUpDate: "",
  pickUpTime: "",
  dropOffDate: "",
  dropOffTime: "",
  message: "",
};

export default function CarReservationForm({ car }) {
  const dispatch = useDispatch();
  const status = useSelector(selectBookingStatus);
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues,
  });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetBookingStatus());
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(submitBooking({ carId: car.id, ...values })).unwrap();
      reset(defaultValues);
    } catch {
      // status is set to "error" by the slice
    }
  };

  return (
    <section>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <h2 className="text-center text-lg font-medium text-teal-accent mb-6">
            Reserve Your Luxury Ride Today!
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <ControlledField
                control={control}
                name="firstName"
                as={TextField}
                transform={sanitizeName}
                label="First Name"
              />
              <ControlledField
                control={control}
                name="lastName"
                as={TextField}
                transform={sanitizeName}
                label="Last Name"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <ControlledField
                control={control}
                name="email"
                as={TextField}
                label="Email"
                type="email"
              />
              <ControlledField
                control={control}
                name="phone"
                as={TextField}
                transform={sanitizePhone}
                label="Phone"
                type="tel"
              />
            </div>
            <ControlledField
              control={control}
              name="bookingDuration"
              as={SelectField}
              label="Booking Duration"
              options={bookingDurations}
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <ControlledField
                control={control}
                name="pickUpDate"
                as={TextField}
                label="Pick Up Date"
                type="date"
              />
              <ControlledField
                control={control}
                name="pickUpTime"
                as={TextField}
                label="Pick Up Time"
                type="time"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <ControlledField
                control={control}
                name="dropOffDate"
                as={TextField}
                label="Drop Off Date"
                type="date"
              />
              <ControlledField
                control={control}
                name="dropOffTime"
                as={TextField}
                label="Drop Off Time"
                type="time"
              />
            </div>
            <ControlledField
              control={control}
              name="message"
              as={TextAreaField}
              label="Message"
            />
            <PrimaryButton
              type="submit"
              className="w-full"
              disabled={status === SUBMIT_STATUS.SUBMITTING}
            >
              {status === SUBMIT_STATUS.SUBMITTING ? "Sending..." : "Book Now"}
            </PrimaryButton>
            {status === SUBMIT_STATUS.SUCCESS ? (
              <p className="text-xs text-teal-accent text-center">
                Reservation request sent.
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
