import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLayout from "../components/layout/PageLayout.jsx";
import SignUpForm from "../components/auth/SignUpForm.jsx";
import VerifyEmailForm from "../components/auth/VerifyEmailForm.jsx";
import AccountReady from "../components/auth/AccountReady.jsx";
import { selectSessionUser } from "../store/sessionSlice.js";

// /signup, in three steps on one page: the account form, then the email
// verification (the code sent to the address just entered), then a
// confirmation. "Use a different email" goes back to the first step.
export default function SignUpPage() {
  const user = useSelector(selectSessionUser);
  const [step, setStep] = useState({ name: "form", email: "" });

  // Someone already signed in goes home (but not from the last step, where
  // verifying has just signed them in).
  if (user && step.name === "form") return <Navigate to="/" replace />;

  return (
    <PageLayout>
      {step.name === "form" && (
        <SignUpForm onCreated={(email) => setStep({ name: "verify", email })} />
      )}
      {step.name === "verify" && (
        <VerifyEmailForm
          email={step.email}
          onBack={() => setStep({ name: "form", email: "" })}
          onVerified={() => setStep({ name: "done", email: step.email })}
        />
      )}
      {step.name === "done" && <AccountReady />}
    </PageLayout>
  );
}
