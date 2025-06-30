import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { gsap } from "gsap";

import Index from "./pages/Index";
import Blog from "./pages/blog/Blog";
import BlogDetail from "./pages/blog/BlogDetail";
import WriteBlog from "./pages/blog/WriteBlog";
import Shop from "./pages/Shop";
import Training from "./pages/Training";
import Events from "./pages/event/Events";
import Webinars from "./pages/Webinars";
import Community from "./pages/Community";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Profile from "./pages/Dashboard";
import EventDetails from "./pages/event/EventDetail";
import CreateEvent from "./pages/event/CreateEvent";
// import SplineModels from "./pages/SplineModels";
// import FigmaDesign from "./pages/FigmaDesign";
// import AstronomyResources from "./pages/AstronomyResources";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/admin/Admin";

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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/write" element={<WriteBlog />} />
            <Route path="/events" element={<Events />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/training" element={<Training />} />
            <Route path="/webinars" element={<Webinars />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<CreateAccount />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/host-event" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
            {/* <Route path="/spline-models" element={<SplineModels />} />
            <Route path="/figma-design" element={<FigmaDesign />} />
            <Route path="/astronomy-resources" element={<AstronomyResources />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
