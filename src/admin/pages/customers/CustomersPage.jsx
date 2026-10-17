import { Route, Routes } from "react-router-dom";
import CustomersListPage from "./CustomersListPage.jsx";
import CustomerDetailsPage from "./CustomerDetailsPage.jsx";

// /admin/customers (the list) and /admin/customers/:id (one customer).
export default function CustomersPage() {
  return (
    <Routes>
      <Route index element={<CustomersListPage />} />
      <Route path=":id" element={<CustomerDetailsPage />} />
    </Routes>
  );
}
