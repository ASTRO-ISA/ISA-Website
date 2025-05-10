

// This file is not in use!!!


import { useEffect, useRef, useState } from 'react';

const InteractiveModel = () => {
  const [activeModel, setActiveModel] = useState('solar-system');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (iframeRef.current) {
      setIsLoading(true);
      const iframe = iframeRef.current;
      
      const handleLoad = () => {
        setIsLoading(false);
      };
      
      iframe.addEventListener('load', handleLoad);
      
      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, [activeModel]);

  const getModelSrc = () => {
    switch (activeModel) {
      case 'solar-system':
        return "https://eyes.nasa.gov/apps/solar-system/#/home?interactPrompt=true&surfaceMapTiling=true&hd=true";
      case 'jwst':
        return "https://eyes.nasa.gov/apps/solar-system/#/sc_jwst";
      case 'compare':
        return "https://eyes.nasa.gov/apps/solar-system/#/sc_jwst/compare";
      case 'theskylive':
        return "https://theskylive.com/3dsolarsystem";
      default:
        return "https://eyes.nasa.gov/apps/solar-system/#/home?interactPrompt=true&surfaceMapTiling=true&hd=true";
    }
  };

  return (
    <section className="py-20 bg-space-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Interactive 3D Models</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our solar system and beyond with these interactive 3D visualizations.
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeModel === 'solar-system' ? 'bg-space-accent text-white' : 'bg-space-purple/20 text-white hover:bg-space-purple/40'}`}
              onClick={() => setActiveModel('solar-system')}
            >
              Solar System
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeModel === 'jwst' ? 'bg-space-accent text-white' : 'bg-space-purple/20 text-white hover:bg-space-purple/40'}`}
              onClick={() => setActiveModel('jwst')}
            >
              James Webb Telescope
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeModel === 'compare' ? 'bg-space-accent text-white' : 'bg-space-purple/20 text-white hover:bg-space-purple/40'}`}
              onClick={() => setActiveModel('compare')}
            >
              Compare Models
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeModel === 'theskylive' ? 'bg-space-accent text-white' : 'bg-space-purple/20 text-white hover:bg-space-purple/40'}`}
              onClick={() => setActiveModel('theskylive')}
            >
              TheSkyLive
            </button>
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden shadow-2xl h-[600px] border border-space-purple/30">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-space-dark">
              <div className="space-y-4 text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-space-accent border-r-transparent align-[-0.125em] text-space-accent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="text-white">Loading interactive model...</p>
              </div>
            </div>
          )}
          <iframe 
            ref={iframeRef}
            src={getModelSrc()} 
            allowFullScreen
            className="w-full h-full border-0"
            title="Interactive Space Model"
          ></iframe>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Interactive models powered by NASA Eyes and TheSkyLive</p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveModel;
