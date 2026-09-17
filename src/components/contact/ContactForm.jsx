import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../common/TextField.jsx";
import TextAreaField from "../common/TextAreaField.jsx";
import PrimaryButton from "../common/PrimaryButton.jsx";
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

export default function ContactForm() {
  const dispatch = useDispatch();
  const status = useSelector(selectContactStatus);
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(contactSchema),
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <ControlledField
          control={control}
          name="fullName"
          as={TextField}
          transform={sanitizeName}
          label="Full Name"
        />
        <ControlledField
          control={control}
          name="subject"
          as={TextField}
          label="Subject"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <ControlledField
          control={control}
          name="phone"
          as={TextField}
          transform={sanitizePhone}
          label="Phone Number"
          type="tel"
        />
        <ControlledField
          control={control}
          name="email"
          as={TextField}
          label="Email Address"
          type="email"
        />
      </div>
      <ControlledField
        control={control}
        name="message"
        as={TextAreaField}
        label="Message"
        rows={5}
      />
      <PrimaryButton
        type="submit"
        disabled={status === SUBMIT_STATUS.SUBMITTING}
      >
        {status === SUBMIT_STATUS.SUBMITTING ? "Sending..." : "Contact Us"}
      </PrimaryButton>
      {status === SUBMIT_STATUS.SUCCESS ? (
        <p className="text-xs text-teal-accent">
          Message sent. We&apos;ll be in touch soon.
        </p>
      ) : null}
    </form>
  );
}
