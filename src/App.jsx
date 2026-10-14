import { Suspense, lazy, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import OverviewPage from "./pages/OverviewPage.jsx";

// Each page is its own chunk, downloaded when first visited. The home page
// stays in the main bundle since it is the usual landing page.
const ServicesPage = lazy(() => import("./pages/ServicesPage.jsx"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage.jsx"));
const OurFleetPage = lazy(() => import("./pages/OurFleetPage.jsx"));
const BlogPage = lazy(() => import("./pages/BlogPage.jsx"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage.jsx"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage.jsx"));
const CarDetailsPage = lazy(() => import("./pages/CarDetailsPage.jsx"));
const QuickBookPage = lazy(() => import("./pages/QuickBookPage.jsx"));
const LegalPage = lazy(() => import("./pages/LegalPage.jsx"));
const FaqPage = lazy(() => import("./pages/FaqPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));

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
      <Suspense fallback={<div className="min-h-screen bg-page" />}>
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
      </Suspense>
    </>
  );
}
