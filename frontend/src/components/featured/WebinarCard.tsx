import { Link } from "react-router-dom";

const WebinarCard = ({ webinar }) => {
  if (!webinar) return null;

  return (
    <div className="cosmic-card overflow-hidden shadow-lg cursor-pointer">
      <Link to={`/webinars/${webinar._id}`}>
        <div className="relative aspect-[16/9] sm:aspect-video">
          <img
            src={webinar.thumbnail}
            alt={webinar.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0" />
        </div>
        <div className="p-4 sm:p-6">
          <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
            Featured Webinar
          </p>
          <h3 className="text-lg sm:text-xl font-bold mb-2">{webinar.title}</h3>
          <p className="text-sm text-gray-400 mb-2">
            Date: {new Date(webinar.webinarDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-400 mb-3 sm:block">
            {webinar.description.slice(0, 150)}...
          </p>
          <p className="text-xs text-gray-500">Presenter: {webinar.presenter}</p>
        </div>
      </Link>
    </div>
  );
};

export default WebinarCard;