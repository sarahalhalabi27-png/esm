import { Route, Routes } from "react-router-dom";
import RolesListPage from "./RolesListPage.jsx";
import RoleFormPage from "./RoleFormPage.jsx";
import RequirePermission from "../../components/RequirePermission.jsx";
import { P } from "../../permissions.js";

// /admin/roles, /admin/roles/new and /admin/roles/:id.
export default function RolesPage() {
  return (
    <Routes>
      <Route index element={<RolesListPage />} />
      <Route
        path="new"
        element={
          <RequirePermission permission={P.roles.create}>
            <RoleFormPage />
          </RequirePermission>
        }
      />
      <Route path=":id" element={<RoleFormPage />} />
    </Routes>
  );
}
