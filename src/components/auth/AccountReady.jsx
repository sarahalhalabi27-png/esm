import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import AuthCard from "./AuthCard.jsx";
import { BookingButton } from "../common/BookingFields.jsx";

// The last step of sign-up: the email is verified and the visitor is signed in.
export default function AccountReady() {
  const { t } = useTranslation();

  return (
    <AuthCard title={t("auth.done.title")}>
      <div className="mt-5 flex flex-col items-center gap-4 text-center">
        <CircleCheck
          size={56}
          strokeWidth={1.5}
          aria-hidden="true"
          className="text-[#24B9A5]"
        />
        <p role="status" className="text-base leading-relaxed text-white/80">
          {t("auth.done.text")}
        </p>
        <BookingButton as={Link} to="/" className="mt-1 w-full">
          {t("auth.done.continue")}
        </BookingButton>
      </div>
    </AuthCard>
  );
}
