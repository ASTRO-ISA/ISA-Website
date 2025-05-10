

// This file is not in use!!!


import React, { useEffect, useRef } from 'react';

const StarBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    container.innerHTML = '';
    
    // Create stars
    const starCount = Math.floor(window.innerWidth * window.innerHeight / 1000);
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random size between 1-3px
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      star.style.animationDelay = `${Math.random() * 3}s`;
      
      container.appendChild(star);
    }
    
    const handleResize = () => {
      if (container) {
        container.innerHTML = '';
        const newStarCount = Math.floor(window.innerWidth * window.innerHeight / 1000);
        
        for (let i = 0; i < newStarCount; i++) {
          const star = document.createElement('div');
          star.className = 'star';
          
          const size = Math.random() * 2 + 1;
          star.style.width = `${size}px`;
          star.style.height = `${size}px`;
          
          star.style.left = `${Math.random() * 100}%`;
          star.style.top = `${Math.random() * 100}%`;
          
          star.style.animationDelay = `${Math.random() * 3}s`;
          
          container.appendChild(star);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div ref={containerRef} className="parallax-stars"></div>;
};

export default StarBackground;
