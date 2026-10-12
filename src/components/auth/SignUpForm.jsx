import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import AuthCard from "./AuthCard.jsx";
import PasswordInput from "./PasswordInput.jsx";
import {
  BOOKING_FIELDS,
  BookingButton,
  BookingInput,
} from "../common/BookingFields.jsx";
import ControlledField from "../common/ControlledField.jsx";
import useFormReveal from "../common/useFormReveal.js";
import { signUpSchema } from "../../schemas/formSchemas.js";
import {
  resetSignUp,
  selectSignUpStatus,
  submitSignUp,
} from "../../store/accountSlices.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

const defaultValues = { email: "", password: "" };

// "Create Your Account": email and password (8+ characters with a letter and
// a number). Creating the account sends a verification code to the email, and
// `onCreated` moves on to the verification step with that email.
export default function SignUpForm({ onCreated }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const status = useSelector(selectSignUpStatus);
  const cardRef = useFormReveal(i18n.dir() === "rtl");
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(signUpSchema(t)),
    defaultValues,
  });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetSignUp());
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(submitSignUp(values)).unwrap();
      onCreated(values.email.trim());
    } catch {
      // status is set to "error" by the slice
    }
  };

  const legalLink = "underline underline-offset-2 hover:text-white";

  return (
    <AuthCard cardRef={cardRef} title={t("auth.signUp.title")}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={BOOKING_FIELDS}
      >
        <ControlledField
          control={control}
          name="email"
          as={BookingInput}
          type="email"
          icon={Mail}
          label={t("auth.fields.email")}
          placeholder={t("formPlaceholders.email")}
          autoComplete="email"
          required
        />
        <ControlledField
          control={control}
          name="password"
          as={PasswordInput}
          label={t("auth.fields.password")}
          placeholder={t("auth.fields.newPasswordPlaceholder")}
          hint={t("auth.fields.passwordHint")}
          showLabel={t("auth.fields.showPassword")}
          hideLabel={t("auth.fields.hidePassword")}
          autoComplete="new-password"
          required
        />

        {status === SUBMIT_STATUS.ERROR ? (
          <p role="alert" className="text-sm text-red-400">
            {t("auth.errors.generic")}
          </p>
        ) : null}

        <BookingButton
          type="submit"
          className="mt-1.5 w-full"
          disabled={status === SUBMIT_STATUS.SUBMITTING}
        >
          {t("auth.signUp.submit")}
        </BookingButton>

        <p className="text-center text-[13px] leading-relaxed text-white/60">
          <Trans
            i18nKey="auth.signUp.terms"
            components={{
              terms: <Link to="/terms" className={legalLink} />,
              privacy: <Link to="/privacy" className={legalLink} />,
            }}
          />
        </p>

        <p className="text-center text-base text-white/70">
          {t("auth.signUp.haveAccount")}{" "}
          <Link
            to="/login"
            className="font-medium text-[#24B9A5] transition-colors hover:text-white"
          >
            {t("auth.signUp.loginLink")}
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
