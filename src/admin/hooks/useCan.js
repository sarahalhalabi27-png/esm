import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectAdminPermissionSet } from "../store/adminSessionSlice.js";

// can("bookings.delete") -> whether the signed-in staff member has that
// permission key (from the backend). Use it to hide tabs, buttons and routes.
export default function useCan() {
  const permissions = useSelector(selectAdminPermissionSet);
  return useCallback(
    (permission) => permissions.has(permission),
    [permissions]
  );
}
