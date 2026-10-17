// One switch for the public website's data: while VITE_API_MOCK isn't "false",
// the services in this folder answer from the demo data in src/data (and only
// log submitted forms). Set it to "false" in .env once the backend is up and
// the same pages talk to it instead. The dashboard has its own switch
// (VITE_ADMIN_MOCK, see src/admin/api/config.js).
export const USE_MOCK = import.meta.env.VITE_API_MOCK !== "false";
