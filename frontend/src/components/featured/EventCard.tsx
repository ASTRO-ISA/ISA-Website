import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  if (!event) return null;

  return (
    <div className="cosmic-card overflow-hidden shadow-lg cursor-pointer">
      <Link to={`/events/${event.slug}`}>
        <div className="relative aspect-[16/9] sm:aspect-video">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0" />
        </div>
        <div className="p-4 sm:p-6">
          <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
            Upcoming Event
          </p>
          <h3 className="text-lg sm:text-xl font-bold mb-2">{event.title}</h3>
          <p className="text-sm text-gray-400 mb-2">
            Date: {new Date(event.eventDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-400 mb-3 sm:block">
            {event.description.slice(0, 150)}...
          </p>
          <p className="text-xs text-gray-500">Venue: {event.location}</p>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;