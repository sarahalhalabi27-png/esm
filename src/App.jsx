import { Suspense, lazy, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import OverviewPage from "./pages/OverviewPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import OurFleetPage from "./pages/OurFleetPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import BlogPostPage from "./pages/BlogPostPage.jsx";
import ContactUsPage from "./pages/ContactUsPage.jsx";
import CarDetailsPage from "./pages/CarDetailsPage.jsx";
import QuickBookPage from "./pages/QuickBookPage.jsx";
import LegalPage from "./pages/LegalPage.jsx";
import FaqPage from "./pages/FaqPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// The staff dashboard is its own bundle, downloaded only when /admin opens.
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

// Start each newly opened page at the top (e.g. a car opened from the bottom
// of Our Fleet); browser back/forward keeps its own scroll restoration.
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (navigationType !== "POP") window.scrollTo(0, 0);
  }, [pathname, navigationType]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/fleet" element={<OurFleetPage />} />
        <Route path="/fleet/:carId" element={<CarDetailsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:postId" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/book" element={<QuickBookPage />} />
        <Route path="/terms" element={<LegalPage doc="terms" />} />
        <Route path="/privacy" element={<LegalPage doc="privacy" />} />
        <Route path="/disclaimer" element={<LegalPage doc="disclaimer" />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-page" />}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
