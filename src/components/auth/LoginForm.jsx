import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { loginSchema } from "../../schemas/formSchemas.js";
import {
  resetLogin,
  selectLoginStatus,
  submitLogin,
} from "../../store/accountSlices.js";
import { signedIn } from "../../store/sessionSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

const defaultValues = { email: "", password: "" };

// "Welcome Back": email and password, then "Login". Signing in stores who is
// signed in (the header then offers "Log Out") and goes back to the page the
// visitor came from, or home.
export default function LoginForm() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector(selectLoginStatus);
  const cardRef = useFormReveal(i18n.dir() === "rtl");
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema(t)),
    defaultValues,
  });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetLogin());
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(submitLogin(values)).unwrap();
      dispatch(signedIn({ email: values.email }));
      navigate(location.state?.from ?? "/", { replace: true });
    } catch {
      // status is set to "error" by the slice
    }
  };

  return (
    <AuthCard cardRef={cardRef} title={t("auth.login.title")}>
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
          placeholder={t("auth.fields.passwordPlaceholder")}
          showLabel={t("auth.fields.showPassword")}
          hideLabel={t("auth.fields.hidePassword")}
          autoComplete="current-password"
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
          {t("auth.login.submit")}
        </BookingButton>

        <p className="text-center text-base text-white/70">
          {t("auth.login.noAccount")}{" "}
          <Link
            to="/signup"
            className="font-medium text-[#24B9A5] transition-colors hover:text-white"
          >
            {t("auth.login.signUpLink")}
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
