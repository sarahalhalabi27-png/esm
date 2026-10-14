// One switch for the whole dashboard's data: while VITE_ADMIN_MOCK isn't
// "false", every screen (and the staff sign-in) answers from the mock
// services in this folder. Set it to "false" in .env once the backend is up
// and the same screens talk to it instead (see docs/admin-api.md).
export const USE_MOCK = import.meta.env.VITE_ADMIN_MOCK !== "false";
