import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { useEffect } from "react";
import { gsap } from "gsap";

import Index from "./pages/Index";
import Blog from "./pages/blog/Blog";
import BlogDetail from "./pages/blog/BlogDetail";
import WriteBlog from "./pages/blog/WriteBlog";
import Shop from "./pages/Shop";
import Training from "./pages/e-Learning/Training";
import Events from "./pages/event/Events";
import Webinars from "./pages/webinar/Webinars";
import Login from "./pages/authentication/Login";
import CreateAccount from "./pages/authentication/CreateAccount";
import Profile from "./pages/userDashboard/Dashboard";
import EventDetails from "./pages/event/EventDetail";
import CreateEvent from "./pages/event/CreateEvent";
import NotFound from "./pages/authentication/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/admin/Admin";
import About from "./pages/About";
import ResetPassword from "./pages/authentication/ResetPassword";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import PotdPicsUpload from "./pages/PotdPicsUpload";
import UploadResearchPaper from "./pages/e-Learning/researchParper/UploadResearchPaper";
import PrivateRoute from "./components/PrivateRoute";
import OtpVerification from "./pages/authentication/OtpVerification";
import EditEvent from "./pages/admin/admin-events/EditEvent";
import QRScannerPage from "./pages/admin/qr/QRScanner";
import PaymentStatus from "./components/PaymentVerify";
import TermsAndConditions from "./pages/TermsConditions";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize GSAP animations
    gsap.config({
      autoSleep: 60,
      force3D: true,
    });

    // Create a timeline for page transitions
    const tl = gsap.timeline();

    tl.from("body", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });

    // Clean up
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <Routes>
            
            {/* These are private routes only accessible after login. */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/events/edit/:slug" element={<EditEvent />} />
              <Route path="/events/scanner/:slug" element={<QRScannerPage />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
            </Route>

            {/* These are public routes accessible without login. */}
            <Route path="/" element={<Index />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/write" element={<WriteBlog />} />
            <Route path="/upload-paper" element={<UploadResearchPaper />} />
            <Route path="/events" element={<Events />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/training" element={<Training />} />
            <Route path="/webinars" element={<Webinars />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<CreateAccount />} />
            <Route path="terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/otp-verification/:email" element={<OtpVerification />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/host-event" element={<CreateEvent />} />
            <Route path="/about" element={<About />} />
            <Route path="/upload-pic" element={<PotdPicsUpload />} />
            <Route path="/events/:slug" element={<EventDetails />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
