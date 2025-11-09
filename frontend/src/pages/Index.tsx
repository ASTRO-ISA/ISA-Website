import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import EventsCalendar from "@/components/EventsCalendar";
import GallerySection from "@/components/GallerySection";
import CtaSection from "@/components/CtaSection";
import POTDSection from "@/components/POTDSection";
// import FeaturedSection from "@/components/FeaturedSection";
import FeaturedSection from "@/components/FeaturedSection";
import { Helmet } from "react-helmet-async";
// import StarBackground from "@/components/StarBackground";
// import InteractiveModel from "@/components/InteractiveModel";

const Index = () => {
  return (
    <div className="min-h-screen bg-space-dark text-white">
      <Helmet>
        <title>Home | ISA-India</title>
        <meta name="description" content="Indian Space Association (ISA) is a student-run organization that aims to promote space exploration and research in India." />
      </Helmet>
      {/* <StarBackground /> */}
      <HeroSection />
      <FeaturedSection />
      <POTDSection />
      <FeaturesSection />
      <EventsCalendar />
      {/* <InteractiveModel /> */}
      <GallerySection />
      <CtaSection />
    </div>
  );
};

export default Index;
