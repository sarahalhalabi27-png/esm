import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import AuthCard from "../../components/auth/AuthCard.jsx";
import PasswordInput from "../../components/auth/PasswordInput.jsx";
import {
  BOOKING_FIELDS,
  BookingButton,
  BookingInput,
} from "../../components/common/BookingFields.jsx";
import ControlledField from "../../components/common/ControlledField.jsx";
import BrandLogo from "../../components/common/BrandLogo.jsx";
import ThemeToggle from "../../components/common/ThemeToggle.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";
import { loginSchema } from "../../schemas/formSchemas.js";
import { ADMIN_BASE } from "../navigation.js";
import { STATUS } from "../../store/constants.js";
import {
  adminLogin,
  resetAdminLoginStatus,
  selectAdminLoginError,
  selectAdminLoginStatus,
  selectAdminToken,
} from "../store/adminSessionSlice.js";
import { DEMO_ACCOUNTS, DEMO_STAFF_PASSWORD } from "../api/mockAdminData.js";

const defaultValues = { email: "", password: "" };

// Staff sign in, in the site's booking-card look. Once signed in, goes to the
// page that sent the user here (an expired session) or the dashboard home.
export default function AdminLoginPage() {
  const { t } = useTranslation();
  const { t: ta } = useTranslation("admin");
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector(selectAdminToken);
  const status = useSelector(selectAdminLoginStatus);
  const error = useSelector(selectAdminLoginError);
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(loginSchema(t)),
    defaultValues,
  });

  useEffect(() => {
    dispatch(resetAdminLoginStatus());
  }, [dispatch]);

  if (token) {
    const from = location.state?.from;
    const to = from ? `${from.pathname}${from.search ?? ""}` : ADMIN_BASE;
    return <Navigate to={to} replace />;
  }

  const onSubmit = (values) => dispatch(adminLogin(values));

  const fillDemo = (email) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", DEMO_STAFF_PASSWORD, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-page text-fg flex flex-col">
      <div className="flex items-center justify-between h-[72px] px-6 md:px-10">
        <BrandLogo className="w-[90px] text-[#00BFA8] light:text-[#006D5D]" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>

      <AuthCard title={ta("login.title")}>
        <p className="mt-3 text-[15px] text-white/70">{ta("login.subtitle")}</p>
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
            label={ta("login.email")}
            placeholder={t("formPlaceholders.email")}
            autoComplete="username"
            required
          />
          <ControlledField
            control={control}
            name="password"
            as={PasswordInput}
            label={ta("login.password")}
            placeholder={t("auth.fields.passwordPlaceholder")}
            showLabel={t("auth.fields.showPassword")}
            hideLabel={t("auth.fields.hidePassword")}
            autoComplete="current-password"
            required
          />

          {status === STATUS.FAILED ? (
            <p role="alert" className="text-sm text-red-400">
              {ta(`login.errors.${error}`, {
                defaultValue: ta("login.errors.default"),
              })}
            </p>
          ) : null}

          <BookingButton
            type="submit"
            className="mt-1.5 w-full"
            disabled={status === STATUS.LOADING}
          >
            {ta(
              status === STATUS.LOADING ? "login.submitting" : "login.submit"
            )}
          </BookingButton>
        </form>

        {/* Mock-only shortcut to try each role; goes away with the backend. */}
        {import.meta.env.DEV && (
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="mb-3 text-sm text-white/60">
              {ta("login.demoAccounts")}
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((staff) => (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => fillDemo(staff.email)}
                  className="h-9 px-3 rounded-full bg-[#24B9A5]/15 text-sm text-[#24B9A5] hover:bg-[#24B9A5]/25 transition-colors"
                >
                  {staff.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </AuthCard>
    </div>
  );
}
