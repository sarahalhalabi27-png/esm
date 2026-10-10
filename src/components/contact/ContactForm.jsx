import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HollowButton from "../common/HollowButton.jsx";
import TextField from "../common/TextField.jsx";
import TextAreaField from "../common/TextAreaField.jsx";
import {
  CARD_FIELD_PROPS as fieldProps,
  FORM_CARD,
  FORM_CARD_DARK_IN_LIGHT,
  SUBMIT_BUTTON,
} from "../common/formStyles.js";
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

const twoColumns =
  "grid grid-cols-2 gap-x-10 gap-y-8 max-md:grid-cols-1 max-md:gap-y-[38px]";

// Right column of Contact Us, in the same style as the car reservation form
// (Reserve Your Luxury Ride Today!): the same card (FORM_CARD; solid #072E2A
// with white content in light mode, FORM_CARD_DARK_IN_LIGHT), the same
// underlined fields (CARD_FIELD), 32px rows and 40px columns: full name and
// subject, phone and email, the 80px message box, then the hollow "Contact
// Us" button centred under them.
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

  // Subjects and addresses are shown as typed, not capitalised like names
  const asTyped = `${fieldProps.inputClassName} !normal-case`;

  return (
    <form
      ref={cardRef}
      id="contact-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={`${FORM_CARD} ${FORM_CARD_DARK_IN_LIGHT} font-display flex flex-col gap-y-8 lg:!ps-12 lg:!pe-12 lg:!pt-8 pb-10 max-md:gap-y-[38px]`}
    >
      <div className={twoColumns}>
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
          inputClassName={asTyped}
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
          inputClassName={asTyped}
          autoComplete="email"
        />
      </div>

      <ControlledField
        control={control}
        name="message"
        as={TextAreaField}
        label={t("contactPage.form.message")}
        labelClassName="font-display font-medium text-[18px] leading-[27px] capitalize text-fg mb-2 max-md:text-base max-md:leading-snug max-md:mb-3"
        className="w-full"
        textareaClassName="!block !h-[80px] !rounded-[10px] !border-[0.5px] !border-white/60 !px-4 !py-3 !text-[18px] focus:!border-teal-accent max-md:!h-[110px] max-md:!text-[15px]"
      />

      <div className="relative flex justify-center">
        <HollowButton
          onDark
          type="submit"
          className={SUBMIT_BUTTON}
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
