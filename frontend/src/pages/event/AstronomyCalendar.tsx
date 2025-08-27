import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AstronomyCalendarCard from "./AstronomyCalendarCard";
import api from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const fetchAstronomyEvents = async () => {
  const { data } = await api.get("external-blogs/astro-calender");
  return data;
};

function parseEventDate(dateStr: string) {
  const year = new Date().getFullYear();
  const parts = dateStr.split(",").map((p) => p.trim());
  const parsedDates = parts.map((part) => new Date(`${part} ${year}`));
  return parsedDates.sort((a, b) => a.getTime() - b.getTime())[0];
}

function getNearestEventIndex(events: { date: string }[]) {
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

  const [api, setApi] = useState<CarouselApi>();

  const events = data || [];
  const nearestIndex = getNearestEventIndex(events);

  useEffect(() => {
    if (api && events.length > 0) {
      api.scrollTo(nearestIndex);
    }
  }, [api, nearestIndex, events.length]);

  if (isLoading) {
    return <p className="text-white p-6">Loading events...</p>;
  }

  if (isError) {
    return <p className="text-red-500 p-6">Failed to load events.</p>;
  }

  return (
    <section className="px-6 py-10 bg-gray-950 ">
      <div className="max-w-5xl mx-auto">
        <Carousel setApi={setApi} opts={{ align: "center" }}>
          <CarouselContent>
            {events.map((event, idx) => (
              <CarouselItem
                key={idx}
                className="basis-4/5 md:basis-1/2 lg:basis-1/3"
              >
                <AstronomyCalendarCard
                  {...event}
                  isNearest={idx === nearestIndex}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default AstronomyCalendar;
