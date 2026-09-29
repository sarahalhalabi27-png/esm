import { useEffect } from "react";
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
      </Routes>
    </>
  );
}
