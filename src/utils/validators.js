// Reusable live-input sanitizers, applied on change via ControlledField's
// `transform` prop so invalid characters never make it into the field.

// Strip digits — keeps names letters/spaces only.
export function sanitizeName(value) {
  return value.replace(/[0-9]/g, "");
}

// Strip everything that isn't a digit — for phone numbers.
export function sanitizePhone(value) {
  return value.replace(/\D/g, "");
}
