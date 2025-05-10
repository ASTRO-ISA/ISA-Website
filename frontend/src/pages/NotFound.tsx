
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
// import StarBackground from "@/components/StarBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-space-dark text-white">
      {/* <StarBackground /> */}
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold mb-4 text-space-accent">404</h1>
        <p className="text-3xl mb-6">Houston, we have a problem!</p>
        <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
          The page you are looking for has been lost in space or doesn't exist.
        </p>
        <Button asChild className="bg-space-accent hover:bg-space-accent/80 text-white px-8 py-6 text-lg">
          <Link to="/">Return to Mission Control</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
