
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Instagram, MessageCircle, Rocket, Palette, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav 
      // initial={{ y: -100 }}
      // animate={{ y: 0 }}
      // transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/images/b6dae26d-ef96-4680-9fc3-9b743f9ae50f.png" 
              alt="ISA Logo" 
              className="h-10 w-auto"
            />
            {/* <span className="font-bold text-xl text-white">ISA Club</span> */}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 space-x-5">

            <Link to="/community" className="text-white hover:text-space-light transition-colors">Community</Link>
            <Link to="/blogs" className="text-white hover:text-space-light transition-colors">Blog</Link>
            <Link to="/events" className="text-white hover:text-space-light transition-colors">Events</Link>
            <Link to="/shop" className="text-white hover:text-space-light transition-colors">Shop</Link>
            <Link to="/training" className="text-white hover:text-space-light transition-colors">Training</Link>
            <Link to="/webinars" className="text-white hover:text-space-light transition-colors">Webinars</Link>
            
            {/* <Link to="/spline-models" className="text-white hover:text-space-light transition-colors flex items-center gap-1">
              <Rocket size={16} />
              <span>3D Models</span>
            </Link>
            <Link to="/figma-design" className="text-white hover:text-space-light transition-colors flex items-center gap-1">
              <Palette size={16} />
              <span>Figma</span>
            </Link>
            <Link to="/astronomy-resources" className="text-white hover:text-space-light transition-colors flex items-center gap-1">
              <BookOpen size={16} />
              <span>Resources</span>
            </Link> */}
            
            {/* <div className="flex items-center space-x-4">
              <a 
                href="https://www.instagram.com/isa.astrospace?igsh=cGgyeDB3M2d4dDJ5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-space-light transition-colors"
              >
                <Instagram />
              </a>
              <a 
                href="https://chat.whatsapp.com/L3cBfJnQuO3BAbTnr4FbUE?fbclid=PAZXh0bgNhZW0CMTEAAabtBxDh4K2fihtHj_B3jxL87pA6nBaZurvhwesU32G5CftYqkhHFxdlicg_aem_v3_CsBh8Vl8Pxnf3HD8Ltg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-space-light transition-colors"
              >
                <MessageCircle />
              </a>
            </div> */}

            <Button 
              asChild
              className="bg-space-accent hover:bg-space-accent/80 text-white"
            >
              <Link to="/login" className="text-white hover:text-space-light transition-colors">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
          >
            <div className="flex flex-col space-y-4 pt-4 pb-6 px-2">
              <Link 
                to="/" 
                className="text-white hover:text-space-light transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/community" 
                className="text-white hover:text-space-light transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/blog" 
                className="text-white hover:text-space-light transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/events" 
                className="text-white hover:text-space-light transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                to="/shop" 
                className="text-white hover:text-space-light transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/training" 
                className="text-white hover:text-space-light transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Training
              </Link>
              <Link 
                to="/webinars" 
                className="text-white hover:text-space-light transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Webinars
              </Link>
              <Link 
                to="/spline-models" 
                className="text-white hover:text-space-light transition-colors py-2 flex items-center gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Rocket size={16} />
                <span>3D Models</span>
              </Link>
              <Link 
                to="/figma-design" 
                className="text-white hover:text-space-light transition-colors py-2 flex items-center gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Palette size={16} />
                <span>Figma</span>
              </Link>
              <Link 
                to="/astronomy-resources" 
                className="text-white hover:text-space-light transition-colors py-2 flex items-center gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen size={16} />
                <span>Resources</span>
              </Link>
              
              <div className="flex items-center space-x-4 py-2">
                <a 
                  href="https://www.instagram.com/isa.astrospace?igsh=cGgyeDB3M2d4dDJ5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-space-light transition-colors"
                >
                  <Instagram />
                </a>
                <a 
                  href="https://chat.whatsapp.com/L3cBfJnQuO3BAbTnr4FbUE?fbclid=PAZXh0bgNhZW0CMTEAAabtBxDh4K2fihtHj_B3jxL87pA6nBaZurvhwesU32G5CftYqkhHFxdlicg_aem_v3_CsBh8Vl8Pxnf3HD8Ltg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-space-light transition-colors"
                >
                  <MessageCircle />
                </a>
              </div>

              <Button 
                asChild
                className="bg-space-accent hover:bg-space-accent/80 text-white w-full"
              >
                <a 
                  href="https://chat.whatsapp.com/L3cBfJnQuO3BAbTnr4FbUE?fbclid=PAZXh0bgNhZW0CMTEAAabtBxDh4K2fihtHj_B3jxL87pA6nBaZurvhwesU32G5CftYqkhHFxdlicg_aem_v3_CsBh8Vl8Pxnf3HD8Ltg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Now
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
