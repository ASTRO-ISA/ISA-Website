// import { useState, useEffect } from "react";
// import api from "@/lib/api";
// import { Calendar, Clock, Users, MoreVertical } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Spinner from "@/components/ui/Spinner";

// const UpcomingWebinars = () => {
//   const { userInfo, isLoggedIn, isAdmin } = useAuth();
//   const { toast } = useToast();

//   const [loadingRegWebId, setLoadingRegWebId] = useState(null);
//   const [upcomingWebinars, setUpcomingWebinars] = useState([]);
//   const [playingId, setPlayingId] = useState(null);
//   const [featuredId, setFeaturedId] = useState(null);
//   const [featured, setFeatured] = useState({
//     _id: "",
//     thumbnail: "",
//     title: "",
//     description: "",
//     webinarDate: "",
//     presenter: "",
//     guest: [],
//     videoId: "",
//   });

//   // Helpers
//   const isRegistered = (webinar) =>
//     webinar.attendees.some((a) => a._id.toString() === userInfo?.user._id.toString());

//   const formatDate = (dateStr) =>
//     new Date(dateStr).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });

//   const formatTime = (dateStr) =>
//     new Date(dateStr).toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });

//   // API Calls
//   const fetchUpcomingWebinars = async () => {
//     try {
//       const res = await api.get("/webinars/upcoming");
//       setUpcomingWebinars(res.data);
//     } catch (error) {
//       console.error("Error fetching webinars:", error.message);
//     }
//   };

//   const fetchFeatured = async () => {
//     try {
//       const res = await api.get("/webinars/featured");
//       if (res.status === 404) return;

//       setFeatured({
//         _id: res.data._id,
//         thumbnail: res.data.thumbnail,
//         title: res.data.title,
//         description: res.data.description,
//         webinarDate: res.data.webinarDate,
//         presenter: res.data.presenter,
//         guest: res.data.guests || [],
//         videoId: res.data.videoId,
//       });
//       setFeaturedId(res.data._id);
//     } catch {
//       console.error("Error fetching featured webinar.");
//       setFeaturedId(null);
//     }
//   };

//   useEffect(() => {
//     fetchUpcomingWebinars();
//     fetchFeatured();
//   }, []);

//   // Free Registration
//   const handleRegister = async (userId, webinar) => {
//     if (!isLoggedIn)
//       return toast({
//         title: "Hold on!",
//         description: "Please login first to register for the webinar.",
//         variant: "destructive",
//       });
//     setLoadingRegWebId(webinar._id);
//     try {
//       await api.patch(`/webinars/register/${webinar._id}/${userId}`);
//       fetchUpcomingWebinars();
//     } catch {
//       console.error("Error registering user for webinar.");
//     } finally {
//       setLoadingRegWebId(null);
//     }
//   };

//   // Unregister
//   const handleUnregister = async (userId, webinarId) => {
//     if (!isLoggedIn)
//       return toast({
//         title: "Hold on!",
//         description: "Please login first to unregister for the webinar.",
//         variant: "destructive",
//       });

//     setLoadingRegWebId(webinarId);
//     try {
//       await api.patch(`/webinars/unregister/${webinarId}/${userId}`);
//       fetchUpcomingWebinars();
//       toast({
//         description: "Unregistered successfully.",
//       });
//     } catch {
//       toast({
//         title: "Can't unregister.",
//         description: "Please try again later.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingRegWebId(null);
//     }
//   };

//   // Paid Registration → Payment
//   const handlePaidRegister = async (userId, webinar) => {
//     if (!isLoggedIn)
//       return toast({
//         title: "Hold on!",
//         description: "Please login first to register for the webinar.",
//         variant: "destructive",
//       });

//     setLoadingRegWebId(webinar._id);
//     try {
//       const res = await api.post(`/phonepe/payment/initiate/${webinar._id}`, {
//         amount: webinar.fee,
//         item_type: "webinar",
//       });

//       if (res.data?.redirect_url) {
//         window.location.href = res.data.redirect_url; // redirect to PhonePe
//       } else {
//         toast({
//           title: "Payment Error",
//           description: "Could not initiate payment.",
//           variant: "destructive",
//         });
//       }
//     } catch (err) {
//       console.error("Payment initiation failed:", err.message);
//       toast({
//         title: "Payment Error",
//         description: "Something went wrong. Try again later.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingRegWebId(null);
//     }
//   };

//   // Featured
//   const handleSetFeatured = async (webinar) => {
//     if (featuredId)
//       return toast({
//         title: "Already exist a featured webinar.",
//         description: "Remove previous featured first.",
//         variant: "destructive",
//       });

//     try {
//       await api.patch(`/webinars/featured/${webinar._id}`);
//       setFeaturedId(webinar._id);
//       fetchFeatured();
//       toast({ title: `Webinar \"${webinar.title}\" set as featured.` });
//     } catch (err) {
//       console.error(`Failed to set featured: ${err.message}`);
//       toast({
//         title: `Failed to set webinar \"${webinar.title}\" as featured!`,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleRemoveFeatured = async (webinar) => {
//     try {
//       await api.patch(`/webinars/featured/remove/${webinar._id}`);
//       setFeatured({
//         _id: "",
//         thumbnail: "",
//         title: "",
//         description: "",
//         webinarDate: "",
//         presenter: "",
//         guest: [],
//         videoId: "",
//       });
//       setFeaturedId(null);
//       fetchFeatured();
//       toast({ title: `\"${webinar.title}\" removed from featured.` });
//     } catch (err) {
//       console.error(`Failed to remove featured: ${err.message}`);
//       toast({
//         title: `Failed to remove webinar \"${webinar.title}\" from featured!`,
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <section className="mb-20">
//       <h2 className="text-2xl font-bold mb-8">Upcoming Webinars</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {upcomingWebinars.length === 0 ? (
//           <p className="text-gray-500 italic">No upcoming webinars right now!</p>
//         ) : (
//           upcomingWebinars.map((webinar) => (
//             <div
//               key={webinar._id}
//               className="cosmic-card overflow-hidden group flex flex-col relative"
//             >
//               {/* Video or Thumbnail */}
// {/* Video or Thumbnail */}
// <div className="relative w-full aspect-video overflow-hidden rounded-lg">
//   {playingId === webinar._id && (webinar.isFree || isRegistered(webinar)) ? (
//     <iframe
//       src={`https://www.youtube.com/embed/${webinar.videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1`}
//       title={webinar.title}
//       allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//       allowFullScreen
//       className="w-full h-full"
//     />
//   ) : (
//     <div
//       className={`w-full h-full cursor-pointer ${
//         !webinar.isFree && !isRegistered(webinar) ? "cursor-not-allowed opacity-70" : ""
//       }`}
//       onClick={() => {
//         if (webinar.isFree || isRegistered(webinar)) {
//           setPlayingId(webinar._id);
//         } else {
//           toast({
//             title: "Hold On!",
//             description: "Please register and complete payment to watch this webinar.",
//             variant: "destructive",
//           });
//         }
//       }}
//     >
//       <img
//         src={webinar.thumbnail}
//         alt={webinar.title}
//         className="w-full h-full object-cover"
//       />
//     </div>
//   )}
// </div>

//               {/* Details */}
//               <div className="p-5 flex-1 flex flex-col justify-between">
//                 <div>
//                   <h3 className="text-xl font-semibold mb-3">{webinar.title}</h3>
//                   <p className="text-gray-400 text-sm mb-4">{webinar.description}</p>

//                   <div className="space-y-2 mb-4">
//                     <div className="flex items-center text-sm text-gray-400">
//                       <Calendar className="h-4 w-4 mr-2 text-space-accent" />
//                       <span>{formatDate(webinar.createdAt)}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-400">
//                       <Clock className="h-4 w-4 mr-2 text-space-accent" />
//                       <span>{formatTime(webinar.createdAt)}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-400">
//                       <Users className="h-4 w-4 mr-2 text-space-accent" />
//                       <span>{webinar.attendees.length} registered</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between mt-auto">
//                   <div>
//                     {webinar.guests?.length > 0 && (
//                       <p className="text-sm text-gray-400">
//                         Guest: {webinar.guests.join(", ").toUpperCase()}
//                       </p>
//                     )}
//                     <h4 className="text-sm text-gray-400">
//                       Presenter: {(webinar.presenter || "Unknown").toUpperCase()}
//                     </h4>
//                   </div>

//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="p-1 rounded-full hover:bg-gray-800"
//                       >
//                         <MoreVertical className="w-5 h-5 text-gray-400" />
//                       </Button>
//                     </DropdownMenuTrigger>

//                     <DropdownMenuContent side="left" align="end" className="w-40">
//                       <DropdownMenuItem
//                         className="flex items-center gap-2 cursor-pointer"
//                         onClick={() =>
//                           navigator.share
//                             ? navigator.share({
//                                 title: webinar.title,
//                                 text: "Check out this webinar!",
//                                 url: `${window.location.origin}/webinars?watch=${webinar._id}`,
//                               })
//                             : alert("Sharing not supported on this browser.")
//                         }
//                       >
//                         Share
//                       </DropdownMenuItem>

//                       {isAdmin && featuredId !== webinar._id && (
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleSetFeatured(webinar);
//                           }}
//                         >
//                           Set as Featured
//                         </DropdownMenuItem>
//                       )}

//                       {isAdmin && featuredId === webinar._id && (
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleRemoveFeatured(webinar);
//                           }}
//                           className="text-red-600"
//                         >
//                           Remove Featured
//                         </DropdownMenuItem>
//                       )}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>

//               {/* Register Button */}
//               <button
//                 onClick={() =>
//                   isRegistered(webinar)
//                     ? !webinar.isFree && isRegistered(webinar)
//                       ? null
//                       : handleUnregister(userInfo?.user._id, webinar._id)
//                     : webinar.isFree
//                     ? handleRegister(userInfo?.user._id, webinar)
//                     : handlePaidRegister(userInfo?.user._id, webinar)
//                 }
//                 disabled={!webinar.isFree && isRegistered(webinar)} // disable click for paid+registered
//                 className={`w-full md:w-auto px-6 py-3 rounded-md transition text-white font-semibold flex justify-center
//                   ${
//                     isLoggedIn && isRegistered(webinar)
//                       ? webinar.isFree
//                         ? 'bg-space-purple/30 hover:bg-space-purple/50'
//                         : 'bg-gray-500 cursor-not-allowed' // paid registered → locked state
//                       : 'bg-space-accent hover:bg-space-accent/80'
//                   }`}
//               >
//                 {loadingRegWebId === webinar._id ? (
//                   <Spinner />
//                 ) : isLoggedIn && isRegistered(webinar) ? (
//                   webinar.isFree ? (
//                     'Unregister'
//                   ) : (
//                     'Already Registered (Paid)'
//                   )
//                 ) : webinar.isFree ? (
//                   'Register for this Webinar'
//                 ) : (
//                   `Register - ₹${webinar.fee}`
//                 )}
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </section>
//   );
// };

// export default UpcomingWebinars;

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Calendar, Clock, Users, MoreVertical } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Spinner from "@/components/ui/Spinner";
import { Link } from "react-router-dom";

const UpcomingWebinars = () => {
  const { userInfo, isLoggedIn, isAdmin } = useAuth();
  const { toast } = useToast();

  const [loadingRegWebId, setLoadingRegWebId] = useState(null);
  const [upcomingWebinars, setUpcomingWebinars] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [featuredId, setFeaturedId] = useState(null);
  const [featured, setFeatured] = useState({
    _id: "",
    thumbnail: "",
    title: "",
    description: "",
    webinarDate: "",
    presenter: "",
    guest: [],
    videoId: "",
  });

  // Modal States
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Helpers
  const isRegistered = (webinar) =>
    webinar.attendees.some((a) => a._id.toString() === userInfo?.user._id.toString());

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // API Calls
  const fetchUpcomingWebinars = async () => {
    try {
      const res = await api.get("/webinars/upcoming");
      setUpcomingWebinars(res.data);
    } catch (error) {
      console.error("Error fetching webinars:", error.message);
    }
  };

  const fetchFeatured = async () => {
    try {
      const res = await api.get("/webinars/featured");
      if (res.status === 404) return;

      setFeatured({
        _id: res.data._id,
        thumbnail: res.data.thumbnail,
        title: res.data.title,
        description: res.data.description,
        webinarDate: res.data.webinarDate,
        presenter: res.data.presenter,
        guest: res.data.guests || [],
        videoId: res.data.videoId,
      });
      setFeaturedId(res.data._id);
    } catch {
      console.error("Error fetching featured webinar.");
      setFeaturedId(null);
    }
  };

  useEffect(() => {
    fetchUpcomingWebinars();
    fetchFeatured();
  }, []);

  // Free Registration
  const handleRegister = async (userId, webinar) => {
    if (!isLoggedIn)
      return toast({
        title: "Hold on!",
        description: "Please login first to register for the webinar.",
        variant: "destructive",
      });

    setLoadingRegWebId(webinar._id);
    try {
      await api.patch(`/webinars/register/${webinar._id}/${userId}`);
      fetchUpcomingWebinars();
    } catch {
      console.error("Error registering user for webinar.");
    } finally {
      setLoadingRegWebId(null);
    }
  };

  // Unregister
  const handleUnregister = async (userId, webinarId) => {
    if (!isLoggedIn)
      return toast({
        title: "Hold on!",
        description: "Please login first to unregister for the webinar.",
        variant: "destructive",
      });

    setLoadingRegWebId(webinarId);
    try {
      await api.patch(`/webinars/unregister/${webinarId}/${userId}`);
      fetchUpcomingWebinars();
      toast({
        description: "Unregistered successfully.",
      });
    } catch {
      toast({
        title: "Can't unregister.",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingRegWebId(null);
    }
  };

  // Open Terms & Conditions Modal
  const handlePaidRegister = (userId, webinar) => {
    if (!isLoggedIn)
      return toast({
        title: "Hold on!",
        description: "Please login first to register for the webinar.",
        variant: "destructive",
      });

    setSelectedWebinar(webinar);
    setAgreeToTerms(false);
  };

  // Payment after T&C accept
  const initiatePayment = async () => {
    if (!selectedWebinar || !agreeToTerms) {
      toast({
        title: "Please accept terms",
        description: "You must agree to the Terms and Conditions before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setLoadingRegWebId(selectedWebinar._id);
    try {
      const res = await api.post(`/phonepe/payment/initiate/${selectedWebinar._id}`, {
        amount: selectedWebinar.fee,
        item_type: "webinar",
      });

      if (res.data?.redirect_url) {
        // redirect to PhonePe payment page
        window.location.href = res.data.redirect_url;
      } else {
        toast({
          title: "Payment Error",
          description: "Could not initiate payment.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Payment initiation failed:", err.message);
      toast({
        title: "Payment Error",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingRegWebId(null);
      setSelectedWebinar(null);
    }
  };

  // Featured
  const handleSetFeatured = async (webinar) => {
    if (featuredId)
      return toast({
        title: "Already exist a featured webinar.",
        description: "Remove previous featured first.",
        variant: "destructive",
      });

    try {
      await api.patch(`/webinars/featured/${webinar._id}`);
      setFeaturedId(webinar._id);
      fetchFeatured();
      toast({ title: `Webinar \"${webinar.title}\" set as featured.` });
    } catch (err) {
      console.error(`Failed to set featured: ${err.message}`);
      toast({
        title: `Failed to set webinar \"${webinar.title}\" as featured!`,
        variant: "destructive",
      });
    }
  };

  const handleRemoveFeatured = async (webinar) => {
    try {
      await api.patch(`/webinars/featured/remove/${webinar._id}`);
      setFeatured({
        _id: "",
        thumbnail: "",
        title: "",
        description: "",
        webinarDate: "",
        presenter: "",
        guest: [],
        videoId: "",
      });
      setFeaturedId(null);
      fetchFeatured();
      toast({ title: `\"${webinar.title}\" removed from featured.` });
    } catch (err) {
      console.error(`Failed to remove featured: ${err.message}`);
      toast({
        title: `Failed to remove webinar \"${webinar.title}\" from featured!`,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="mb-20 relative">
      <h2 className="text-2xl font-bold mb-8">Upcoming Webinars</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {upcomingWebinars.length === 0 ? (
          <p className="text-gray-500 italic">No upcoming webinars right now!</p>
        ) : (
          upcomingWebinars.map((webinar) => (
            <div
              key={webinar._id}
              className="cosmic-card overflow-hidden group flex flex-col relative"
            >
              {/* Video or Thumbnail */}
              <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                {playingId === webinar._id && (webinar.isFree || isRegistered(webinar)) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${webinar.videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1`}
                    title={webinar.title}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div
                    className={`w-full h-full cursor-pointer ${
                      !webinar.isFree && !isRegistered(webinar)
                        ? "cursor-not-allowed opacity-70"
                        : ""
                    }`}
                    onClick={() => {
                      if (webinar.isFree || isRegistered(webinar)) {
                        setPlayingId(webinar._id);
                      } else {
                        toast({
                          title: "Hold On!",
                          description:
                            "Please register and complete payment to watch this webinar.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <img
                      src={webinar.thumbnail}
                      alt={webinar.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-3">{webinar.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{webinar.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                      <span>{formatDate(webinar.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-4 w-4 mr-2 text-space-accent" />
                      <span>{formatTime(webinar.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 mr-2 text-space-accent" />
                      <span>{webinar.attendees.length} registered</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    {webinar.guests?.length > 0 && (
                      <p className="text-sm text-gray-400">
                        Guest: {webinar.guests.join(", ").toUpperCase()}
                      </p>
                    )}
                    <h4 className="text-sm text-gray-400">
                      Presenter: {(webinar.presenter || "Unknown").toUpperCase()}
                    </h4>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-1 rounded-full hover:bg-gray-800"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="left" align="end" className="w-40">
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() =>
                          navigator.share
                            ? navigator.share({
                                title: webinar.title,
                                text: "Check out this webinar!",
                                url: `${window.location.origin}/webinars?watch=${webinar._id}`,
                              })
                            : alert("Sharing not supported on this browser.")
                        }
                      >
                        Share
                      </DropdownMenuItem>

                      {isAdmin && featuredId !== webinar._id && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetFeatured(webinar);
                          }}
                        >
                          Set as Featured
                        </DropdownMenuItem>
                      )}

                      {isAdmin && featuredId === webinar._id && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFeatured(webinar);
                          }}
                          className="text-red-600"
                        >
                          Remove Featured
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Register Button */}
              <button
                onClick={() =>
                  isRegistered(webinar)
                    ? !webinar.isFree && isRegistered(webinar)
                      ? null
                      : handleUnregister(userInfo?.user._id, webinar._id)
                    : webinar.isFree
                    ? handleRegister(userInfo?.user._id, webinar)
                    : handlePaidRegister(userInfo?.user._id, webinar)
                }
                disabled={!webinar.isFree && isRegistered(webinar)}
                className={`w-full md:w-auto px-6 py-3 rounded-md transition text-white font-semibold flex justify-center
                  ${
                    isLoggedIn && isRegistered(webinar)
                      ? webinar.isFree
                        ? "bg-space-purple/30 hover:bg-space-purple/50"
                        : "bg-gray-500 cursor-not-allowed"
                      : "bg-space-accent hover:bg-space-accent/80"
                  }`}
              >
                {loadingRegWebId === webinar._id ? (
                  <Spinner />
                ) : isLoggedIn && isRegistered(webinar) ? (
                  webinar.isFree ? (
                    "Unregister"
                  ) : (
                    "Already Registered (Paid)"
                  )
                ) : webinar.isFree ? (
                  "Register for this Webinar"
                ) : (
                  `Register - ₹${webinar.fee}`
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Terms & Conditions Modal */}
      {selectedWebinar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-space-dark border border-gray-700 rounded-lg p-6 max-w-md w-full relative">
            <h3 className="text-xl font-bold mb-4 text-space-accent">
              Terms & Conditions
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              By proceeding with payment, you agree that webinar fees are
              non-refundable. Access will be provided only after successful
              payment confirmation. Ensure your account is logged in to access
              the content.
            </p>
            <label className="flex items-center gap-2 mb-6 text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              I agree to the{" "}
                        <Link
                          to="/terms-and-conditions"
                          className="text-space-accent underline hover:text-space-accent/80"
                        >
                          Terms and Conditions
                        </Link>
            </label>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedWebinar(null)}
                className="bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={initiatePayment}
                disabled={!agreeToTerms || loadingRegWebId === selectedWebinar._id}
                className="bg-space-accent hover:bg-space-accent/80"
              >
                {loadingRegWebId === selectedWebinar._id ? <Spinner /> : "Proceed to Pay"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UpcomingWebinars;