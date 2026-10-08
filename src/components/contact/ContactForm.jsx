import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HollowButton from "../common/HollowButton.jsx";
import TextField from "../common/TextField.jsx";
import { FOCUS_FILL, FORM_CARD_DARK_IN_LIGHT } from "../common/formStyles.js";
import useFormReveal from "../common/useFormReveal.js";
import ControlledField from "../common/ControlledField.jsx";
import { contactSchema } from "../../schemas/formSchemas.js";
import { sanitizeName, sanitizePhone } from "../../utils/validators.js";
import {
  submitContact,
  resetContactStatus,
  selectContactStatus,
} from "../../store/contactSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

const defaultValues = {
  fullName: "",
  subject: "",
  phone: "",
  email: "",
  message: "",
};

// Figma: each field is one underlined line with its label ("Full Name :",
// Semibold 22px) resting on it; on focus (or once filled) the label floats up
// and the underline fills with the accent colour from the start side — the
// same TextField as the car reservation form.
const FIELD = `!min-h-0 !h-[37px] !py-0 !pb-[10px] !border-b-[0.5px] !border-white/40 ${FOCUS_FILL} !font-display !font-semibold !text-[22px] !leading-[27px] !tracking-[0%] max-md:!text-base`;
const LABEL =
  "top-0 text-[22px] leading-[27px] font-semibold text-fg max-md:text-base";
const fieldProps = { inputClassName: FIELD, floatingLabelClassName: LABEL };

// The message: its label above a bordered box (Figma: 470 x 199, radius 10).
function MessageField({ label, value, onChange, onBlur, name }) {
  return (
    <label className="block">
      <span className="block text-[22px] font-semibold leading-[27px] text-fg max-md:text-base max-md:leading-[24px]">
        {label}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="block mt-[10px] w-[470px] max-w-full h-[199px] resize-none rounded-[10px] border-[0.5px] border-white/25 bg-transparent p-4 text-[17px] leading-[26px] text-fg outline-none transition-colors focus:border-teal-accent max-md:h-[150px] max-md:text-base"
      />
    </label>
  );
}

// Light mode draws the card solid #072E2A with white content, like the car
// reservation form (FORM_CARD_DARK_IN_LIGHT).
// Right column of Contact Us: a 640 x 800 card (0.5px teal/51% border, fields
// 83px in from the start edge and 45px from the top), holding the fields
// (473 wide): full name, subject, phone, email (82px apart), the message box,
// then the hollow "Contact Us" button centred under them.
export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const cardRef = useFormReveal(i18n.dir() === "rtl");
  const dispatch = useDispatch();
  const status = useSelector(selectContactStatus);
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(contactSchema(t)),
    defaultValues,
  });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetContactStatus());
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(submitContact(values)).unwrap();
      reset(defaultValues);
    } catch {
      // status is set to "error" by the slice
    }
  };

  return (
    <form
      ref={cardRef}
      id="contact-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={`font-display flex flex-col gap-[45px] min-h-[800px] rounded-[25px] border-[0.5px] border-[#24B9A5]/[0.51] ${FORM_CARD_DARK_IN_LIGHT} pt-[45px] pb-[70px] ps-[83px] pe-[84px] max-lg:min-h-0 max-lg:px-10 max-md:gap-8 max-md:rounded-[20px] max-md:px-5 max-md:py-8`}
    >
      <ControlledField
        control={control}
        name="fullName"
        as={TextField}
        transform={sanitizeName}
        placeholder={t("contactPage.form.fullName")}
        {...fieldProps}
        autoComplete="name"
      />
      <ControlledField
        control={control}
        name="subject"
        as={TextField}
        placeholder={t("contactPage.form.subject")}
        {...fieldProps}
      />
      <ControlledField
        control={control}
        name="phone"
        as={TextField}
        transform={sanitizePhone}
        type="tel"
        placeholder={t("contactPage.form.phone")}
        {...fieldProps}
        autoComplete="tel"
      />
      <ControlledField
        control={control}
        name="email"
        as={TextField}
        type="email"
        placeholder={t("contactPage.form.email")}
        {...fieldProps}
        autoComplete="email"
      />
      <ControlledField
        control={control}
        name="message"
        as={MessageField}
        label={t("contactPage.form.message")}
      />

      <div className="relative flex justify-center mt-[21px] max-md:mt-4">
        <HollowButton
          onDark
          type="submit"
          className="!border !px-[13px] !py-[13px] !text-[22px] !leading-[27px] max-md:!px-8 max-md:!py-3 max-md:!text-[18px] max-md:!leading-[24px]"
          disabled={status === SUBMIT_STATUS.SUBMITTING}
        >
          {status === SUBMIT_STATUS.SUBMITTING
            ? t("contactPage.form.sending")
            : t("contactPage.form.submit")}
        </HollowButton>
        {status === SUBMIT_STATUS.SUCCESS ? (
          <p
            className="absolute top-full mt-3 text-sm text-teal-accent"
            role="status"
          >
            {t("contactPage.form.success")}
          </p>
        ) : null}
      </div>
    </form>
  );
}
