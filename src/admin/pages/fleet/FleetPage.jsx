import { Route, Routes } from "react-router-dom";
import CarsListPage from "./CarsListPage.jsx";
import CarFormPage from "./CarFormPage.jsx";
import RequirePermission from "../../components/RequirePermission.jsx";
import { P } from "../../permissions.js";

// /admin/fleet (the cars), /admin/fleet/new and /admin/fleet/:id.
export default function FleetPage() {
  return (
    <Routes>
      <Route index element={<CarsListPage />} />
      <Route
        path="new"
        element={
          <RequirePermission permission={P.fleet.create}>
            <CarFormPage />
          </RequirePermission>
        }
      />
      <Route path=":id" element={<CarFormPage />} />
    </Routes>
  );
}
