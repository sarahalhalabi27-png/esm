import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

// While a form has unsaved changes (`isDirty`), leaving it asks first:
// - another page of the app: the returned `blocker` turns "blocked"; show
//   <UnsavedChangesDialog blocker={blocker} /> to let the user stay or leave;
// - reload, close the tab or another site: the browser's own prompt.
// Call `allowLeave()` right before navigating away on purpose (e.g. after
// saving or deleting), while the form may still count as changed.
export default function useUnsavedChanges(isDirty) {
  const leaving = useRef(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty &&
      !leaving.current &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (!isDirty) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // older browsers need it set
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const allowLeave = useCallback(() => {
    leaving.current = true;
  }, []);

  return { blocker, allowLeave };
}
