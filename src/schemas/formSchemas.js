import { z } from "zod";

// Shared field rules

const createLettersOnly = (t) =>
  z
    .string()
    .trim()
    .min(1, t("validation.nameRequired"))
    .regex(/^[A-Za-z؀-ۿ\s'-]+$/, t("validation.lettersOnly"));

const createDigitsOnly = (t) =>
  z
    .string()
    .regex(/^\d*$/, t("validation.numbersOnly"))
    .optional()
    .or(z.literal(""));

const createRequiredEmail = (t) =>
  z
    .string()
    .min(1, t("validation.emailRequired"))
    .pipe(z.email(t("validation.invalidEmail")));

const createOptionalUrl = (t) =>
  z.union([z.literal(""), z.url(t("validation.invalidUrl"))]);

// Home quick-booking form

export const bookingSchema = (t) =>
  z.object({
    name: createLettersOnly(t),

    phone: z
      .string()
      .min(1, t("validation.phoneRequired"))
      .regex(/^\d+$/, t("validation.numbersOnly")),

    location: z.string().optional().or(z.literal("")),
    time: z.string().optional().or(z.literal("")),
    date: z.string().optional().or(z.literal("")),
    dropOffLocation: z.string().optional().or(z.literal("")),
  });

// Car-details reservation form

export const reservationSchema = (t) =>
  z.object({
    firstName: createLettersOnly(t),
    lastName: createLettersOnly(t),
    email: createRequiredEmail(t),
    phone: createDigitsOnly(t),
    bookingDuration: z.enum(["hourly", "daily", "weekly", "monthly"]),
    pickUpDate: z.string().optional().or(z.literal("")),
    pickUpTime: z.string().optional().or(z.literal("")),
    dropOffDate: z.string().optional().or(z.literal("")),
    dropOffTime: z.string().optional().or(z.literal("")),
    message: z.string().optional().or(z.literal("")),
  });

// Contact page form

export const contactSchema = (t) =>
  z.object({
    fullName: createLettersOnly(t),
    subject: z.string().optional().or(z.literal("")),
    phone: createDigitsOnly(t),
    email: createRequiredEmail(t),
    message: z
      .string()
      .trim()
      .min(1, t("validation.messageRequired")),
  });

// Blog comment form

export const commentSchema = (t) =>
  z.object({
    name: createLettersOnly(t),
    email: createRequiredEmail(t),
    website: createOptionalUrl(t),
    comment: z
      .string()
      .trim()
      .min(1, t("validation.commentRequired")),
    rememberMe: z.boolean().optional(),
  });