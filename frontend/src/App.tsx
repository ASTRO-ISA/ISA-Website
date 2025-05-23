
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { gsap } from "gsap";

import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import WriteBlog from "./pages/WriteBlog";
import Shop from "./pages/Shop";
import Training from "./pages/Training";
import Events from "./pages/Events";
import Webinars from "./pages/Webinars";
import Community from "./pages/Community";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
// import SplineModels from "./pages/SplineModels";
// import FigmaDesign from "./pages/FigmaDesign";
// import AstronomyResources from "./pages/AstronomyResources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {

  useEffect(() => {
    // Initialize GSAP animations
    gsap.config({
      autoSleep: 60,
      force3D: true
    });
    
    // Create a timeline for page transitions
    const tl = gsap.timeline();
    
    tl.from("body", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/community" element={<Community />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/write" element={<WriteBlog />} />
            <Route path="/events" element={<Events />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/training" element={<Training />} />
            <Route path="/webinars" element={<Webinars />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<CreateAccount />}/>
            
            {/* <Route path="/spline-models" element={<SplineModels />} />
            <Route path="/figma-design" element={<FigmaDesign />} />
            <Route path="/astronomy-resources" element={<AstronomyResources />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
