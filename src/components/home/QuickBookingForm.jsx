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
    labelClassName: "!text-fg text-[16px] font-medium mb-2",
    inputClassName:
      "!border-line/50 !font-display !font-semibold !text-[20px] !leading-[100%] !tracking-[0%] capitalize placeholder:text-fg",
  };

  return (
    <section className="relative overflow-hidden font-display min-h-[1098px]">

      {/* Background Images */}
     <div className="absolute inset-0 pointer-events-none z-0">

  {/* Smoke 1 */}
  <img
    src={smoke}
    alt=""
    className="absolute left-0 top-0 w-[1440px] h-[1098px]"
    style={{ opacity: 0.3 }}
  />

  {/* Smoke 2 */}
  <img
    src={smoke}
    alt=""
    className="absolute left-0 top-[564px] w-[765px] h-[594px] rotate-180"
    style={{ opacity: 0.3 }}
  />

  {/* Smoke 3 */}
  <img
    src={smoke}
    alt=""
    className="absolute left-[765px] top-[564px] w-[675px] h-[594px] rotate-180"
    style={{ opacity: 0.3 }}
  />

  {/* Car */}
  <img
    src={Car}
    alt=""
    className="absolute left-[30px] top-[492px] w-[646px] h-[585px]"
  />

</div>

      {/* Booking Form */}
      <div className="absolute z-10 top-[100px] left-[765px] w-[590px] h-[852px] rounded-[25px] bg-[#0000004D] backdrop-blur-[20px] px-[45px] py-[45px] flex flex-col">
        <div className="relative">

          <h2 className="text-[25px] font-semibold text-teal-accent text-center mb-[40px]">
            Book Your Luxury Car Now
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="flex flex-col gap-[36px]">

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
                name="date"
                as={DatePicker}
                placeholder="Select Date"
              />

              <ControlledField
                control={control}
                name="time"
                as={TimePicker}
                placeholder="Select Time"
              />

              <ControlledField
                control={control}
                name="dropOffLocation"
                as={TextField}
                placeholder="Drop Off Location"
                {...fieldProps}
              />

            </div>

            <div className="mt-[140px] flex flex-col items-center gap-2">

              <OutlineButton
                type="submit"
                className="!w-[153px] !h-[55px] !rounded-[10px] !border-line !text-fg"
                disabled={status === SUBMIT_STATUS.SUBMITTING}
              >
                {status === SUBMIT_STATUS.SUBMITTING
                  ? "Sending..."
                  : "Send"}
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