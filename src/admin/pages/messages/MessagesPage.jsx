import { Route, Routes } from "react-router-dom";
import MessagesListPage from "./MessagesListPage.jsx";
import MessageDetailsPage from "./MessageDetailsPage.jsx";

// /admin/messages (the inbox) and /admin/messages/:id (one message).
export default function MessagesPage() {
  return (
    <Routes>
      <Route index element={<MessagesListPage />} />
      <Route path=":id" element={<MessageDetailsPage />} />
    </Routes>
  );
}
