// import { Calendar, MapPin, Clock, Users, Video } from "lucide-react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import api from "@/lib/api";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import Spinner from "@/components/ui/Spinner";
// import PaymentModal from "@/components/popups/PymentModal";
// import FormatDate from "@/components/ui/FormatDate";
// import FormatTime from "@/components/ui/FormatTime";
// import RegisterButton from "./RegisterButton";

// const EventDetails = () => {
//   const { slug } = useParams();
//   const { userInfo, isLoggedIn } = useAuth();
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState(false);
//   const [loadingEventId, setLoadingEventId] = useState(null);
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [selectedEvent, setSelectedEvent] = useState(null);

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

//   const isRegistered = () =>
//     event?.registeredUsers.some(
//       (e) => e.user === userInfo?.user?._id
//     );

//   const isSoldOut = () =>
//     event?.seatCapacity &&
//     event.registeredUsers.length >= event.seatCapacity &&
//     !isRegistered();

//   const isScanner = event?.scanners?.some(
//     (s) => s.toString() === userInfo?.user._id.toString()
//   );

//   const handleRegister = async (userId, eventId) => {
//     if (!isLoggedIn) {
//       return toast({
//         title: "Hold on!",
//         description: "Please login first to register for the event.",
//         variant: "destructive",
//       });
//     }

//     setLoadingEventId(eventId);
//     try {
//       await api.patch(`/events/register/${eventId}/${userId}`);
//       fetchEvent();
//     } catch (err) {
//       console.error("Error registering for event:", err);
//     } finally {
//       setLoadingEventId(null);
//     }
//   };

//   const handleUnregister = async (userId, eventId) => {
//     if (!isLoggedIn) {
//       return toast({
//         title: "Hold on!",
//         description: "Please login first to unregister for the event.",
//         variant: "destructive",
//       });
//     }

//     setLoadingEventId(eventId);
//     try {
//       await api.patch(`/events/unregister/${eventId}/${userId}`);
//       fetchEvent();
//       toast({ description: "Unregistered successfully." });
//     } catch (err) {
//       console.error("Error unregistering:", err);
//       toast({
//         description: "Can't unregister. Please try again later.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingEventId(null);
//     }
//   };

//   const handlePaidRegister = async (userId, eventData) => {
//     // Open payment modal instead of direct payment initiation
//     setSelectedEvent(eventData);
//   };

//   const deleteEvent = async () => {
//     setDeleting(true);
//     try {
//       await api.delete(`/events/${event._id}`);
//       toast({ description: "Event deleted successfully!" });
//       navigate("/events");
//     } catch (err) {
//       console.error("Error deleting event:", err);
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

//   return (
//     <div className="min-h-screen bg-space-dark text-white pt-20 px-4">
//       <main className="container mx-auto px-4 pt-8 pb-16">
//         <div className="max-w-4xl mx-auto space-y-8">
//           <img
//             src={event.thumbnail}
//             alt={event.title}
//             className="w-full max-h-[500px] object-cover rounded-xl mb-6 aspect-[16/9]"
//           />

//           <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
//           <p className="text-gray-400 text-lg mb-8">
//             {event.description}
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
//             <div className="space-y-4">
//               <div className="flex items-center text-gray-400">
//                 <Calendar className="h-5 w-5 mr-2 text-space-accent" />
//                 <FormatDate date={event.eventDate} />
//               </div>
//               <div className="flex items-center text-gray-400">
//                 <Clock className="h-5 w-5 mr-2 text-space-accent" />
//                 <FormatTime date={event.eventDate} />
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

//           {/* Register Button (cleaned) */}
//           <RegisterButton
//             event={event}
//             userInfo={userInfo}
//             loadingEventId={loadingEventId}
//             handleRegister={handleRegister}
//             handleUnregister={handleUnregister}
//             handlePaidRegister={handlePaidRegister}
//             toast={toast}
//           />

//           {/* Creator Only Buttons */}
//           {userInfo && event.createdBy._id === userInfo.user?._id && (
//             <>
//               <hr className="h-1 text-white mt-4" />
//               <div className="flex space-x-4 mt-4">
//                 <button
//                   onClick={() => {
//                     if (
//                       window.confirm(
//                         "Are you sure you want to delete this event? This action can't be undone."
//                       )
//                     ) {
//                       deleteEvent();
//                     }
//                   }}
//                   className="bg-red-600 text-white px-3 py-1 rounded"
//                 >
//                   {deleting ? <Spinner /> : "Delete Event"}
//                 </button>

//                 <button
//                   onClick={() =>
//                     navigate(`/events/scanner/${event.slug}`)
//                   }
//                   className="bg-space-purple text-white px-3 py-1 rounded"
//                 >
//                   Scan / Manage Scanners
//                 </button>
//               </div>
//             </>
//           )}

//           {/* Scanner Button */}
//           {isScanner && (
//             <button
//               onClick={() => navigate(`/events/scanner/${event.slug}`)}
//               className="bg-space-purple text-white px-3 py-1 rounded mt-4"
//             >
//               Scan
//             </button>
//           )}
//         </div>
//       </main>

//       {selectedEvent && (
//         <PaymentModal
//           event={selectedEvent}
//           userId={userInfo?.user?._id}
//           onClose={() => setSelectedEvent(null)}
//         />
//       )}
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
import PaymentModal from "@/components/popups/PymentModal";
import FormatDate from "@/components/ui/FormatDate";
import FormatTime from "@/components/ui/FormatTime";
import RegisterButton from "./RegisterButton";

const EventDetails = () => {
  const { slug } = useParams();
  const { userInfo, isLoggedIn } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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

  const isRegistered = () =>
    event?.registeredUsers.some(
      (e: any) => e.user === userInfo?.user?._id
    );

  const isSoldOut = () =>
    event?.seatCapacity &&
    event.registeredUsers.length >= event.seatCapacity &&
    !isRegistered();

  const isScanner = event?.scanners?.some(
    (s: string) => s.toString() === userInfo?.user._id.toString()
  );

  const handleRegister = async (userId: string, eventId: string) => {
    if (!isLoggedIn) {
      return toast({
        title: "Hold on!",
        description: "Please login first to register for the event.",
        variant: "destructive",
      });
    }

    setLoadingEventId(eventId);
    try {
      await api.patch(`/events/register/${eventId}/${userId}`);
      fetchEvent();
    } catch (err) {
      console.error("Error registering for event:", err);
    } finally {
      setLoadingEventId(null);
    }
  };

  const handleUnregister = async (userId: string, eventId: string) => {
    if (!isLoggedIn) {
      return toast({
        title: "Hold on!",
        description: "Please login first to unregister for the event.",
        variant: "destructive",
      });
    }

    setLoadingEventId(eventId);
    try {
      await api.patch(`/events/unregister/${eventId}/${userId}`);
      fetchEvent();
      toast({ description: "Unregistered successfully." });
    } catch (err) {
      console.error("Error unregistering:", err);
      toast({
        description: "Can't unregister. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingEventId(null);
    }
  };

  const handlePaidRegister = async (_userId: string, eventData: any) => {
    setSelectedEvent(eventData);
  };

  const deleteEvent = async () => {
    setDeleting(true);
    try {
      await api.delete(`/events/${event._id}`);
      toast({ description: "Event deleted successfully!" });
      navigate("/events");
    } catch (err) {
      console.error("Error deleting event:", err);
    } finally {
      setDeleting(false);
    }
  };

  const toggleRegistration = async () => {
    try {
      await api.patch(`/events/${event._id}/toggle-registration`);
      toast({ description: "Registration status updated!" });
      fetchEvent();
    } catch (err) {
      console.error("Toggle registration error:", err);
      toast({
        description: "Failed to update registration status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-100">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <p className="min-h-screen flex flex-col items-center justify-center">
        Event not found.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-space-dark text-white pt-20 px-4">
      <main className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full max-h-[500px] object-cover rounded-xl mb-6 aspect-[16/9]"
          />

          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <p className="text-gray-400 text-lg mb-8">
            {event.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-4">
              <div className="flex items-center text-gray-400">
                <Calendar className="h-5 w-5 mr-2 text-space-accent" />
                <FormatDate date={event.eventDate} />
              </div>
              <div className="flex items-center text-gray-400">
                <Clock className="h-5 w-5 mr-2 text-space-accent" />
                <FormatTime date={event.eventDate} />
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
                  {event.hostedBy.map((host: any, index: number) => (
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

          <RegisterButton
            event={event}
            userInfo={userInfo}
            loadingEventId={loadingEventId}
            handleRegister={handleRegister}
            handleUnregister={handleUnregister}
            handlePaidRegister={handlePaidRegister}
            toast={toast}
          />

          {/* Creator Only Buttons */}
          {userInfo && event.createdBy._id === userInfo.user?._id && (
            <>
              <hr className="h-1 text-white mt-6" />

              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={toggleRegistration}
                  disabled={isSoldOut()}
                  className={`px-3 py-1 rounded text-white ${
                    event.isRegistrationOpen ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {event.isRegistrationOpen
                    ? "Disable Registration"
                    : "Enable Registration"}
                </button>

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
                  className="bg-red-700 text-white px-3 py-1 rounded"
                >
                  {deleting ? <Spinner /> : "Delete Event"}
                </button>

                <button
                  onClick={() => navigate(`/events/scanner/${event.slug}`)}
                  className="bg-space-purple text-white px-3 py-1 rounded"
                >
                  Scan / Manage Scanners
                </button>
              </div>
            </>
          )}

          {isScanner && (
            <button
              onClick={() => navigate(`/events/scanner/${event.slug}`)}
              className="bg-space-purple text-white px-3 py-1 rounded mt-4"
            >
              Scan
            </button>
          )}
        </div>
      </main>

      {selectedEvent && (
        <PaymentModal
          event={selectedEvent}
          userId={userInfo?.user?._id}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventDetails;