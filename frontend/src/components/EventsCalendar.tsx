import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Skeleton } from "@mui/material";

const EventsCalendar = () => {
  const [launches, setLaunches] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const res = api
      .get("/launches")
      .then((res) => {
        setLaunches(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events", err);
        setLoading(false); // also stop loading on error
      });
  }, []);

  // to show the date in readable format
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // to set time in readable format
  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (loading) {
    return (
      <section className="py-10 bg-space-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Upcoming Rocket Launches
            </h2>
            <p className="text-xl hidden md:block text-gray-400 max-w-3xl mx-auto">
              Mark your calendar for these thrilling space launches and join our community watch parties as we witness history being made beyond Earth’s atmosphere.
            </p>
          </div>

          <div className="overflow-x-auto md:overflow-visible scrollbar-hide scroll-smooth">
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-[640px] md:min-w-0 snap-x snap-mandatory">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="cosmic-card border-none overflow-hidden bg-space-dark/60 flex-shrink-0 w-72 md:w-auto snap-start"
                >
                  <Skeleton variant="rectangular" height={160} sx={{ bgcolor: 'grey.900' }} />
                  <CardContent className="p-4">
                    <Skeleton variant="text" width="60%" sx={{ bgcolor: 'grey.900' }}/>
                    <Skeleton variant="text" sx={{ bgcolor: 'grey.900' }} />
                    <Skeleton variant="text" sx={{ bgcolor: 'grey.900' }} />
                    <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'grey.900', mt: 1, mb: 1 }}/>
                    <Skeleton variant="text" width="40%" sx={{ bgcolor: 'grey.900' }}/>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-space-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Upcoming Rocket Launches
          </h2>
          <p className="text-xl hidden md:block text-gray-400 max-w-3xl mx-auto">
            Mark your calendar for these thrilling space launches and join our community watch parties as we witness history being made beyond Earth’s atmosphere.
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
                    <img
                      src={launch.image?.image_url}
                      loading="lazy"
                      alt="event"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm mb-2 text-space-accent">
                    {formatDate(launch.window_start)} at {formatTime(launch.window_start)} IST
                  </p>
                  <p className="mb-2 min-h-[3rem]">{launch.name}</p>
                  <p className="text-gray-400 min-h-[5rem] mb-2">
                    {launch.mission?.description
                      ?.split(" ")
                      .slice(0, 20)
                      .join(" ")}
                  </p>
                  <p className="text-xs text-gray-500">Launched By: {launch.launch_service_provider.name}</p>
                </CardContent>
              </Card>
            ))}

            {/* for xs screens - view full and hide */}
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
            {showAll && (
              <div className="flex-shrink-0 w-72 md:hidden flex items-center justify-center snap-start">
                <button
                  onClick={() => setShowAll(false)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
                >
                  Show Less
                </button>
              </div>
            )}
          </div>
        </div>

        {/* for large screens - view all and hide */}
        {launches.length > 3 && !showAll && (
          <div className="text-center mt-10 hidden md:block">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
            >
              View More Launches
            </button>
          </div>
        )}
        {launches.length > 3 && showAll && (
          <div className="text-center mt-10 hidden md:block">
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsCalendar;