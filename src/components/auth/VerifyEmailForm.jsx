import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthCard from "./AuthCard.jsx";
import {
  BOOKING_FIELDS,
  BookingButton,
  BookingInput,
} from "../common/BookingFields.jsx";
import ControlledField from "../common/ControlledField.jsx";
import useFormReveal from "../common/useFormReveal.js";
import { verifyEmailSchema } from "../../schemas/formSchemas.js";
import { DEMO_VERIFICATION_CODE } from "../../api/authService.js";
import {
  resetResendCode,
  resetVerifyEmail,
  selectResendCodeStatus,
  selectVerifyEmailError,
  selectVerifyEmailStatus,
  submitResendCode,
  submitVerifyEmail,
} from "../../store/accountSlices.js";
import { signedIn } from "../../store/sessionSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

const RESEND_SECONDS = 30;

// Only digits, at most six of them.
const sixDigits = (value) => value.replace(/\D/g, "").slice(0, 6);

// "Verify Your Email": the 6-digit code sent to `email`, a "Resend code"
// button (available again after 30 seconds) and a way back to change the
// email. A right code signs the visitor in and calls `onVerified`.
export default function VerifyEmailForm({ email, onBack, onVerified }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const status = useSelector(selectVerifyEmailStatus);
  const error = useSelector(selectVerifyEmailError);
  const resendStatus = useSelector(selectResendCodeStatus);
  const cardRef = useFormReveal(i18n.dir() === "rtl");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(verifyEmailSchema(t)),
    defaultValues: { code: "" },
  });

  // Reset any leftover statuses when the step opens.
  useEffect(() => {
    dispatch(resetVerifyEmail());
    dispatch(resetResendCode());
  }, [dispatch]);

  // The "resend" countdown.
  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setTimeout(() => setSeconds((left) => left - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const onSubmit = async ({ code }) => {
    try {
      await dispatch(submitVerifyEmail({ email, code })).unwrap();
      dispatch(signedIn({ email }));
      onVerified();
    } catch {
      // status is set to "error" by the slice
    }
  };

  const resend = async () => {
    try {
      await dispatch(submitResendCode({ email })).unwrap();
      setSeconds(RESEND_SECONDS);
      setResent(true);
    } catch {
      // the status stays "error"; the button stays available
    }
  };

  const linkButton =
    "text-base font-medium text-[#24B9A5] transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-white/40 disabled:hover:text-white/40";

  return (
    <AuthCard cardRef={cardRef} title={t("auth.verify.title")}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={BOOKING_FIELDS}
      >
        <p className="text-base leading-relaxed text-white/80">
          <Trans
            i18nKey="auth.verify.text"
            values={{ email }}
            components={{
              email: <bdi className="font-semibold text-white" dir="ltr" />,
            }}
          />
        </p>

        <ControlledField
          control={control}
          name="code"
          as={BookingInput}
          transform={sixDigits}
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
          label={t("auth.verify.codeLabel")}
          placeholder={t("auth.verify.codePlaceholder")}
          inputClassName="!text-center !text-[22px] !font-semibold tracking-[0.5em] !ps-[calc(1rem+0.5em)]"
          required
        />

        {import.meta.env.DEV ? (
          <p className="-mt-2 text-[13px] text-white/50">
            {t("auth.verify.demoHint", { code: DEMO_VERIFICATION_CODE })}
          </p>
        ) : null}

        {status === SUBMIT_STATUS.ERROR ? (
          <p role="alert" className="text-sm text-red-400">
            {error === "INVALID_CODE"
              ? t("auth.errors.codeIncorrect")
              : t("auth.errors.generic")}
          </p>
        ) : null}

        <BookingButton
          type="submit"
          className="mt-1.5 w-full"
          disabled={status === SUBMIT_STATUS.SUBMITTING}
        >
          {t("auth.verify.submit")}
        </BookingButton>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={resend}
            disabled={seconds > 0 || resendStatus === SUBMIT_STATUS.SUBMITTING}
            className={linkButton}
          >
            {seconds > 0
              ? t("auth.verify.resendIn", { seconds })
              : t("auth.verify.resend")}
          </button>
          <button type="button" onClick={onBack} className={linkButton}>
            {t("auth.verify.changeEmail")}
          </button>
        </div>

        {resent ? (
          <p role="status" className="text-sm text-[#24B9A5]">
            {t("auth.verify.resent")}
          </p>
        ) : null}
      </form>
    </AuthCard>
  );
}
