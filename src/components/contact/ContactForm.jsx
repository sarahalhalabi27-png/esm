import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HollowButton from "../common/HollowButton.jsx";
import { FOCUS_WITHIN_FILL } from "../common/formStyles.js";
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
// Semibold 18px) fixed at the start and the input after it; the underline
// fills with the accent colour from the start side on focus.
function LineField({
  label,
  value,
  onChange,
  onBlur,
  name,
  type = "text",
  ...rest
}) {
  return (
    <label
      className={`group flex items-end gap-2 h-[40px] pb-2 border-b-[0.5px] border-white/40 light:border-[#072E2A]/40 ${FOCUS_WITHIN_FILL}`}
    >
      <span className="shrink-0 text-[18px] font-semibold leading-[24px] text-fg max-md:text-base">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="flex-1 min-w-0 bg-transparent outline-none text-[18px] leading-[24px] text-fg max-md:text-base"
        {...rest}
      />
    </label>
  );
}

// The message: its label above a bordered box (Figma: 474 x 198).
function MessageField({ label, value, onChange, onBlur, name }) {
  return (
    <label className="block">
      <span className="block text-[18px] font-semibold leading-[24px] text-fg max-md:text-base">
        {label}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="block mt-4 w-full h-[198px] resize-none rounded-[8px] border-[0.5px] border-white/25 light:border-[#072E2A]/40 bg-transparent p-4 text-[17px] leading-[26px] text-fg outline-none transition-colors focus:border-teal-accent max-md:h-[150px] max-md:text-base"
      />
    </label>
  );
}

// Right column of Contact Us (Figma, 474 wide): full name, subject, phone,
// email (82px apart), the message box, then the hollow "Contact Us" button
// centred under them.
export default function ContactForm() {
  const { t } = useTranslation();
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
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="font-display flex flex-col gap-[42px] max-md:gap-8"
    >
      <ControlledField
        control={control}
        name="fullName"
        as={LineField}
        transform={sanitizeName}
        label={t("contactPage.form.fullName")}
        autoComplete="name"
      />
      <ControlledField
        control={control}
        name="subject"
        as={LineField}
        label={t("contactPage.form.subject")}
      />
      <ControlledField
        control={control}
        name="phone"
        as={LineField}
        transform={sanitizePhone}
        type="tel"
        label={t("contactPage.form.phone")}
        autoComplete="tel"
      />
      <ControlledField
        control={control}
        name="email"
        as={LineField}
        type="email"
        label={t("contactPage.form.email")}
        autoComplete="email"
      />
      <ControlledField
        control={control}
        name="message"
        as={MessageField}
        label={t("contactPage.form.message")}
      />

      <div className="relative flex justify-center mt-4">
        <HollowButton
          type="submit"
          className="!px-[34px] !py-[13px] !text-[18px] !leading-[24px]"
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
