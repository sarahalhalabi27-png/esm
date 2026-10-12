import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, Loader2 } from "lucide-react";
import AdminMessage from "./AdminMessage.jsx";
import { ADMIN_BUTTON } from "./ui.js";
import { ADMIN_BASE } from "../navigation.js";
import { STATUS } from "../../store/constants.js";
import {
  fetchAdminMe,
  selectAdminMeError,
  selectAdminMeStatus,
  selectAdminToken,
} from "../store/adminSessionSlice.js";

// Gate for every dashboard page: no token -> the staff login; with a token,
// load the user and their permissions from the backend before showing
// anything, so the sidebar and routes are built from fresh permissions.
export default function RequireAdminAuth() {
  const { t } = useTranslation("admin");
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector(selectAdminToken);
  const meStatus = useSelector(selectAdminMeStatus);
  const meError = useSelector(selectAdminMeError);

  useEffect(() => {
    if (token && meStatus === STATUS.IDLE) dispatch(fetchAdminMe());
  }, [token, meStatus, dispatch]);

  if (!token) {
    return (
      <Navigate to={`${ADMIN_BASE}/login`} replace state={{ from: location }} />
    );
  }

  if (meStatus === STATUS.FAILED) {
    return (
      <AdminMessage
        className="min-h-screen bg-page"
        icon={AlertCircle}
        title={t("session.loadFailed")}
        body={meError}
        action={
          <button
            type="button"
            className={ADMIN_BUTTON}
            onClick={() => dispatch(fetchAdminMe())}
          >
            {t("session.retry")}
          </button>
        }
      />
    );
  }

  if (meStatus !== STATUS.SUCCEEDED) {
    return (
      <AdminMessage
        className="min-h-screen bg-page"
        icon={Loader2}
        spin
        title={t("session.loading")}
      />
    );
  }

  return <Outlet />;
}
