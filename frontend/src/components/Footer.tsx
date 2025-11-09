import { Instagram, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import Spinner from "./ui/Spinner";

const Footer = () => {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [uploadingEmail, setUploadingEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isSubscribedToNewsletter, setIsSubscribedToNewsletter] =
    useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);

  const subscribeToNewsletter = async () => {
    if (isLoggedIn) {
      setUploadingEmail(true);
      try {
        const response = await api.post(
          "/newsletter/subscribe",
          { userEmail },
          { withCredentials: true }
        );
        toast({
          title: "Subscribed Successfully",
          description:
            "You will be the first to recieve the info about new events.",
          variant: "success"
        });
        setUserEmail("");
        setUploadingEmail(false);
      } catch (err) {
        console.error("Failed to subscribe", err);
        toast({
          description: "Something went wrong! Please try again later.",
        });
        setUploadingEmail(false);
      }
    } else {
      toast({
        title: "Login required!",
        description: "Please login first to subscribe to our newsletter.",
        variant: "destructive",
      });
    }
  };

  // check if the user is subscribed to the newsletter
  const checkSubscribe = async () => {
    if (isLoggedIn) {
      try {
        const response = await api.get("/newsletter/subscribe/check", {
          withCredentials: true,
        });
        if (response.status === 200 && response.data) {
          setIsSubscribedToNewsletter(true);
        } else {
          setIsSubscribedToNewsletter(false);
        }
      } catch (err) {
        console.error("Error checking subscription status");
      }
    }
  };

  useEffect(() => {
    checkSubscribe();
  });

  const unbsubscribeToNewsletter = async () => {
    if (isLoggedIn && isSubscribedToNewsletter) {
      setUnsubscribing(true);
      try {
        const response = await api.patch(
          "/newsletter/unsubscribe",
          {},
          { withCredentials: true }
        );
        setUnsubscribing(false);
        if (response.status === 200) {
          setIsSubscribedToNewsletter(false);
          toast({
            title: "Unsubscribed successfully",
            description: "You will not receive any future newsletters.",
          });
        }
      } catch (err) {
        console.error("Failed to unsubscribe", err);
        toast({
          description: "Something went wrong! Please try again later.",
        });
        setUnsubscribing(false);
      }
    }
  };

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
            </div>
            <p className="text-gray-400 mb-4 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              A dedicated platform for space enthusiasts, researchers, and
              professionals fostering learning, collaboration, and innovation.
            </p>
            <div className="flex justify-center space-x-4 items-center text-center sm:justify-start sm:items-start sm:text-left">
              <a
                href="https://www.instagram.com/isac.india?igsh=bDQyZWh0c21yaTNp"
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
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              {/* <li><Link to="/community" className="text-gray-400 hover:text-white transition-colors">Community</Link></li> */}
              <li>
                <Link
                  to="/blogs"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blogs & News
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Events
                </Link>
              </li>
              {/* <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors">Shop</Link></li> */}
              <li>
                <Link
                  to="/training"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  e-Learning
                </Link>
              </li>
              <li>
                <Link
                  to="/webinars"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Webinars
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy-Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
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
                <span className="text-gray-400">
                  LNCT Group of Colleges, Bhopal, India
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            {isLoggedIn && isSubscribedToNewsletter ? (
              <p className="text-gray-400 mb-4">
                You will be first to recieve updates on astronomical events and
                club activities.
              </p>
            ) : (
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for updates on astronomical events
                and club activities.
              </p>
            )}
            <div className="flex flex-col space-y-3">
              {/* <input 
                type="email"
                value={userEmail}
                placeholder="Your email address" 
                className="px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                onChange={(e) => setUserEmail(e.target.value)}
              /> */}
              {isLoggedIn && isSubscribedToNewsletter ? (
                <button
                  onClick={unbsubscribeToNewsletter}
                  className={`px-4 py-2 bg-space-purple hover:bg-space-purple/80 text-white rounded ${
                    unsubscribing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={unsubscribing}
                >
                  {unsubscribing ? <Spinner /> : "Unsubscribe"}
                </button>
              ) : (
                <button
                  onClick={subscribeToNewsletter}
                  className={`px-4 py-2 bg-space-accent hover:bg-space-accent/80 text-white rounded-md transition-colors ${
                    uploadingEmail ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={uploadingEmail}
                >
                  {uploadingEmail ? <Spinner /> : "Subscribe"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500">
          <p>© {new Date().getFullYear()} ISA-India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
