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

// Quick-booking page form (the service picked decides the modal that follows)

export const quickBookSchema = (t) =>
  z.object({
    firstName: createLettersOnly(t),
    lastName: createLettersOnly(t),
    email: createRequiredEmail(t),
    phone: z
      .string()
      .min(1, t("validation.phoneRequired"))
      .regex(/^\d+$/, t("validation.numbersOnly")),
    location: z.string().optional().or(z.literal("")),
    service: z.enum(["pointToPoint", "hourly", "airportTransfer", "cityTour"], {
      message: t("validation.serviceRequired"),
    }),
  });

// Quick-booking, Point-To-Point step

export const pointToPointSchema = (t) =>
  z.object({
    pickupLocation: z.string().trim().min(1, t("validation.locationRequired")),
    dropOffLocation: z.string().trim().min(1, t("validation.locationRequired")),
    date: z.string().optional().or(z.literal("")),
    time: z.string().optional().or(z.literal("")),
    carType: z.string().optional().or(z.literal("")),
    car: z.string().optional().or(z.literal("")),
    passengers: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  });

// Quick-booking, Hourly step

export const hourlySchema = (t) =>
  z.object({
    pickupLocation: z.string().trim().min(1, t("validation.locationRequired")),
    date: z.string().optional().or(z.literal("")),
    startTime: z.string().optional().or(z.literal("")),
    hours: createDigitsOnly(t),
    carType: z.string().optional().or(z.literal("")),
    car: z.string().optional().or(z.literal("")),
    passengers: z.string().optional().or(z.literal("")),
    hasStops: z.boolean(),
    stops: z.array(z.object({ location: z.string() })),
    notes: z.string().optional().or(z.literal("")),
  });

// Quick-booking, Airport Transfer step (the fields shown depend on the
// transfer type; the unused ones stay empty)

export const airportTransferSchema = (t) =>
  z.object({
    transferType: z.enum(["toAirport", "fromAirport"], {
      message: t("validation.transferRequired"),
    }),
    date: z.string().optional().or(z.literal("")),
    airport: z.string().optional().or(z.literal("")),
    flightNumber: z.string().optional().or(z.literal("")),
    flightTime: z.string().optional().or(z.literal("")),
    arrivalTime: z.string().optional().or(z.literal("")),
    pickupTime: z.string().optional().or(z.literal("")),
    dropOffLocation: z.string().optional().or(z.literal("")),
    pickupLocation: z.string().optional().or(z.literal("")),
    carType: z.string().optional().or(z.literal("")),
    car: z.string().optional().or(z.literal("")),
    passengers: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  });

// Quick-booking, City Tour step

export const cityTourSchema = (t) =>
  z.object({
    city: z.string().trim().min(1, t("validation.locationRequired")),
    date: z.string().optional().or(z.literal("")),
    startTime: z.string().optional().or(z.literal("")),
    duration: z.string().optional().or(z.literal("")),
    carType: z.string().optional().or(z.literal("")),
    car: z.string().optional().or(z.literal("")),
    passengers: z.string().optional().or(z.literal("")),
    places: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  });

// Car-details reservation form

export const reservationSchema = (t) =>
  z.object({
    firstName: createLettersOnly(t),
    lastName: createLettersOnly(t),
    email: createRequiredEmail(t),
    // Required, as on the home booking form: it's how we confirm the ride.
    phone: z
      .string()
      .min(1, t("validation.phoneRequired"))
      .regex(/^\d+$/, t("validation.numbersOnly")),
    bookingDuration: z.enum(["hourly", "daily", "weekly", "monthly"], {
      message: t("validation.durationRequired"),
    }),
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
    message: z.string().trim().min(1, t("validation.messageRequired")),
  });

// Blog comment form

export const commentSchema = (t) =>
  z.object({
    name: createLettersOnly(t),
    email: createRequiredEmail(t),
    website: createOptionalUrl(t),
    comment: z.string().trim().min(1, t("validation.commentRequired")),
    rememberMe: z.boolean().optional(),
  });
