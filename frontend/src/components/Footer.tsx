
import { Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-space-dark text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="hidden sm:flex items-center gap-2 mb-4">
              <img 
                src="/images/isa-logo.jpeg" 
                alt="ISA Logo" 
                className="h-10 w-auto"
              />
              {/* <span className="font-bold text-xl">ISA</span> */}
            </div>
            {/* <div className="font-bold text-xl flex pb-3 sm:hidden  justify-center">
              <p className='text-center w-full'>Intersteller Space Astronomy</p>
            </div> */}
            <p className="text-gray-400 mb-4 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              A dedicated platform for space enthusiasts, researchers, and professionals fostering learning, collaboration, and innovation.
            </p>
            <div className="flex justify-center space-x-4 items-center text-center sm:justify-start sm:items-start sm:text-left">
            <a 
              href="https://www.instagram.com/isa.astrospace?igsh=cGgyeDB3M2d4dDJ5"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white w-10 h-10 rounded-full p-2 transition-colors"
            >
              <Instagram />
            </a>

            <a 
              href="https://chat.whatsapp.com/L3cBfJnQuO3BAbTnr4FbUE?fbclid=PAZXh0bgNhZW0CMTEAAabtBxDh4K2fihtHj_B3jxL87pA6nBaZurvhwesU32G5CftYqkhHFxdlicg_aem_v3_CsBh8Vl8Pxnf3HD8Ltg"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white w-10 h-10 rounded-full p-2 transition-colors"
            >
              {/* <MessageCircle /> */}
              <i className="fa-brands fa-whatsapp fa-xl"></i>
            </a>

            <a 
            href="https://www.linkedin.com/company/isa-india/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            >
            <i className="fa-brands fa-linkedin fa-xl"></i>
            </a>
          </div>
          </div>

          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              {/* <li><Link to="/community" className="text-gray-400 hover:text-white transition-colors">Community</Link></li> */}
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blogs & News</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/training" className="text-gray-400 hover:text-white transition-colors">Training</Link></li>
              <li><Link to="/webinars" className="text-gray-400 hover:text-white transition-colors">Webinars</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="flex flex-col items-center text-center sm:items-start sm:text-left space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-space-accent" />
                <span className="text-gray-400">astrospace.isa@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-space-accent mt-1" />
                <span className="text-gray-400">LNCT Group of Colleges, Bhopal, India</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates on astronomical events and club activities.</p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
              />
              <button className="px-4 py-2 bg-space-accent hover:bg-space-accent/80 text-white rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500">
          <p>© {new Date().getFullYear()} ISA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
