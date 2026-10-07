import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../common/TextField.jsx";
import HollowButton from "../common/HollowButton.jsx";
import ControlledField from "../common/ControlledField.jsx";
import useFormReveal from "../common/useFormReveal.js";
import {
  FORM_CARD,
  FORM_CARD_DARK_IN_LIGHT,
  FORM_TITLE,
} from "../common/formStyles.js";
import DurationSelect from "../carDetails/DurationSelect.jsx";
import { FIELD, LABEL, fieldProps } from "./quickBookStyles.js";
import { quickBookSchema } from "../../schemas/formSchemas.js";
import { sanitizeName, sanitizePhone } from "../../utils/validators.js";
import { QUICK_BOOK_SERVICES } from "../../data/quickBookServices.js";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  service: "",
};

// "Quickly Book Your Luxury Ride" (opened from the home hero's button), step
// one: a card like the car reservation form - first / last name, email /
// phone, location / service in two columns - and "Next", which hands the
// values to `onNext`; the page then swaps this card for the picked service's
// own form (QuickBookFlow).
export default function QuickBookForm({ initialValues, onNext }) {
  const { t, i18n } = useTranslation();
  const cardRef = useFormReveal(i18n.dir() === "rtl");

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(quickBookSchema(t)),
    defaultValues: initialValues ?? defaultValues,
  });

  const serviceOptions = QUICK_BOOK_SERVICES.map((value) => ({
    value,
    label: t(`quickBook.services.${value}`),
  }));

  return (
    <section className="font-display px-[47px] mt-[44px] mb-[120px] max-md:px-6 max-md:mt-6 max-md:mb-16">
      <div
        ref={cardRef}
        className={`${FORM_CARD} ${FORM_CARD_DARK_IN_LIGHT} pb-[59px]`}
      >
        <h2 className={`${FORM_TITLE} !leading-[100%] light:!text-white`}>
          {t("quickBook.title")}
        </h2>

        <form
          onSubmit={handleSubmit(onNext)}
          noValidate
          className="mt-[49px] flex flex-col gap-y-[62px] max-md:mt-12 max-md:gap-y-[38px]"
        >
          <div className="grid grid-cols-2 gap-x-[252px] gap-y-[62px] max-lg:gap-x-12 max-md:grid-cols-1 max-md:gap-y-[38px]">
            <ControlledField
              control={control}
              name="firstName"
              as={TextField}
              transform={sanitizeName}
              placeholder={t("quickBook.firstName")}
              autoComplete="given-name"
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="lastName"
              as={TextField}
              transform={sanitizeName}
              placeholder={t("quickBook.lastName")}
              autoComplete="family-name"
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="email"
              as={TextField}
              type="email"
              placeholder={t("quickBook.email")}
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
              placeholder={t("quickBook.phone")}
              autoComplete="tel"
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="location"
              as={TextField}
              placeholder={t("quickBook.location")}
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="service"
              as={DurationSelect}
              placeholder={t("quickBook.service")}
              fieldClassName={FIELD}
              floatingLabelClassName={LABEL}
              options={serviceOptions}
            />
          </div>

          <div className="relative flex justify-center">
            <HollowButton
              onDark
              type="submit"
              className="!px-[47px] !py-[13px] !text-[22px] !leading-[27px] max-md:!px-8 max-md:!py-3 max-md:!text-[18px]"
            >
              {t("quickBook.next")}
            </HollowButton>
          </div>
        </form>
      </div>
    </section>
  );
}
