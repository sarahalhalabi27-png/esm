import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, User } from "lucide-react";
import UserAvatar from "../common/UserAvatar.jsx";
import { selectSessionUser, signedOut } from "../../store/sessionSlice.js";

// The header's profile button once someone is signed in: their round photo
// (or initials) with a menu under it - who they are, "My Profile" and
// "Log Out". It closes on Esc, on a click elsewhere and on picking an item.
export default function ProfileMenu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectSessionUser);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const itemClass =
    "flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2.5 text-start text-base text-white transition-colors hover:bg-white/10 hover:text-[#24B9A5] focus-visible:bg-white/10 focus-visible:outline-none";

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label={t("nav.myProfile")}
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded-full ring-2 ring-transparent transition-shadow hover:ring-teal-accent/60 focus-visible:outline-none focus-visible:ring-teal-accent aria-expanded:ring-teal-accent"
      >
        <UserAvatar user={user} size={40} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-3 w-60 rounded-[12px] border border-white/15 bg-[#061f1c] p-1.5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
        >
          <div className="mb-1 border-b border-white/10 px-3 pb-3 pt-2">
            <p className="truncate text-base font-semibold">
              {user.name || user.email}
            </p>
            {user.name ? (
              <p className="truncate text-[13px] text-white/60" dir="ltr">
                {user.email}
              </p>
            ) : null}
          </div>
          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <User size={18} strokeWidth={1.75} aria-hidden="true" />
            {t("profile.menuProfile")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              dispatch(signedOut());
            }}
            className={itemClass}
          >
            <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
            {t("nav.logout")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
