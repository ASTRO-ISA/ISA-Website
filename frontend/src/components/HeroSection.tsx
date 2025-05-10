
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-space-dark"
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
          <p className="text-xl mb-8 text-gray-300">
            Bridging the gap between passion and profession by providing resources, networking, and hands-on projects for space enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-center">
            <Button 
              asChild
              className="bg-space-accent hover:bg-space-accent/80 text-white px-8 py-6 text-lg"
            >
              <a 
                href="https://chat.whatsapp.com/L3cBfJnQuO3BAbTnr4FbUE?fbclid=PAZXh0bgNhZW0CMTEAAabtBxDh4K2fihtHj_B3jxL87pA6nBaZurvhwesU32G5CftYqkhHFxdlicg_aem_v3_CsBh8Vl8Pxnf3HD8Ltg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join ISA Club
              </a>
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
        
        {/* <div className="md:w-1/2 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full md:flex justify-center items-center space-y-6 md:space-y-0 md:space-x-6"
          >
            <div className="relative w-full h-80 md:h-96 animate-float">
              <img 
                src="/images/b6dae26d-ef96-4680-9fc3-9b743f9ae50f.png"
                alt="ISA Logo" 
                className="h-full w-auto mx-auto animate-pulse-glow"
              />
            </div>
            
            <div className="cosmic-card p-2 w-full md:w-64 h-96 overflow-hidden rounded-lg">
              <iframe
                src="https://www.instagram.com/p/DDEu8MnPcmB/embed"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                title="Instagram Reel"
              ></iframe>
            </div>
          </motion.div>
        </div> */}
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
