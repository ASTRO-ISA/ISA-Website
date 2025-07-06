import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const { left, top, width, height } = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const parallaxStyle = {
    transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
  };

  return (
    <div 
      ref={heroRef}
      className="relative mb-16 min-h-[600px] sm:min-h-[600px] md:min-h-screen lg:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-space-dark"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-space-gradient"></div>

      {/* Parallax planets and elements */}
      <div 
        className="absolute h-64 w-64 rounded-full bg-space-purple/20 top-20 -right-20 blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
        }}
      ></div>
      
      <div 
        className="absolute h-96 w-96 rounded-full bg-space-accent/10 -bottom-40 -left-40 blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      ></div>

      {/* Content container with parallax effect */}
      <div 
        className="container relative z-10 mx-auto px-4 flex flex-col items-center gap-8 mt-16"
        style={parallaxStyle}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 text-center md:text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white space-glow">
            <span className="text-space-accent">Interstellar</span> SpaceTech Astronomy Club
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-300">
            Bridging the gap between passion and profession by providing resources, networking, and hands-on projects for space enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-center">
            
            <Button 
              asChild
              className="bg-space-accent hover:bg-space-accent/80 text-white px-8 py-6 text-lg"
            >
            <Link
            to="/about"
            >
              About Us
            </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="border-space-purple text-space-light hover:bg-space-purple/20 px-8 py-6 text-lg"
            >
              <a href="/events">Explore Events</a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path d="M12 5L12 19M12 19L18 13M12 19L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </div>
  );
};

export default HeroSection;
