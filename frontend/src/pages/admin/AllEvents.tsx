import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  MoreHorizontal,
  Share,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import RegisterButton from "../event/RegisterButton"

const AllEvents = () => {
  const [pendingEvents, setPendingEvents] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingEventId, setLoadingEventId] = useState(null)
  const { toast } = useToast()
  const { userInfo, isLoggedIn } = useAuth()

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get("/events/pending", { withCredentials: true })
      setPendingEvents(res.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching events.")
    }
  }

  useEffect(() => {
    fetchPendingEvents()
  }, [])

  const changeStatus = async (id, newStatus) => {
    try {
      await api.patch(
        `/events/status/${id}`,
        { status: newStatus },
        { withCredentials: true }
      )
      toast({
        description: `Status changed to ${newStatus}`,
      })
      fetchPendingEvents()
    } catch (err) {
      toast({
        description: "Something went wrong changing the status.",
      })
    }
  }

  // Register handlers
  const handleRegister = async (userId, eventId) => {
    if (!isLoggedIn) {
      return toast({
        title: "Login Required",
        description: "Please login to register for this event.",
        variant: "destructive",
      })
    }
    setLoadingEventId(eventId)
    try {
      await api.post(
        `/events/register/${eventId}`,
        { userId },
        { withCredentials: true }
      )
      toast({ description: "Registered successfully" })
      fetchPendingEvents()
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong while registering.",
        variant: "destructive",
      })
    } finally {
      setLoadingEventId(null)
    }
  }

  const handleUnregister = async (userId, eventId) => {
    setLoadingEventId(eventId)
    try {
      await api.post(
        `/events/unregister/${eventId}`,
        { userId },
        { withCredentials: true }
      )
      toast({ description: "Unregistered successfully" })
      fetchPendingEvents()
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong while unregistering.",
        variant: "destructive",
      })
    } finally {
      setLoadingEventId(null)
    }
  }

  const handlePaidRegister = async (userId, event) => {
    if (!isLoggedIn) {
      return toast({
        title: "Login Required",
        description: "Please login to register for this event.",
        variant: "destructive",
      })
    }
    setLoadingEventId(event._id)
    try {
      const res = await api.post(
        `/phonepe/payment/initiate/${event._id}`,
        {
          amount: event.fee,
          item_type: "event",
        },
        { withCredentials: true }
      )

      if (res.data?.redirect_url) {
        window.location.href = res.data.redirect_url
      } else {
        toast({
          title: "Payment Error",
          description: "Could not initiate payment.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Payment initiation failed:", err.message)
      toast({
        title: "Payment Error",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      })
    } finally {
      setLoadingEventId(null)
    }
  }

  // Format helpers
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

  return (
    <main>
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Pending Events</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {loading ? (
            <p>Loading...</p>
          ) : pendingEvents.length === 0 ? (
            <p>Nothing to see here right now!</p>
          ) : (
            (showAll ? pendingEvents : pendingEvents.slice(0, 3)).map(
              (event) => (
                <div
                  key={event._id}
                  className="cosmic-card overflow-hidden group relative flex flex-col"
                >
                  <Link
                    to={`/events/${event.slug}`}
                    className="flex-1 flex flex-col"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        loading="lazy"
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span
                          className={`${
                            new Date(event.eventDate) > new Date()
                              ? "text-space-accent"
                              : "text-space-purple"
                          } uppercase text-xs font-bold tracking-widest mb-2`}
                        >
                          {new Date(event.eventDate) > new Date()
                            ? "Upcoming"
                            : "Completed"}
                        </span>
                        <h3 className="text-xl font-semibold mb-3">
                          {event.title}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatDate(event.eventDate)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatTime(event.eventDate)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPin className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Users className="h-4 w-4 mr-2 text-space-accent" />
                            <span>
                              {event.registeredUsers.length} attending
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm">
                          {event?.description
                            ?.split(" ")
                            .slice(0, 20)
                            .join(" ")}
                          ...
                        </p>
                      </div>

                      {/* RegisterButton integrated */}
                      <div className="mt-4">
                        <RegisterButton
                          event={event}
                          userInfo={userInfo}
                          loadingEventId={loadingEventId}
                          handleRegister={handleRegister}
                          handleUnregister={handleUnregister}
                          handlePaidRegister={handlePaidRegister}
                          toast={toast}
                        />
                      </div>
                    </div>
                  </Link>

                  <div className="absolute top-3 right-3 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="text-white bg-black/40 hover:bg-black/60 rounded-full p-1">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black border border-gray-800 text-white text-sm shadow-xl">
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.share
                              ? navigator.share({
                                  title: event.title,
                                  text: "Check out this event!",
                                  url: `${window.location.origin}/events/${event.slug}`,
                                })
                              : alert("Sharing not supported on this browser.")
                          }
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Share size={14} /> Share
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            changeStatus(event._id, "approved")
                          }}
                        >
                          Approve
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            changeStatus(event._id, "rejected")
                          }}
                        >
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {pendingEvents.length > 3 && !showAll && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
            >
              View All Events
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default AllEvents