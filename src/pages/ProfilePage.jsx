import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLayout from "../components/layout/PageLayout.jsx";
import ProfileForm from "../components/auth/ProfileForm.jsx";
import { selectSessionUser } from "../store/sessionSlice.js";

// /profile: the signed-in user's photo, name, mobile number and email.
// Anyone else is sent to /login, which brings them back here afterwards.
export default function ProfilePage() {
  const user = useSelector(selectSessionUser);
  if (!user)
    return <Navigate to="/login" replace state={{ from: "/profile" }} />;

  return (
    <PageLayout>
      <ProfileForm />
    </PageLayout>
  );
}
