import { Route, Routes } from "react-router-dom";
import BookingsListPage from "./BookingsListPage.jsx";
import BookingDetailsPage from "./BookingDetailsPage.jsx";

// /admin/bookings (the list) and /admin/bookings/:id (one booking).
export default function BookingsPage() {
  return (
    <Routes>
      <Route index element={<BookingsListPage />} />
      <Route path=":id" element={<BookingDetailsPage />} />
    </Routes>
  );
}
