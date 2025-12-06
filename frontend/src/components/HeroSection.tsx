// import { Button } from '@/components/ui/button';
// import { useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';

// const HeroSection = () => {
//   const heroRef = useRef<HTMLDivElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const numStars = 200;
//     let stars: { x: number; y: number; z: number }[] = [];

//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;

//       stars = Array.from({ length: numStars }, () => ({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         z: Math.random() * canvas.width,
//       }));
//     };

//     resize();
//     window.addEventListener('resize', resize);

//     const draw = () => {
//       ctx.fillStyle = 'black';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       const originX = canvas.width / 2;
//       const originY =
//         window.innerWidth >= 768 ? canvas.height / 3 : canvas.height * 0.5;

//       for (const star of stars) {
//         star.z -= 0.5;
//         if (star.z <= 0) star.z = canvas.width;

//         const k = 128.0 / star.z;
//         const px = star.x * k + originX;
//         const py = star.y * k + originY;

//         if (
//           px >= 0 &&
//           px <= canvas.width &&
//           py >= 0 &&
//           py <= canvas.height
//         ) {
//           const size = Math.max(0, (1 - star.z / canvas.width) * 3);
//           ctx.fillStyle = 'orange';
//           ctx.beginPath();
//           ctx.arc(px, py, size, 0, 2 * Math.PI);
//           ctx.fill();
//         }
//       }

//       requestAnimationFrame(draw);
//     };

//     draw();

//     return () => {
//       window.removeEventListener('resize', resize);
//     };
//   }, []);

//   return (
//     <>
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 z-0 pointer-events-none"
//       ></canvas>

//       <div className="absolute h-96 w-96 rounded-full bg-space-accent/10 bottom-0 left-0 blur-3xl"></div>

//       <div
//         ref={heroRef}
//         className="relative h-[100svh] flex flex-col items-center justify-center overflow-hidden w-full max-w-full"
//       >
//         <div className="stars"></div>
//         <div className="stars2"></div>
//         <div className="stars3"></div>

//         <div className="container relative z-10 mx-auto px-4 flex flex-col text-start gap-8 mt-16 md:ml-11 md:pl-16">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="md:w-1/2 text-center"
//           >
//             <h1 className="text-left hidden text-6xl sm:text-4xl md:text-6xl font-bold mb-4 text-white space-glow">
//               <span className="text-space-accent">Interstellar</span> SpaceTech
//               Astronomy Community
//             </h1>

//             <motion.h1
//               initial={{ opacity: 0, x: -30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-6xl md:text-[8rem] font-extrabold text-left block bg-gradient-to-r from-space-accent via-amber-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,180,80,0.5)]"
//               style={{ fontFamily: "'Orbitron', sans-serif" }}
//             >
//               ISAC
//             </motion.h1>

//             <p
//               className="font-extrabold text-left block bg-gradient-to-r from-orange-400 via-amber-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,180,80,0.5)]"
//               style={{ fontFamily: "'Orbitron', sans-serif" }}
//             >
//               Interstellar SpaceTech Astronomy Community
//             </p>

//             <p className="text-left text-base sm:text-lg md:text-xl mb-8 text-gray-300">
//               Bridging the gap between passion and profession by providing
//               resources, networking, and hands-on projects for space
//               enthusiasts.
//             </p>

//             <div className="flex flex-col items-start sm:flex-row gap-4">
//               <Button
//                 asChild
//                 variant="outline"
//                 className="border-space-purple text-space-light hover:bg-space-purple/20 px-8 py-6 text-lg"
//               >
//                 <Link to="/about">About Us</Link>
//               </Button>

//               <Button
//                 asChild
//                 variant="outline"
//                 className="border-space-purple text-space-light hover:bg-space-purple/20 px-8 py-6 text-lg"
//               >
//                 <a href="/events">Explore Events</a>
//               </Button>
//             </div>
//           </motion.div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1, duration: 0.6 }}
//           className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
//         >
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className="text-white"
//           >
//             <path
//               d="M12 5L12 19M12 19L18 13M12 19L6 13"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </motion.div>
//       </div>
//     </>
//   );
// };

// export default HeroSection;

import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numStars = 200;
    let stars: { x: number; y: number; z: number }[] = [];

    // lock height once to avoid mobile scroll resize jumps
    const height = document.documentElement.clientHeight;

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

    const draw = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const originX = canvas.width / 2;
      const originY =
        window.innerWidth >= 768 ? canvas.height / 3 : canvas.height * 0.5;

      for (const star of stars) {
        star.z -= 0.5;
        if (star.z <= 0) star.z = canvas.width;

        const k = 128.0 / star.z;
        const px = star.x * k + originX;
        const py = star.y * k + originY;

        if (
          px >= 0 &&
          px <= canvas.width &&
          py >= 0 &&
          py <= canvas.height
        ) {
          const size = Math.max(0, (1 - star.z / canvas.width) * 3);
          ctx.fillStyle = 'orange';
          ctx.beginPath();
          ctx.arc(px, py, size, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full z-0 pointer-events-none"
      />

      <div className="absolute h-96 w-96 rounded-full bg-space-accent/10 bottom-0 left-0 blur-3xl" />

      <div
        ref={heroRef}
        className="relative h-[100svh] flex flex-col items-center justify-center overflow-hidden w-full max-w-full"
      >
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>

        <div className="container relative z-10 mx-auto px-4 flex flex-col text-start gap-8 mt-16 md:ml-11 md:pl-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 text-center"
          >
            <h1 className="text-left hidden text-6xl sm:text-4xl md:text-6xl font-bold mb-4 text-white space-glow">
              <span className="text-space-accent">Interstellar</span> SpaceTech
              Astronomy Community
            </h1>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl md:text-[8rem] font-extrabold text-left block bg-gradient-to-r from-space-accent via-amber-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,180,80,0.5)]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              ISAC
            </motion.h1>

            <p
              className="font-extrabold text-left block bg-gradient-to-r from-orange-400 via-amber-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,180,80,0.5)]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Interstellar SpaceTech Astronomy Community
            </p>

            <p className="text-left text-base sm:text-lg md:text-xl mb-8 text-gray-300">
              Bridging the gap between passion and profession by providing
              resources, networking, and hands-on projects for space
              enthusiasts.
            </p>

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