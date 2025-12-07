// HeroSection component for the main landing page, featuring a dynamic starfield background and introductory content.
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  // Reference to the main hero section container
  const heroRef = useRef<HTMLDivElement>(null);
  // Reference to the canvas element for rendering the starfield
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numStars = 200; // Number of stars to render
    let stars: { x: number; y: number; z: number }[] = [];

    // lock height once to avoid mobile scroll resize jumps
    const height = document.documentElement.clientHeight;

    /**
     * Sets up the canvas dimensions and initializes star positions.
     * Stars are given random x, y, and z coordinates for a 3D effect.
     */
    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = height;

      stars = Array.from({ length: numStars }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
      }));
    };

    setupCanvas();

    /**
     * Draws the starfield animation.
     * Each star moves closer (z-axis) and its 2D projection (px, py) is calculated.
     * If a star moves past the viewer (z <= 0), it's reset to the far end.
     */
    const draw = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear canvas with black background

      // Define perspective origin for star movement
      const originX = canvas.width / 2;
      const originY =
        window.innerWidth >= 768 ? canvas.height / 3 : canvas.height * 0.5;

      for (const star of stars) {
        star.z -= 0.5; // Move star closer
        if (star.z <= 0) star.z = canvas.width; // Reset star if it passes the viewer

        // Calculate 2D projection of the 3D star
        const k = 128.0 / star.z;
        const px = star.x * k + originX;
        const py = star.y * k + originY;

        // Draw star if it's within canvas bounds
        if (
          px >= 0 &&
          px <= canvas.width &&
          py >= 0 &&
          py <= canvas.height
        ) {
          // Calculate star size based on its z-position (closer stars are larger)
          const size = Math.max(0, (1 - star.z / canvas.width) * 3);
          ctx.fillStyle = 'orange'; // Star color
          ctx.beginPath();
          ctx.arc(px, py, size, 0, 2 * Math.PI); // Draw circular star
          ctx.fill();
        }
      }

      requestAnimationFrame(draw); // Continue animation loop
    };

    draw();
  }, []);

  return (
    <>
      {/* Canvas for the interactive starfield background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full z-0 pointer-events-none"
      />

      {/* Decorative blurred circle in the background */}
      <div className="absolute h-96 w-96 rounded-full bg-space-accent/10 bottom-0 left-0 blur-3xl" />

      {/* Main hero section container */}
      <div
        ref={heroRef}
        className="relative h-[100svh] flex flex-col items-center justify-center overflow-hidden w-full max-w-full"
      >
        {/* Static star background layers for depth (CSS animated) */}
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>

        {/* Content container for text and buttons */}
        <div className="container relative z-10 mx-auto px-4 flex flex-col text-start gap-8 mt-16 md:ml-11 md:pl-16">
          {/* Animated div for the main title and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 text-center"
          >
            {/* Full organization name (hidden on larger screens) */}
            <h1 className="text-left hidden text-6xl sm:text-4xl md:text-6xl font-bold mb-4 text-white space-glow">
              <span className="text-space-accent">Interstellar</span> SpaceTech
              Astronomy Community
            </h1>

            {/* Animated acronym for the organization */}
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl md:text-[8rem] font-extrabold text-left block bg-gradient-to-r from-space-accent via-amber-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,180,80,0.5)]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              ISAC
            </motion.h1>

            {/* Full organization name (visible, with gradient text) */}
            <p
              className="font-extrabold text-left block bg-gradient-to-r from-orange-400 via-amber-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,180,80,0.5)]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Interstellar SpaceTech Astronomy Community
            </p>

            {/* Tagline/description of the community */}
            <p className="text-left text-base sm:text-lg md:text-xl mb-8 text-gray-300">
              Bridging the gap between passion and profession by providing
              resources, networking, and hands-on projects for space
              enthusiasts.
            </p>

            {/* Call-to-action buttons */}
            <div className="flex flex-col items-start sm:flex-row gap-4">
              <Button
                asChild
                variant="outline"
                className="border-space-purple text-space-light hover:bg-space-purple/20 px-8 py-6 text-lg"
              >
                <Link to="/about">About Us</Link>
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

        {/* Animated scroll down indicator */}
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
            <path
              d="M12 5L12 19M12 19L18 13M12 19L6 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </>
  );
};

export default HeroSection;