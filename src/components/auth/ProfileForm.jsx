import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import AuthCard from "./AuthCard.jsx";
import {
  BOOKING_FIELDS,
  BookingButton,
  BookingInput,
} from "../common/BookingFields.jsx";
import ControlledField from "../common/ControlledField.jsx";
import UserAvatar from "../common/UserAvatar.jsx";
import useFormReveal from "../common/useFormReveal.js";
import { profileSchema } from "../../schemas/formSchemas.js";
import { squarePhotoDataUrl } from "../../utils/image.js";
import { sanitizeName } from "../../utils/validators.js";
import {
  resetProfile,
  selectProfileStatus,
  submitProfile,
} from "../../store/accountSlices.js";
import {
  profileUpdated,
  selectSessionUser,
  signedOut,
} from "../../store/sessionSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

// Digits with an optional + at the start.
const mobileNumber = (value) =>
  value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");

// "My Profile": the photo (picked from the device, cropped square and shrunk
// to 256px), the name and mobile number, and the email (read-only: it is the
// account). Saving keeps them with the account; every form on the site then
// fills in the name, number and email by itself.
export default function ProfileForm() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectSessionUser);
  const status = useSelector(selectProfileStatus);
  const cardRef = useFormReveal(i18n.dir() === "rtl");
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(user.photo);
  const [photoError, setPhotoError] = useState("");
  const [saved, setSaved] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(profileSchema(t)),
    defaultValues: { name: user.name, phone: user.phone },
  });

  // Reset any leftover status when the page opens.
  useEffect(() => {
    dispatch(resetProfile());
  }, [dispatch]);

  const pickPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // so the same file can be picked again
    if (!file) return;
    try {
      setPhoto(await squarePhotoDataUrl(file));
      setPhotoError("");
      setSaved(false);
    } catch (error) {
      const key = ["TYPE", "SIZE"].includes(error.message)
        ? error.message.toLowerCase()
        : "read";
      setPhotoError(t(`profile.errors.${key}`));
    }
  };

  const removePhoto = () => {
    setPhoto("");
    setPhotoError("");
    setSaved(false);
  };

  const onSubmit = async (values) => {
    const profile = {
      name: values.name.trim().replace(/\s+/g, " "),
      phone: values.phone,
      photo,
    };
    try {
      await dispatch(submitProfile(profile)).unwrap();
      dispatch(profileUpdated(profile));
      setSaved(true);
    } catch {
      // status is set to "error" by the slice
    }
  };

  return (
    <AuthCard cardRef={cardRef} title={t("profile.title")}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={BOOKING_FIELDS}
        onChange={() => setSaved(false)}
      >
        <div className="flex items-center gap-4">
          <UserAvatar user={{ ...user, photo }} size={80} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <BookingButton
                type="button"
                variant="soft"
                onClick={() => fileRef.current?.click()}
                className="!h-10 px-5 !text-base"
              >
                {photo ? t("profile.photo.change") : t("profile.photo.add")}
              </BookingButton>
              {photo ? (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="text-base text-white/70 transition-colors hover:text-white"
                >
                  {t("profile.photo.remove")}
                </button>
              ) : null}
            </div>
            <p className="mt-1.5 text-[13px] leading-snug text-white/50">
              {t("profile.photo.hint")}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={pickPhoto}
              className="sr-only"
              tabIndex={-1}
              aria-label={t("profile.photo.label")}
            />
          </div>
        </div>
        {photoError ? (
          <p role="alert" className="-mt-2 text-sm text-red-400">
            {photoError}
          </p>
        ) : null}

        <ControlledField
          control={control}
          name="name"
          as={BookingInput}
          transform={sanitizeName}
          label={t("profile.name")}
          placeholder={t("booking.namePlaceholder")}
          autoComplete="name"
        />
        <ControlledField
          control={control}
          name="phone"
          as={BookingInput}
          type="tel"
          inputMode="tel"
          transform={mobileNumber}
          icon={Phone}
          label={t("profile.phone")}
          placeholder={t("profile.phonePlaceholder")}
          autoComplete="tel"
        />
        <div>
          <BookingInput
            icon={Mail}
            label={t("profile.email")}
            value={user.email}
            readOnly
            onChange={() => {}}
            dir="ltr"
          />
          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#24B9A5]">
            <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
            {t("profile.verified")}
          </p>
        </div>

        {status === SUBMIT_STATUS.ERROR ? (
          <p role="alert" className="text-sm text-red-400">
            {t("profile.errors.save")}
          </p>
        ) : null}

        <BookingButton
          type="submit"
          className="mt-1.5 w-full"
          disabled={status === SUBMIT_STATUS.SUBMITTING}
        >
          {status === SUBMIT_STATUS.SUBMITTING
            ? t("profile.saving")
            : t("profile.save")}
        </BookingButton>
        {saved ? (
          <p role="status" className="text-center text-sm text-[#24B9A5]">
            {t("profile.saved")}
          </p>
        ) : null}

        <BookingButton
          type="button"
          variant="soft"
          onClick={() => dispatch(signedOut())}
          className="w-full"
        >
          {t("nav.logout")}
        </BookingButton>
      </form>
    </AuthCard>
  );
}
