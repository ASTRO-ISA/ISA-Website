
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ExternalLink } from "lucide-react";
// import StarBackground from "@/components/StarBackground";

const resources = [
  {
    title: "Astronomy Sights to See",
    description: "Calendar of astronomical events and phenomena visible from Earth",
    url: "https://www.timeanddate.com/astronomy/sights-to-see.html",
    image: "/lovable-uploads/582ac169-4b33-4482-a21a-eb007829c86b.png"
  },
  {
    title: "NASA News",
    description: "Latest news and updates from NASA",
    url: "https://www.nasa.gov/news/",
    image: "/lovable-uploads/b6dae26d-ef96-4680-9fc3-9b743f9ae50f.png"
  },
  {
    title: "TheSkyLive Planetarium",
    description: "Real-time planetarium and astronomical information",
    url: "https://theskylive.com/planetarium",
    image: "/lovable-uploads/51dc2c27-82d2-40f1-a203-b0c090ea514d.png"
  },
  {
    title: "EDUSAT News",
    description: "Educational satellite program news from IIRS",
    url: "https://www.iirs.gov.in/EDUSAT-News",
    image: "/lovable-uploads/7024007d-9651-4448-8d1f-c8f6c7b67611.png"
  },
  {
    title: "NASA Applied Sciences Training",
    description: "Training resources from NASA's Applied Sciences Program",
    url: "https://appliedsciences.nasa.gov/get-involved/training",
    image: "/lovable-uploads/6e2f90e0-d9db-42ef-9c2d-def808dc9cef.png"
  }
];

const AstronomyResources = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <StarBackground /> */}
      {/* <Navbar /> */}
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 space-glow">Astronomy Resources</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore these valuable astronomy and space science resources to enhance your knowledge and stay updated with the latest developments.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {resources.map((resource, index) => (
            <motion.a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="cosmic-card group block overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={resource.image} 
                  alt={resource.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-space-accent transition-colors">{resource.title}</h3>
                <p className="text-gray-400">{resource.description}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
      
      {/* <Footer /> */}
    </div>
  );
};

export default AstronomyResources;
