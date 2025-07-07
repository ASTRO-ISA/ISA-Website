import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  // Instagram,
  // MessageCircle,
  // Rocket,
  // Palette,
  // BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuth();
  const location = useLocation();

  // if the user is logged in, avatar will be shown and when clcking it, user dashboard will open
  const handleAvatarClick = () => {
    navigate("/profile");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav
      // initial={{ y: -100 }}
      // animate={{ y: 0 }}
      // transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10"
      // className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-space-purple/20 via-space-dark to-space-accent/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* mobile menu button */}
          <div className="w-full flex justify-between md:hidden">
            <div className="flex gap-2">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/isa-logo.jpeg"
              alt="ISA Logo"
              className="h-7 w-auto"
            />
            {/* <span className="font-bold text-xl text-white">ISA Club</span> */}
            </Link>
            </div>

            {!isLoggedIn && (
              <Button
                asChild
                className="bg-space-accent hover:bg-space-accent/80 text-white md-hidden"
              >
                <Link
                  to="/login"
                  className="text-white hover:text-space-light transition-colors md-hidden"
                >
                  Login
                </Link>
              </Button>
            )}

            {/* if the user is logged in show avatar */}
            {isLoggedIn && (
              <img
                src="images/profile-dark.webp"
                alt="User Avatar"
                onClick={handleAvatarClick}
                className="h-8 w-8 rounded-full cursor-pointer border border-white hover:scale-105 transition-transform md-hidden"
              />
            )}
          </div>
          
          <Link to="/" className="items-center gap-2 hidden md:flex">
          <img
            src="/images/isa-logo.jpeg"
            alt="ISA Logo"
            className="h-10 w-auto"
          />
          {/* <span className="font-bold text-xl text-white">ISA Club</span> */}
        </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 space-x-5">
            {userInfo?.user.role === "admin" ? (
              <Link
                to="/admin"
                className={`transition-colors ${
                  location.pathname === "/admin"
                    ? "text-space-accent"
                    : "text-white hover:text-space-light"
                }`}
              >
                Admin
              </Link>
            ) : null}

            <Link // testing the color change on path change
              to="/about"
              className={`transition-colors ${
                location.pathname === "/about"
                  ? "text-space-accent"
                  : "text-white hover:text-space-light"
              }`}
            >
              About
            </Link>
            <Link
              to="/blogs"
              className={`transition-colors ${
                location.pathname === "/blogs"
                  ? "text-space-accent"
                  : "text-white hover:text-space-light"
              }`}
            >
              Blogs & News
            </Link>
            <Link
              to="/events"
              className={`transition-colors ${
                location.pathname === "/events"
                  ? "text-space-accent"
                  : "text-white hover:text-space-light"
              }`}
            >
              Events
            </Link>
            {/* shop - not needed right now */}
            {/* <Link
              to="/shop"
              className={`transition-colors ${
                location.pathname === "/shop"
                  ? "text-space-accent"
                  : "text-white hover:text-space-light"
              }`}
            >
              Shop
            </Link> */}
            <Link
              to="/training"
              className={`transition-colors ${
                location.pathname === "/training"
                  ? "text-space-accent"
                  : "text-white hover:text-space-light"
              }`}
            >
              e-Learning
            </Link>
            <Link
              to="/webinars"
              className={`transition-colors ${
                location.pathname === "/webinars"
                  ? "text-space-accent"
                  : "text-white hover:text-space-light"
              }`}
            >
              Webinars
            </Link>

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

            {!isLoggedIn && (
              <Button
                asChild
                className="bg-space-accent hover:bg-space-accent/80 text-white"
              >
                <Link
                  to="/login"
                  className="text-white hover:text-space-light transition-colors"
                >
                  Login
                </Link>
              </Button>
            )}

            {/* if the user is logged in show avatar */}
            {isLoggedIn && (
              <img
                src="images/profile-dark.webp"
                alt="User Avatar"
                onClick={handleAvatarClick}
                className="h-10 w-10 rounded-full cursor-pointer border border-white hover:scale-105 transition-transform"
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          {/* <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div> */}
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
              {userInfo?.user.role === "admin" ? (
              <Link
                to="/admin"
                className={`transition-colors ${
                  location.pathname === "/admin"
                    ? "text-space-accent"
                    : "text-white hover:text-space-light"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            ) : null}
              <Link
                to="/about"
                className={`transition-colors ${
                  location.pathname === "/about"
                    ? "text-space-accent"
                    : "text-white hover:text-space-light"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/blogs"
                className={`transition-colors ${
                  location.pathname === "/blogs"
                    ? "text-space-accent"
                    : "text-white hover:text-space-light"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blogs & News
              </Link>
              <Link
                to="/events"
                className={`transition-colors ${
                  location.pathname === "/events"
                    ? "text-space-accent"
                    : "text-white hover:text-space-light"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              {/* shop - not needed right now */}
              {/* <Link
                to="/shop"
                className={`transition-colors ${
                  location.pathname === "/shop"
                    ? "text-space-accent"
                    : "text-white hover:text-space-light"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link> */}
              <Link
                to="/training"
                className={`transition-colors ${
                  location.pathname === "/training"
                    ? "text-space-accent"
                    : "text-white hover:text-space-light"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                e-Learning
              </Link>
              <Link
                to="/webinars"
                className={`transition-colors ${
                  location.pathname === "/webinars"
                    ? "text-space-accent"
                    : "text-white hover:text-space-light"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Webinars
              </Link>
              {/* <Link
                to="/spline-models"
                className={`transition-colors ${
                  location.pathname === '/community'
                    ? 'text-space-accent'
                    : 'text-white hover:text-space-light'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Rocket size={16} />
                <span>3D Models</span>
              </Link> */}
              {/* <Link
                to="/figma-design"
                className={`transition-colors ${
                  location.pathname === '/community'
                    ? 'text-space-accent'
                    : 'text-white hover:text-space-light'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Palette size={16} />
                <span>Figma</span>
              </Link> */}
              {/* <Link
                to="/astronomy-resources"
                className={`transition-colors ${
                  location.pathname === '/community'
                    ? 'text-space-accent'
                    : 'text-white hover:text-space-light'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen size={16} />
                <span>Resources</span>
              </Link> */}

              {/* <div className="flex items-center space-x-4 py-2">
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

              {!isLoggedIn && (
                <Button
                  asChild
                  className="bg-space-accent hover:bg-space-accent/80 text-white"
                >
                  <Link
                    to="/login"
                    className="text-white hover:text-space-light transition-colors"
                  >
                    Login
                  </Link>
                </Button>
              )}

              {/* if the user is logged in show profile */}
              {/* {isLoggedIn && (
                <img
                  src="/public/placeholder.svg"
                  alt="User Avatar"
                  onClick={handleAvatarClick}
                  className="h-10 w-10 rounded-full cursor-pointer border border-white hover:scale-105 transition-transform"
                />
              )} */}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
