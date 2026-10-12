import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSessionUser } from "../store/sessionSlice.js";

// Splits a full name at its first space: "Ali Khan Saleh" -> Ali / Khan Saleh.
function splitName(name) {
  const [first = "", ...rest] = name.trim().split(/\s+/);
  return { first, last: rest.join(" ") };
}

// What each form field name takes from the signed-in user's profile. Phone
// numbers keep digits only (the forms' phone fields are digits only).
const PREFILL = {
  name: (user) => user.name,
  fullName: (user) => user.name,
  firstName: (user) => splitName(user.name).first,
  lastName: (user) => splitName(user.name).last,
  email: (user) => user.email,
  phone: (user) => user.phone.replace(/\D/g, ""),
};

// Fills a react-hook-form form's empty fields from the signed-in user's
// profile (a no-op when nobody is signed in): on mount, and whenever the
// profile changes. A field the visitor typed in is never overwritten.
// `fieldNames` are the form's field names among name, fullName, firstName,
// lastName, email and phone. Returns `applyPrefill`, to call again after the
// form was reset (e.g. once a booking was sent) so it fills in again.
//
//   const { getValues, setValue } = useForm(...);
//   const applyPrefill = useProfilePrefill({ getValues, setValue }, ["name", "phone"]);
export default function useProfilePrefill({ getValues, setValue }, fieldNames) {
  const user = useSelector(selectSessionUser);
  const names = fieldNames.join(",");

  const applyPrefill = useCallback(() => {
    if (!user) return;
    for (const name of names.split(",")) {
      const value = PREFILL[name]?.(user);
      if (value && !getValues(name)) setValue(name, value);
    }
  }, [user, names, getValues, setValue]);

  useEffect(() => {
    applyPrefill();
  }, [applyPrefill]);

  return applyPrefill;
}
