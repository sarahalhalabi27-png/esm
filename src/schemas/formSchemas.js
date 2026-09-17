import { z } from "zod";

// Shared field rules
const lettersOnly = z
  .string()
  .trim()
  .min(1, "Name is required")
  .regex(/^[A-Za-z؀-ۿ\s'-]+$/, "Letters only");

const digitsOnly = z
  .string()
  .regex(/^\d*$/, "Numbers only")
  .optional()
  .or(z.literal(""));

const requiredEmail = z
  .string()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email"));

const optionalUrl = z.union([z.literal(""), z.url("Enter a valid URL")]);

// Home quick-booking form
export const bookingSchema = z.object({
  name: lettersOnly,
  phone: z.string().min(1, "Phone is required").regex(/^\d+$/, "Numbers only"),
  location: z.string().optional().or(z.literal("")),
  time: z.string().optional().or(z.literal("")),
  date: z.string().optional().or(z.literal("")),
  dropOffLocation: z.string().optional().or(z.literal("")),
});

// Car-details reservation form
export const reservationSchema = z.object({
  firstName: lettersOnly,
  lastName: lettersOnly,
  email: requiredEmail,
  phone: digitsOnly,
  bookingDuration: z.enum(["hourly", "daily", "weekly", "monthly"]),
  pickUpDate: z.string().optional().or(z.literal("")),
  pickUpTime: z.string().optional().or(z.literal("")),
  dropOffDate: z.string().optional().or(z.literal("")),
  dropOffTime: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
});

// Contact page form
export const contactSchema = z.object({
  fullName: lettersOnly,
  subject: z.string().optional().or(z.literal("")),
  phone: digitsOnly,
  email: requiredEmail,
  message: z.string().trim().min(1, "Message is required"),
});

// Blog comment form
export const commentSchema = z.object({
  name: lettersOnly,
  email: requiredEmail,
  website: optionalUrl,
  comment: z.string().trim().min(1, "Comment is required"),
  rememberMe: z.boolean().optional(),
});
