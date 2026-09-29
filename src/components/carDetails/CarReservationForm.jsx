import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextField from "../common/TextField.jsx";
import TextAreaField from "../common/TextAreaField.jsx";
import OutlineButton from "../common/OutlineButton.jsx";
import ControlledField from "../common/ControlledField.jsx";
import DatePicker from "../common/DatePicker.jsx";
import TimePicker from "../common/TimePicker.jsx";
import DurationSelect from "./DurationSelect.jsx";
import { reservationSchema } from "../../schemas/formSchemas.js";
import { sanitizeName, sanitizePhone } from "../../utils/validators.js";
import {
  submitBooking,
  resetBookingStatus,
  selectBookingStatus,
} from "../../store/bookingSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

gsap.registerPlugin(ScrollTrigger);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const SENT_FLASH_MS = 1800;

// Reveal, played once when the form scrolls into view (skipped when the
// viewer prefers reduced motion): the card rises in, then its title, then
// the fields one after another, each wiped in from the start side (the wipe
// leaves room above for floated labels such as "Your Fleet").
function useFormReveal(isRtl) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const title = card.querySelector("h2");
      const form = card.querySelector("form");
      const fields = [...form.children].flatMap((row) =>
        row.classList.contains("grid") ? [...row.children] : [row]
      );
      const clipped = isRtl
        ? "inset(-40px 0 -12px 100%)"
        : "inset(-40px 100% -12px 0)";

      gsap.set([card, title, ...fields], { autoAlpha: 0 });

      const tl = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .fromTo(
          card,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.9, clearProps: "transform" }
        )
        .fromTo(
          title,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.5"
        )
        .fromTo(
          fields,
          { autoAlpha: 1, clipPath: clipped },
          {
            clipPath: "inset(-40px 0% -12px 0%)",
            duration: 0.8,
            ease: "power2.inOut",
            stagger: 0.07,
            clearProps: "clipPath",
          },
          "-=0.3"
        );

      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        once: true,
        onEnter: () => tl.play(),
      });
    });

    return () => mm.revert();
  }, [isRtl]);

  return cardRef;
}

// A tick drawn in (stroke by stroke) — shown inside the button for a moment
// after a reservation is sent.
function DrawnCheck() {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!window.matchMedia(MOTION_OK).matches) return;
    const length = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M6 14.5l5.5 5.5L22.5 8.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BOOKING_DURATIONS = ["hourly", "daily", "weekly", "monthly"];

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bookingDuration: "",
  pickUpDate: "",
  pickUpTime: "",
  dropOffDate: "",
  dropOffTime: "",
  message: "",
};

// Figma field rule (every field): 37px tall, its label Medium 22px on a 27px
// line resting at the top, and a 0.5px white/60% underline 10px below it.
// Applied over the shared fields' own styling (TextField, Date/TimePicker).
// On focus, an accent line fills the underline from the start side.
// Light mode swaps the white/60% lines and borders for #072E2A (underlines
// and the message box 40%, the card 25%), the title to #072E2A, and the
// hollow button to #072E2A. On hover the button fills with its border colour:
// white with #072E2A text (dark), #072E2A with white text (light).
const FIELD =
  "!min-h-0 !h-[37px] !py-0 !pb-[10px] !border-b-[0.5px] !border-white/60 light:!border-[#072E2A]/40 bg-no-repeat [background-image:linear-gradient(rgb(var(--accent)),rgb(var(--accent)))] [background-size:0%_1.5px] [background-position:left_bottom] rtl:[background-position:right_bottom] !transition-[background-size] !duration-500 !ease-out focus:[background-size:100%_1.5px] !font-medium !text-[22px] !leading-[27px] max-md:!text-[17px]";
const LABEL =
  "top-0 text-[22px] leading-[27px] font-medium text-fg max-md:text-[17px]";
const fieldProps = {
  inputClassName: `${FIELD} !font-display !tracking-[0%] capitalize`,
  floatingLabelClassName: LABEL,
};
const pickerProps = { fieldClassName: FIELD, floatingLabelClassName: LABEL };

// Figma: a 1346-wide card (radius 25, 1px white/60% border, teal/10%
// background), centred in the 1440 frame (47px each side). Its title (Medium
// 25px, 7% tracking) 42px from the top; the rows 1198 wide from 75px in, the
// first 121px from the top; two-column rows are 473 + 252 + 473; each row's
// labels 62px under the line above (the Your Fleet row 65px). Two-column rows,
// a full-width duration select, a three-column row starting with the
// (read-only) car model, then drop-off, the message box and the button
// (hollow: just its border over the card's fill, labelled "Post Comment" as
// in Figma).
export default function CarReservationForm({ car }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const cardRef = useFormReveal(i18n.dir() === "rtl");
  // Briefly show a drawn tick in the button once a reservation is sent.
  const [sentFlash, setSentFlash] = useState(false);
  useEffect(() => {
    if (!sentFlash) return undefined;
    const timer = setTimeout(() => setSentFlash(false), SENT_FLASH_MS);
    return () => clearTimeout(timer);
  }, [sentFlash]);
  const status = useSelector(selectBookingStatus);
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(reservationSchema(t)),
    defaultValues,
  });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetBookingStatus());
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(
        submitBooking({ carId: car.id, carName: car.name, ...values })
      ).unwrap();
      reset(defaultValues);
      setSentFlash(true);
    } catch {
      // status is set to "error" by the slice
    }
  };

  const durationOptions = BOOKING_DURATIONS.map((value) => ({
    value,
    label: t(`carDetails.form.durations.${value}`),
  }));

  const twoColumns =
    "grid grid-cols-2 gap-x-[252px] gap-y-[62px] max-lg:gap-x-12 max-md:grid-cols-1 max-md:gap-y-[38px]";

  return (
    <section className="font-display px-[47px] mt-[120px] mb-[120px] max-md:px-6 max-md:mt-14 max-md:mb-16">
      <div
        ref={cardRef}
        className="rounded-[25px] border border-white/60 light:border-[#072E2A]/25 bg-[#24B9A5]/10 ps-[74px] pe-[72px] pt-[41px] pb-[58px] max-lg:px-10 max-md:rounded-[20px] max-md:px-5 max-md:pt-8 max-md:pb-10"
      >
        <h2 className="text-center text-[25px] font-medium leading-[30px] tracking-[0.07em] capitalize text-fg light:text-[#072E2A] max-md:text-lg max-md:tracking-[0.04em]">
          {t("carDetails.form.title")}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-[49px] flex flex-col gap-y-[62px] max-md:mt-12 max-md:gap-y-[38px]"
        >
          <div className={twoColumns}>
            <ControlledField
              control={control}
              name="firstName"
              as={TextField}
              transform={sanitizeName}
              placeholder={t("carDetails.form.firstName")}
              autoComplete="given-name"
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="lastName"
              as={TextField}
              transform={sanitizeName}
              placeholder={t("carDetails.form.lastName")}
              autoComplete="family-name"
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="email"
              as={TextField}
              type="email"
              placeholder={t("carDetails.form.email")}
              autoComplete="email"
              {...fieldProps}
              // Addresses are shown as typed, not capitalised like the names
              inputClassName={`${fieldProps.inputClassName} !normal-case`}
            />
            <ControlledField
              control={control}
              name="phone"
              as={TextField}
              type="tel"
              transform={sanitizePhone}
              placeholder={t("carDetails.form.phone")}
              autoComplete="tel"
              {...fieldProps}
            />
          </div>

          <ControlledField
            control={control}
            name="bookingDuration"
            as={DurationSelect}
            placeholder={t("carDetails.form.bookingDuration")}
            {...pickerProps}
            options={durationOptions}
          />

          {/* Figma: this row sits 65px under the line above (the others 62) */}
          <div className="mt-[3px] grid grid-cols-3 gap-x-[62px] gap-y-[62px] max-lg:gap-x-8 max-md:mt-0 max-md:grid-cols-1 max-md:gap-y-[38px]">
            {/* The car being booked: shown, not editable */}
            <TextField
              placeholder={t("carDetails.form.carModel")}
              value={car.name}
              readOnly
              onChange={() => {}}
              {...fieldProps}
              // "Your Fleet" sits 13px above the car's name
              floatingLabelActiveClassName="bottom-[calc(100%+13px)] text-[14px] leading-[17px] text-teal-accent"
            />
            <ControlledField
              control={control}
              name="pickUpDate"
              as={DatePicker}
              placeholder={t("carDetails.form.pickUpDate")}
              {...pickerProps}
            />
            <ControlledField
              control={control}
              name="pickUpTime"
              as={TimePicker}
              placeholder={t("carDetails.form.pickUpTime")}
              {...pickerProps}
            />
          </div>

          <div className={twoColumns}>
            <ControlledField
              control={control}
              name="dropOffDate"
              as={DatePicker}
              placeholder={t("carDetails.form.dropOffDate")}
              {...pickerProps}
            />
            <ControlledField
              control={control}
              name="dropOffTime"
              as={TimePicker}
              placeholder={t("carDetails.form.dropOffTime")}
              {...pickerProps}
            />
          </div>

          <ControlledField
            control={control}
            name="message"
            as={TextAreaField}
            label={t("carDetails.form.message")}
            labelClassName="font-display font-medium text-[22px] leading-[27px] capitalize text-fg mb-[10px] max-md:text-[17px] max-md:leading-snug max-md:mb-3"
            // Figma: the box is 1195 x 161, 81px in from the card's edge (6px
            // past the 75px content edge, so slightly into the end padding),
            // radius 10, 0.5px white/60% border. (Figma's absolute top, 688px,
            // doesn't agree with the spacing given on review; we follow the
            // spacing:) its label 62px under the drop-off line (like the other
            // labels), then 10px to the box.
            className="w-[1195px] ms-[6px] max-lg:w-full max-lg:ms-0"
            textareaClassName="!block !h-[161px] !rounded-[10px] !border-[0.5px] !border-white/60 light:!border-[#072E2A]/40 !p-4 !text-[18px] focus:!border-teal-accent max-md:!h-[140px] max-md:!text-[15px]"
          />

          {/* Figma: 59px under the message box (the form's 62px row gap − 3)
              and 59px above the card's bottom edge; the label is Semibold 22px
              (27px line) with 14px above/below and 48px either side, counting the
              1px border (266 x 55). The
              success note hangs below the button, outside the flow, so it
              doesn't change those spacings. */}
          <div className="relative flex justify-center -mt-[3px] max-md:mt-0">
            <OutlineButton
              type="submit"
              className="!relative !px-[47px] !py-[13px] !border-line !bg-transparent !backdrop-blur-none !text-fg hover:!bg-white hover:!text-[#072E2A] light:!border-[#072E2A] light:!text-[#072E2A] light:hover:!bg-[#072E2A] light:hover:!text-white !font-semibold !text-[22px] !leading-[27px] max-md:!px-8 max-md:!py-3 max-md:!text-[18px]"
              disabled={status === SUBMIT_STATUS.SUBMITTING}
            >
              {/* The label keeps the button's size while the tick shows */}
              <span className={sentFlash ? "invisible" : undefined}>
                {status === SUBMIT_STATUS.SUBMITTING
                  ? t("booking.sending")
                  : t("carDetails.form.submit")}
              </span>
              {sentFlash && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <DrawnCheck />
                </span>
              )}
            </OutlineButton>
            {status === SUBMIT_STATUS.SUCCESS ? (
              <p
                className="absolute top-full mt-3 text-sm text-teal-accent"
                role="status"
              >
                {t("booking.success")}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
