import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock, MapPin, Phone } from "lucide-react";
import {
  BOOKING_CARD,
  BOOKING_FIELDS,
  BOOKING_TITLE,
  BookingHairline,
  BookingInput,
  BookingPicker,
  BookingButton,
} from "../common/BookingFields.jsx";
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
import useIsLightTheme from "../../hooks/useIsLightTheme.js";

const defaultValues = {
  name: "",
  phone: "",
  location: "",
  date: "",
  time: "",
  dropOffLocation: "",
};

// The card and its fields are the shared booking-card look (common/
// BookingFields.jsx). On short laptop windows (<= 720px tall) the size
// variables tighten (40px fields, 44px button) so the whole card, with its
// button, fits without scrolling. (The media query is written out in every
// class: Tailwind can only see whole class strings.)
export default function QuickBookingForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const status = useSelector(selectBookingStatus);
  const isLightTheme = useIsLightTheme();
  const videoSrc = isLightTheme
    ? "/booking-video-light.mp4"
    : "/booking-video.mp4";

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(bookingSchema(t)),
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

  return (
    <section className="relative overflow-hidden font-display mt-[20px]">
      {/* The video (dark or light version, per theme) fades out at the
          section's top and bottom edges — mask on this section-sized box, so it
          also covers where the video is clipped — blending into the page
          background around it. */}
      <div
        className="absolute inset-0 z-0 pointer-events-none [--video-fade:160px] max-md:[--video-fade:60px]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0, #000 var(--video-fade), #000 calc(100% - var(--video-fade)), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0, #000 var(--video-fade), #000 calc(100% - var(--video-fade)), transparent 100%)",
        }}
      >
        <video
          key={videoSrc}
          className="absolute top-0 left-0 w-full h-auto z-0 max-md:h-full max-md:object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      {/* The section (and its video) spans the full screen width; the form
          keeps its place inside a centered 1440px box. */}
      <div className="relative w-full max-w-[1440px] mx-auto py-10 min-h-0 max-md:pt-2 max-md:pb-12 xl:py-0 xl:min-h-[750px]">
        {/* Booking Form (xl: 810px from the left, as in Figma; on narrower
            boxes it moves left just enough to keep a 40px end margin instead
            of running off the screen) */}
        <div className="relative z-10 mx-auto w-[92%] max-w-[520px] max-md:w-[calc(100%-3rem)] xl:absolute xl:top-[85px] xl:[@media(min-width:768px)_and_(max-height:720px)]:top-[32px] xl:left-[min(810px,calc(100%-560px))] xl:mx-0 xl:w-[520px]">
          {/* The card: dark teal-to-black glass with a thin teal border
              (solid #072E2A in light mode, like the site's other form
              cards); the title and a hairline, then the fields
              and a full-width teal button. */}
          <div
            className={`${BOOKING_CARD} [@media(min-width:768px)_and_(max-height:720px)]:pt-5 [@media(min-width:768px)_and_(max-height:720px)]:pb-5 [@media(min-width:768px)_and_(max-height:720px)]:[--field-gap:0.75rem]`}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col"
            >
              <h2 className={BOOKING_TITLE}>{t("booking.title")}</h2>
              <BookingHairline />

              <div
                className={`${BOOKING_FIELDS} [@media(min-width:768px)_and_(max-height:720px)]:mt-3`}
              >
                <ControlledField
                  control={control}
                  name="name"
                  as={BookingInput}
                  transform={sanitizeName}
                  label={t("booking.name")}
                  placeholder={t("booking.namePlaceholder")}
                  autoComplete="name"
                  required
                />

                <ControlledField
                  control={control}
                  name="phone"
                  as={BookingInput}
                  transform={sanitizePhone}
                  type="tel"
                  inputMode="numeric"
                  icon={Phone}
                  label={t("booking.phone")}
                  placeholder={t("booking.phonePlaceholder")}
                  autoComplete="tel"
                  required
                />

                <ControlledField
                  control={control}
                  name="location"
                  as={BookingInput}
                  icon={MapPin}
                  label={t("booking.location")}
                  placeholder={t("booking.locationPlaceholder")}
                />

                <div className="grid grid-cols-2 gap-x-5 gap-y-[var(--field-gap,1.25rem)] max-[399px]:grid-cols-1">
                  <ControlledField
                    control={control}
                    name="date"
                    as={BookingPicker}
                    picker={DatePicker}
                    icon={CalendarDays}
                    label={t("booking.date")}
                    placeholder={t("booking.datePlaceholder")}
                  />
                  <ControlledField
                    control={control}
                    name="time"
                    as={BookingPicker}
                    picker={TimePicker}
                    icon={Clock}
                    label={t("booking.time")}
                    placeholder={t("booking.timePlaceholder")}
                  />
                </div>

                <ControlledField
                  control={control}
                  name="dropOffLocation"
                  as={BookingInput}
                  icon={MapPin}
                  label={t("booking.dropOffLocation")}
                  placeholder={t("booking.dropOffPlaceholder")}
                />
              </div>

              {/* The success note hangs under the button, outside the flow, so the
                  card keeps its height */}
              <div
                className={`relative mt-5 [@media(min-width:768px)_and_(max-height:720px)]:mt-4`}
              >
                <BookingButton
                  type="submit"
                  className="w-full"
                  disabled={status === SUBMIT_STATUS.SUBMITTING}
                >
                  {status === SUBMIT_STATUS.SUBMITTING
                    ? t("booking.sending")
                    : t("common.bookNow")}
                </BookingButton>

                {status === SUBMIT_STATUS.SUCCESS ? (
                  <p
                    className="absolute inset-x-0 top-full mt-3 text-center text-sm text-[#24B9A5]"
                    role="status"
                  >
                    {t("booking.success")}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
