import { Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import OurFleetPage from "./pages/OurFleetPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import BlogPostPage from "./pages/BlogPostPage.jsx";
import ContactUsPage from "./pages/ContactUsPage.jsx";
import CarDetailsPage from "./pages/CarDetailsPage.jsx";

export default function App() {
  return (
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
  );
}
