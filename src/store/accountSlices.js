import { createSubmitSlice } from "./createSubmitSlice.js";
import {
  loginRequest,
  resendCodeRequest,
  signUpRequest,
  updateProfileRequest,
  verifyEmailRequest,
} from "../api/authService.js";

// The four account requests, each with its own status / error (see
// createSubmitSlice): login, sign up, email verification and "resend code".

const login = createSubmitSlice({ name: "login", submitFn: loginRequest });
export const submitLogin = login.submit;
export const resetLogin = login.reset;
export const selectLoginStatus = login.selectStatus;
export const selectLoginError = login.selectError;
export const loginReducer = login.reducer;

const signUp = createSubmitSlice({ name: "signUp", submitFn: signUpRequest });
export const submitSignUp = signUp.submit;
export const resetSignUp = signUp.reset;
export const selectSignUpStatus = signUp.selectStatus;
export const selectSignUpError = signUp.selectError;
export const signUpReducer = signUp.reducer;

const verifyEmail = createSubmitSlice({
  name: "verifyEmail",
  submitFn: verifyEmailRequest,
});
export const submitVerifyEmail = verifyEmail.submit;
export const resetVerifyEmail = verifyEmail.reset;
export const selectVerifyEmailStatus = verifyEmail.selectStatus;
export const selectVerifyEmailError = verifyEmail.selectError;
export const verifyEmailReducer = verifyEmail.reducer;

const resendCode = createSubmitSlice({
  name: "resendCode",
  submitFn: resendCodeRequest,
});
export const submitResendCode = resendCode.submit;
export const resetResendCode = resendCode.reset;
export const selectResendCodeStatus = resendCode.selectStatus;
export const resendCodeReducer = resendCode.reducer;

const profile = createSubmitSlice({
  name: "profile",
  submitFn: updateProfileRequest,
});
export const submitProfile = profile.submit;
export const resetProfile = profile.reset;
export const selectProfileStatus = profile.selectStatus;
export const profileReducer = profile.reducer;
