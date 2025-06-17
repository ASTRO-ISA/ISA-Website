import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import EventsCalendar from "@/components/EventsCalendar";
import GallerySection from "@/components/GallerySection";
import CtaSection from "@/components/CtaSection";
// import StarBackground from "@/components/StarBackground";
// import InteractiveModel from "@/components/InteractiveModel";

const Index = () => {
  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <StarBackground /> */}
      <HeroSection />
      <FeaturesSection />
      <EventsCalendar />
      {/* <InteractiveModel /> */}
      <GallerySection />
      <CtaSection />
    </div>
  );
};

export default Index;
