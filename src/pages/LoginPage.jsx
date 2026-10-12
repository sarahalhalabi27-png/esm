import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLayout from "../components/layout/PageLayout.jsx";
import LoginForm from "../components/auth/LoginForm.jsx";
import { selectSessionUser } from "../store/sessionSlice.js";

// /login: email and password. Someone already signed in goes home instead.
export default function LoginPage() {
  const user = useSelector(selectSessionUser);
  if (user) return <Navigate to="/" replace />;

  return (
    <PageLayout>
      <LoginForm />
    </PageLayout>
  );
}
