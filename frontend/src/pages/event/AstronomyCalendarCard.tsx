import { CalendarDays, Clock } from "lucide-react";

const AstronomyCalendarCard = ({ content, date, image, title }) => {
  return (
    <div className="bg-gray-900 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-all">
      <img src={image.trim()} alt={title} />
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-gray-300 text-sm flex-grow">{content}</p>

        {/* Footer Section */}
        <div className="mt-4 space-y-1 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-orange-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-yellow-400" />
            <span>All Night</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstronomyCalendarCard;
