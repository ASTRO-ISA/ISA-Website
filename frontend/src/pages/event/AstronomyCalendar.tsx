import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import AstronomyCalendarCard from "./AstronomyCalendarCard";
import api from "@/lib/api";

const fetchAstronomyEvents = async () => {
  const { data } = await api.get("external-blogs/astro-calender");
  return data;
};

function parseEventDate(dateStr) {
  const year = new Date().getFullYear();
  const parts = dateStr.split(",").map((p) => p.trim());
  const parsedDates = parts.map((part) => new Date(`${part} ${year}`));
  return parsedDates.sort((a, b) => a.getTime() - b.getTime())[0];
}

function getNearestEventIndex(events) {
  const today = new Date();
  const dates = events.map((e) => parseEventDate(e.date));

  let nearestIndex = 0;
  let minDiff = Infinity;

  dates.forEach((d, i) => {
    const diff = d.getTime() - today.getTime();
    if (diff >= 0 && diff < minDiff) {
      minDiff = diff;
      nearestIndex = i;
    }
  });

  return nearestIndex;
}

const AstronomyCalendar = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["astronomyEvents"],
    queryFn: fetchAstronomyEvents,
  });

  const events = data || [];
  const nearestIndex = getNearestEventIndex(events);

  // Create an array of refs for all cards
  const cardRefs = useRef([]);

  useEffect(() => {
    if (cardRefs.current[nearestIndex]) {
      cardRefs.current[nearestIndex].scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  }, [nearestIndex, events]);

  if (isLoading) {
    return <p className="text-white p-6">Loading events...</p>;
  }

  if (isError) {
    return <p className="text-red-500 p-6">Failed to load events.</p>;
  }

  return (
    <section className="py-10">
      <div className="mx-auto">
        {/* Horizontal Scroll Wrapper */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory items-stretch">
          {events.map((event, idx) => (
            <div
              key={idx}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="flex-shrink-0 w-72 md:w-80 lg:w-96 snap-start flex"
            >
              <AstronomyCalendarCard
                {...event}
                isNearest={idx === nearestIndex}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AstronomyCalendar;