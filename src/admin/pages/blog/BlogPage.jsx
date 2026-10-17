import { Route, Routes } from "react-router-dom";
import PostsListPage from "./PostsListPage.jsx";
import PostEditorPage from "./PostEditorPage.jsx";
import RequirePermission from "../../components/RequirePermission.jsx";
import { P } from "../../permissions.js";

// /admin/blog, /admin/blog/new and /admin/blog/:id.
export default function BlogPage() {
  return (
    <Routes>
      <Route index element={<PostsListPage />} />
      <Route
        path="new"
        element={
          <RequirePermission permission={P.blog.create}>
            <PostEditorPage />
          </RequirePermission>
        }
      />
      <Route path=":id" element={<PostEditorPage />} />
    </Routes>
  );
}
