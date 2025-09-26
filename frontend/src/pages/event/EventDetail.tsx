// import { Calendar, MapPin, Clock, Users, Video } from "lucide-react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import api from "@/lib/api";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import Spinner from "@/components/ui/Spinner";

// const EventDetails = () => {
//   const { slug } = useParams();
//   const { userInfo, isLoggedIn } = useAuth();
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState(false);
//   const [loadingEventId, setLoadingEventId] = useState(null);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const fetchEvent = async () => {
//     try {
//       const res = await api.get(`/events/${slug}`);
//       setEvent(res.data);
//     } catch (err) {
//       console.error("Error fetching event:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvent();
//   }, [slug]);

//   // Helpers
//   const isRegistered = () =>
//     event?.registeredUsers.some((e) => e._id.toString() === userInfo?.user._id.toString());

//   // Free Registration
//   const handleRegister = async (userId) => {
//     if (!isLoggedIn) {
//       return toast({
//         title: "Hold on!",
//         description: "Please login first to register for the event.",
//         variant: "destructive",
//       });
//     }

//     setLoadingEventId(event._id);
//     try {
//       await api.patch(`/events/register/${event._id}/${userId}`);
//       fetchEvent();
//     } catch (err) {
//       console.error("Error registering for event:", err);
//     } finally {
//       setLoadingEventId(null);
//     }
//   };

//   // Paid Registration → Payment
//   const handlePaidRegister = async (userId) => {
//     if (!isLoggedIn) {
//       return toast({
//         title: "Hold on!",
//         description: "Please login first to register for the event.",
//         variant: "destructive",
//       });
//     }

//     setLoadingEventId(event._id);
//     try {
//       const res = await api.post(`/phonepe/payment/initiate/${event._id}`, {
//         amount: event.fee,
//         item_type: "event",
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
//       setLoadingEventId(null);
//     }
//   };

//   // Unregister
//   const handleUnregister = async (userId) => {
//     if (!isLoggedIn) {
//       return toast({
//         title: "Hold on!",
//         description: "Please login first to unregister for the event.",
//         variant: "destructive",
//       });
//     }

//     setLoadingEventId(event._id);
//     try {
//       await api.patch(`/events/unregister/${event._id}/${userId}`);
//       fetchEvent();
//       toast({ description: "Unregistered successfully." });
//     } catch (err) {
//       console.error("Error unregistering for event:", err);
//       toast({
//         title: "Can't unregister.",
//         description: "Please try again later.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingEventId(null);
//     }
//   };

//   // Delete event
//   const deleteEvent = async () => {
//     setDeleting(true);
//     try {
//       await api.delete(`/events/${event._id}`);
//       toast({ title: "Event deleted successfully!" });
//       navigate("/events");
//     } catch (error) {
//       console.error("Error deleting event:", error.message);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center h-64">
//         <p className="text-gray-100">Loading...</p>
//       </div>
//     );
//   }

//   if (!event) {
//     return (
//       <p className="min-h-screen flex flex-col items-center justify-center h-64">
//         Event not found.
//       </p>
//     );
//   }

//   // Format date & time
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

//   return (
//     <div className="min-h-screen bg-space-dark text-white pt-20 px-4">
//       <main className="container mx-auto px-4 pt-8 pb-16">
//         <div className="max-w-4xl mx-auto space-y-8">
//           {/* Thumbnail */}
//           <img
//             src={event.thumbnail}
//             alt={event.title}
//             className="w-full max-h-[500px] object-cover rounded-xl mb-6 aspect-[16/9]"
//           />

//           {/* Title & Description */}
//           <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
//           <p className="text-gray-400 text-lg mb-8">{event.description}</p>

//           {/* Event Info Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
//             <div className="space-y-4">
//               <div className="flex items-center text-gray-400">
//                 <Calendar className="h-5 w-5 mr-2 text-space-accent" />
//                 {formatDate(event.eventDate)}
//               </div>
//               <div className="flex items-center text-gray-400">
//                 <Clock className="h-5 w-5 mr-2 text-space-accent" />
//                 {formatTime(event.eventDate)}
//               </div>
//               <div className="flex items-center text-gray-400">
//                 <MapPin className="h-5 w-5 mr-2 text-space-accent" />
//                 {event.location}
//               </div>
//               <div className="flex items-center text-gray-400">
//                 <Users className="h-5 w-5 mr-2 text-space-accent" />
//                 {event.registeredUsers.length} attending
//               </div>
//               <div className="flex items-center text-gray-400">
//                 <Video className="h-5 w-5 mr-2 text-space-accent" />
//                 {event.eventType}
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold text-white">Hosted by:</h3>
//                 <ul className="text-space-accent list-disc list-inside">
//                   {event.hostedBy.map((host, index) => (
//                     <p key={index}>{host.name}</p>
//                   ))}
//                 </ul>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-white">Presented by:</h3>
//                 <p className="text-gray-300">{event.presentedBy}</p>
//               </div>
//             </div>
//           </div>

//           {/* Register Button */}
//           <button
//             onClick={() =>
//               isRegistered()
//                 ? event.isFree
//                   ? handleUnregister(userInfo?.user._id)
//                   : null // paid registered → cannot unregister
//                 : event.isFree
//                 ? handleRegister(userInfo?.user._id)
//                 : handlePaidRegister(userInfo?.user._id)
//             }
//             disabled={!event.isFree && isRegistered()} // disable click for paid+registered
//             className={`w-full md:w-auto px-6 py-3 rounded-md transition text-white font-semibold flex justify-center
//               ${
//                 isLoggedIn && isRegistered()
//                   ? event.isFree
//                     ? "bg-space-purple/30 hover:bg-space-purple/50"
//                     : "bg-gray-500 cursor-not-allowed"
//                   : "bg-space-accent hover:bg-space-accent/80"
//               }`}
//           >
//             {loadingEventId === event._id ? (
//               <Spinner />
//             ) : isLoggedIn && isRegistered() ? (
//               event.isFree ? (
//                 "Unregister"
//               ) : (
//                 "Already Registered (Paid)"
//               )
//             ) : event.isFree ? (
//               "Register for this Event"
//             ) : (
//               `Register - ₹${event.fee}`
//             )}
//           </button>

//           {/* Delete button if creator */}
//           {userInfo && event.createdBy._id === userInfo.user?._id && (
//             <div>
//               <hr className="mb-3" />
//               <button
//                 onClick={() => {
//                   if (
//                     window.confirm(
//                       "Are you sure you want to delete this event? This action can't be undone."
//                     )
//                   ) {
//                     deleteEvent();
//                   }
//                 }}
//                 className="bg-red-600 text-white px-3 py-1 rounded mt-2"
//               >
//                 {deleting ? <Spinner /> : "Delete Event"}
//               </button>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default EventDetails;


import { Calendar, MapPin, Clock, Users, Video } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";

const EventDetails = () => {
  const { slug } = useParams();
  const { userInfo, isLoggedIn } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${slug}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  // Helpers
  const isRegistered = () =>
    event?.registeredUsers.some((e) => e._id.toString() === userInfo?.user._id.toString());

  // Free Registration
  const handleRegister = async (userId) => {
    if (!isLoggedIn) {
      return toast({
        title: "Hold on!",
        description: "Please login first to register for the event.",
        variant: "destructive",
      });
    }

    setLoadingEventId(event._id);
    try {
      await api.patch(`/events/register/${event._id}/${userId}`);
      fetchEvent();
    } catch (err) {
      console.error("Error registering for event:", err);
    } finally {
      setLoadingEventId(null);
    }
  };

  // Paid Registration → Payment
  const handlePaidRegister = async (userId) => {
    if (!isLoggedIn) {
      return toast({
        title: "Hold on!",
        description: "Please login first to register for the event.",
        variant: "destructive",
      });
    }

    setLoadingEventId(event._id);
    try {
      const res = await api.post(`/phonepe/payment/initiate/${event._id}`, {
        amount: event.fee,
        item_type: "event",
      });

      if (res.data?.redirect_url) {
        window.location.href = res.data.redirect_url; // redirect to PhonePe
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
      setLoadingEventId(null);
    }
  };

  // Unregister
  const handleUnregister = async (userId) => {
    if (!isLoggedIn) {
      return toast({
        title: "Hold on!",
        description: "Please login first to unregister for the event.",
        variant: "destructive",
      });
    }

    setLoadingEventId(event._id);
    try {
      await api.patch(`/events/unregister/${event._id}/${userId}`);
      fetchEvent();
      toast({ description: "Unregistered successfully." });
    } catch (err) {
      console.error("Error unregistering for event:", err);
      toast({
        title: "Can't unregister.",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingEventId(null);
    }
  };

  // Delete event
  const deleteEvent = async () => {
    setDeleting(true);
    try {
      await api.delete(`/events/${event._id}`);
      toast({ title: "Event deleted successfully!" });
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event:", error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center h-64">
        <p className="text-gray-100">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <p className="min-h-screen flex flex-col items-center justify-center h-64">
        Event not found.
      </p>
    );
  }

  // Format date & time
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

    const isScanner = event.scanners.some(s => s.toString() === userInfo.user._id.toString());

  return (
    <div className="min-h-screen bg-space-dark text-white pt-20 px-4">
      <main className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Thumbnail */}
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full max-h-[500px] object-cover rounded-xl mb-6 aspect-[16/9]"
          />

          {/* Title & Description */}
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <p className="text-gray-400 text-lg mb-8">{event.description}</p>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-4">
              <div className="flex items-center text-gray-400">
                <Calendar className="h-5 w-5 mr-2 text-space-accent" />
                {formatDate(event.eventDate)}
              </div>
              <div className="flex items-center text-gray-400">
                <Clock className="h-5 w-5 mr-2 text-space-accent" />
                {formatTime(event.eventDate)}
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-2 text-space-accent" />
                {event.location}
              </div>
              <div className="flex items-center text-gray-400">
                <Users className="h-5 w-5 mr-2 text-space-accent" />
                {event.registeredUsers.length} attending
              </div>
              <div className="flex items-center text-gray-400">
                <Video className="h-5 w-5 mr-2 text-space-accent" />
                {event.eventType}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white">Hosted by:</h3>
                <ul className="text-space-accent list-disc list-inside">
                  {event.hostedBy.map((host, index) => (
                    <p key={index}>{host.name}</p>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white">Presented by:</h3>
                <p className="text-gray-300">{event.presentedBy}</p>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={() =>
              isRegistered()
                ? event.isFree
                  ? handleUnregister(userInfo?.user._id)
                  : null
                : event.isFree
                ? handleRegister(userInfo?.user._id)
                : handlePaidRegister(userInfo?.user._id)
            }
            disabled={!event.isFree && isRegistered()}
            className={`w-full md:w-auto px-6 py-3 rounded-md transition text-white font-semibold flex justify-center
              ${
                isLoggedIn && isRegistered()
                  ? event.isFree
                    ? "bg-space-purple/30 hover:bg-space-purple/50"
                    : "bg-gray-500 cursor-not-allowed"
                  : "bg-space-accent hover:bg-space-accent/80"
              }`}
          >
            {loadingEventId === event._id ? (
              <Spinner />
            ) : isLoggedIn && isRegistered() ? (
              event.isFree ? (
                "Unregister"
              ) : (
                "Already Registered (Paid)"
              )
            ) : event.isFree ? (
              "Register for this Event"
            ) : (
              `Register - ₹${event.fee}`
            )}
          </button>

          {userInfo && event.createdBy._id === userInfo.user?._id && (<hr className="h-1 text-white"/>)}
          {/* Creator Only Buttons */}
        

{isScanner && (
  <button
    onClick={() => navigate(`/events/scanner/${event.slug}`)}
    className="bg-space-purple text-white px-3 py-1 rounded"
  >
    Scan
  </button>
)}
          {userInfo && event.createdBy._id === userInfo.user?._id && (
            <div className="flex space-x-4 mt-4">
              
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this event? This action can't be undone."
                    )
                  ) {
                    deleteEvent();
                  }
                }}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                {deleting ? <Spinner /> : "Delete Event"}
              </button>

              {/* Scan / Manage Scanners Button */}
              <button
                onClick={() =>
                  navigate(`/events/scanner/${event.slug}`)
                }
                className="bg-space-purple text-white px-3 py-1 rounded"
              >
                Scan / Manage Scanners
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventDetails;