import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const EventsCalendar = () => {

  const [launches, setLaunches] = useState([])
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {

    const res = axios
    .get('http://localhost:3000/api/v1/launches')
    .then((res) => {
      setLaunches(res.data)
      setLoading(false)
    })
    .catch((err) => {
      console.error('Error fetching events', err)
    })
  }, [])

    // to show the date in readable format
    const formatDate = (dateStr) =>
      new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    
    // to set time in readable format
    const formatTime = (dateStr) =>
      new Date(dateStr).toLocaleTimeString('en-IN', {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return (
        <section className="py-10 bg-space-dark">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Upcoming Astronomical Events</h2>
              <p className="text-xl hidden md:block text-gray-400 max-w-3xl mx-auto">
                Mark your calendar for these celestial phenomena and join our community observation sessions.
              </p>
            </div>
      
            {/* Horizontally scrollable on small screens */}
<div className="overflow-x-auto md:overflow-visible scrollbar-hide scroll-smooth">
  <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-[640px] md:min-w-0 snap-x snap-mandatory">
    {(showAll ? launches : launches.slice(0, 4)).map((launch) => (
      <Card
        key={launch.id}
        className="cosmic-card border-none overflow-hidden bg-space-dark/60 flex-shrink-0 w-72 md:w-auto snap-start"
      >
        <div className="relative h-40 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-space-blue/30">
            <img src={launch.image?.image_url} loading="lazy" alt="event" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* <div className="text-white font-semibold">{formatDate(launch.window_start)}</div> */}
            <h3 className="text-xl font-bold text-white">{formatTime(launch.window_start)} IST</h3>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm mb-2">{formatDate(launch.window_start)}</p>
          <p className="text-gray-400 text-sm">
            {launch.mission?.description?.split(" ").slice(0, 20).join(" ")}
          </p>
          {/* <Link
            to={`/events/${launch.id}`}
            className="mt-4 text-space-accent hover:text-space-accent/80 text-sm font-medium"
          >
            Learn more →
          </Link> */}
        </CardContent>
      </Card>
    ))}

      {/* Show "View Full Calendar" button inline on mobile */}
      {!showAll && launches.length > 4 && (
        <div className="flex-shrink-0 w-72 md:hidden flex items-center justify-center snap-start">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
          >
            View Full Calendar
          </button>
        </div>
      )}
    </div>
  </div>
      
        {launches.length > 3 && !showAll && (
        <div className="text-center mt-10 hidden md:block">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
          >
            View Full Calendar
          </button>
        </div>
      )}
          </div>
        </section>
      );
};

export default EventsCalendar;
