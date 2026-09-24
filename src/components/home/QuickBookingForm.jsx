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
// Background car/smoke images are currently commented out below; re-add
// `import Car from "../../assets/car2.png"` and the smoke import when restoring them.

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
  <section className="relative overflow-hidden font-display -mt-[-20px] py-10 min-h-0 xl:py-0 xl:min-h-[1098px]">
<video
  className="absolute top-0 left-0 w-full h-auto z-0 scale-[1.1] origin-right"
  src="/booking-video.mp4"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
/>
    {/* Background Images — faded in from the top so the smoke/tint doesn't
        get hard-clipped at the section edge (which showed as a black seam). */}
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0, black 200px, black calc(100% - 200px), transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0, black 200px, black calc(100% - 200px), transparent 100%)",
      }}
    >
      

      {/* Car */}
      {/* <img
        src={Car}
        alt=""
        className="absolute left-[-150px] top-[150px] w-[1000px] h-[585px]"
      />

      <img
        src={smoke}
        alt=""
        className="absolute object-cover"
        style={{ top: -1000, left: 0, width: 1440, height: 2398, opacity: 0.15 }}
      />

      <img
        src={smoke}
        alt=""
        className="absolute object-cover"
        style={{
          top: 480,
          left: 0,
          width: 765,
          height: 594,
          opacity: 0.14,
          transform: "rotate(180deg)",
        }}
      />

      <img
        src={smoke}
        alt=""
        className="absolute object-cover"
        style={{
          top: 480,
          left: 709,
          width: 675,
          height: 294,
          opacity: 0.14,
          transform: "rotate(180deg)",
        }}
      /> */}

     

    </div>
{/* Experimental Video - Left of Booking Form */}

    {/* Booking Form */}
{/* <div className="relative z-10 mx-auto w-[92%] max-w-[520px] rounded-[25px] bg-[#0000004D] backdrop-blur-[20px] px-6 pt-[40px] pb-[40px] flex flex-col xl:absolute xl:top-0 xl:left-[760px] xl:mx-0 xl:w-[520px] xl:px-[40px]">

      <div className="relative">

       

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col"
        >
           <h2 className="text-[25px] font-semibold text-teal-accent text-center mb-[32px]">
          Book Your Luxury Car Now
        </h2>

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

          <div className="mt-[45px] flex flex-col items-center gap-2">

           <OutlineButton
  type="submit"
  className="!w-[153px] !h-[55px] !rounded-[10px] !border-line !text-fg !font-['Montserrat_Alternates'] !font-semibold !text-[22px] !leading-[100%] !tracking-[0%] !capitalize"
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
    </div> */}

  </section>
);
}