import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AstronomyCalendarCard from "./AstronomyCalendarCard";
import api from "@/lib/api";

const fetchAstronomyEvents = async () => {
  const { data } = await api.get("external-blogs/astro-calender");
  return data; // backend should return an array of events
};

const AstronomyCalendar = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["astronomyEvents"],
    queryFn: fetchAstronomyEvents,
  });

  const [visibleCount, setVisibleCount] = useState(3);

  if (isLoading) {
    return <p className="text-white p-6">Loading events...</p>;
  }

  if (isError) {
    return <p className="text-red-500 p-6">Failed to load events.</p>;
  }

  const events = data || [];

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, events.length));
  };

  const handleReset = () => {
    setVisibleCount(3);
  };

  const visibleEvents = events.slice(0, visibleCount);

  return (
    <section className="px-6 py-10 bg-gray-950 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleEvents.map((event, idx) => (
          <AstronomyCalendarCard key={idx} {...event} />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-center mt-8">
        {visibleCount < events.length ? (
          <div className="flex gap-6 text-center mt-10">
            <button
              onClick={handleViewMore}
              className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
            >
              View All Events
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
            >
              Close All
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default AstronomyCalendar;
