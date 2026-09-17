import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../common/TextField.jsx";
import OutlineButton from "../common/OutlineButton.jsx";
import ControlledField from "../common/ControlledField.jsx";
import TimePicker from "../common/TimePicker.jsx";
import DatePicker from "../common/DatePicker.jsx";
import { bookingSchema } from "../../schemas/formSchemas.js";
import { sanitizeName, sanitizePhone } from "../../utils/validators.js";
import {
  submitBooking,
  resetBookingStatus,
  selectBookingStatus,
} from "../../store/bookingSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";
import Car from "../../assets/car2.png";
import smoke from "../../assets/smoke-bg.png";

const defaultValues = {
  name: "",
  phone: "",
  location: "",
  date: "",
  time: "",
  dropOffLocation: "",
};

export default function QuickBookingForm() {
  const dispatch = useDispatch();
  const status = useSelector(selectBookingStatus);
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetBookingStatus());
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(submitBooking(values)).unwrap();
      reset(defaultValues);
    } catch {
      // status is set to "error" by the slice
    }
  };

  const fieldProps = {
    labelClassName: "!text-white text-[16px] font-medium mb-2",
    inputClassName:
      "!border-white !font-display !font-semibold !text-[22px] !leading-[100%] !tracking-[0%] capitalize placeholder:text-white",
  };

  return (
    <section className="relative overflow-hidden border-t border-white/5 font-display">
      {/* Background Images */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Smoke 1 */}
        <img
          src={smoke}
          alt=""
          className="absolute left-0 top-0 w-[1550px] h-[1098px]"
          style={{ opacity: 0.3 }}
        />

        {/* Smoke 2 */}
        <img
          src={smoke}
          alt=""
          className="absolute left-0 top-[564px] w-[765px] h-[594px] rotate-180"
          style={{ opacity: 0.14 }}
        />

        {/* Car2 */}
        <img
          src={Car}
          alt=""
          className="absolute left-[30px] top-[492px] w-[646px] h-[585px]"
        />
        <img
          src={smoke}
          alt=""
          className="absolute left-0 top-[560px] w-[760px] h-[594px] object-fill rotate-180 z-30"
          style={{ opacity: 0.14 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        {/* Left side */}
        <div className="order-2 md:order-1"></div>

        {/* Booking Form */}
        <div className="order-1 md:order-2 w-[590px] h-[852px] rounded-[25px] bg-black/30 backdrop-blur-[18.5px] px-[45px] py-[45px] flex flex-col">
          <h2 className="text-[24px] font-medium text-teal-accent text-center mb-[40px]">
            Book Your Luxury Car Now
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-1 flex-col"
          >
            <div className="flex flex-1 flex-col justify-between">
              <ControlledField
                control={control}
                name="name"
                as={TextField}
                transform={sanitizeName}
                placeholder="Name"
                {...fieldProps}
              />

              <ControlledField
                control={control}
                name="phone"
                as={TextField}
                transform={sanitizePhone}
                type="tel"
                placeholder="Phone"
                {...fieldProps}
              />

              <ControlledField
                control={control}
                name="location"
                as={TextField}
                placeholder="Choose Location"
                {...fieldProps}
              />

              <ControlledField
                control={control}
                name="time"
                as={TimePicker}
                placeholder="Select Time"
              />

              <ControlledField
                control={control}
                name="date"
                as={DatePicker}
                placeholder="Select Date"
              />
            </div>

            <div className="mt-[40px] flex flex-col items-center gap-2">
              <OutlineButton
                type="submit"
                className="!w-[153px] !h-[62px] !rounded-[10px] !border-white !text-white"
                disabled={status === SUBMIT_STATUS.SUBMITTING}
              >
                {status === SUBMIT_STATUS.SUBMITTING ? "Sending..." : "Send"}
              </OutlineButton>

              {status === SUBMIT_STATUS.SUCCESS ? (
                <p className="text-xs text-teal-accent">
                  Thanks! We received your request.
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
