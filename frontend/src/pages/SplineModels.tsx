

// This file is not in use!!!


import { useEffect, useRef } from 'react';
// import StarBackground from "@/components/StarBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Create a declaration for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url: string;
      };
    }
  }
}

const SplineModels = () => {
  const splineContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load Spline viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <StarBackground /> */}
      {/* <Navbar /> */}
      
      <div className="pt-28 pb-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-12 space-glow">Interactive 3D Models</h1>
        
        <div className="container mx-auto space-y-16">
          {/* Star Model */}
          <div className="cosmic-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Star Model</h2>
            <div className="h-[500px] w-full rounded-lg overflow-hidden">
              <iframe 
                src="https://my.spline.design/star-c140aa09f0f405d6b562db8c71742ecf/" 
                frameBorder="0" 
                width="100%" 
                height="100%"
                title="Star Model"
              ></iframe>
            </div>
          </div>
          
          {/* Play Model */}
          <div className="cosmic-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Play Model</h2>
            <div className="h-[500px] w-full rounded-lg overflow-hidden">
              <iframe 
                src="https://my.spline.design/play-9cef9b94bd27f5332725aa033c0ee322/" 
                frameBorder="0" 
                width="100%" 
                height="100%"
                title="Play Model"
              ></iframe>
            </div>
          </div>
          
          {/* Space Text Transition */}
          <div className="cosmic-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Space Text Transition</h2>
            <div className="h-[500px] w-full rounded-lg overflow-hidden">
              <iframe 
                src="https://my.spline.design/spacetexttransition-1f339c09f6d150a86de93c29a0174399/" 
                frameBorder="0" 
                width="100%" 
                height="100%"
                title="Space Text Transition"
              ></iframe>
            </div>
          </div>
          
          {/* Rocket Model */}
          <div className="cosmic-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Rocket Model</h2>
            <div className="h-[500px] w-full rounded-lg overflow-hidden">
              <iframe 
                src="https://my.spline.design/rocket-49c1a10f1c50efef1fa23786189beb65/" 
                frameBorder="0" 
                width="100%" 
                height="100%"
                title="Rocket Model"
              ></iframe>
            </div>
          </div>
          
          {/* Spline Viewers */}
          <div className="cosmic-card p-6" ref={splineContainerRef}>
            <h2 className="text-2xl font-semibold mb-4">Additional Models</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-[400px] w-full">
                <spline-viewer url="https://prod.spline.design/Q9kajBEkNMsGcWgs/scene.splinecode"></spline-viewer>
              </div>
              <div className="h-[400px] w-full">
                <spline-viewer url="https://prod.spline.design/FF1lkvzlsXWrwhgB/scene.splinecode"></spline-viewer>
              </div>
              <div className="h-[400px] w-full">
                <spline-viewer url="https://prod.spline.design/y44aHNzJALpFW7Ji/scene.splinecode"></spline-viewer>
              </div>
              <div className="h-[400px] w-full">
                <spline-viewer url="https://prod.spline.design/nEe7Ih03mavUAXsa/scene.splinecode"></spline-viewer>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* <Footer /> */}
    </div>
  );
};

export default SplineModels;
