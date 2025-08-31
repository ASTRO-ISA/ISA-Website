import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const AstronomyCalendarCard = ({ content, date, image, title }) => {
  return (
    <div
      className={cn(
        "cosmic-card rounded-2xl shadow-md overflow-hidden flex flex-col transition-all hover:shadow-lg"
      )}
    >
      <div className="w-full h-40 overflow-hidden">
        <img
          src={image?.trim()}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>

        <div className="text-gray-300 text-sm flex-grow overflow-y-auto max-h-24 pr-2">
          {content}
        </div>

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
