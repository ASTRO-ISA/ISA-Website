import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FormatDate from "@/components/ui/FormatDate";
import FormatTime from "@/components/ui/FormatTime";

const UpcomingLaunches = ({ launches }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="py-10 bg-space-dark mb-16 pl-0 pr-0">
      <div className="container mx-auto px-4 pl-0 pr-0">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Upcoming Launches
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay up to date with all upcoming rocket launches and space missions around the world.
          </p>
        </div>

        {/* Horizontal Scrollable Cards (for all screens) */}
        <div className="overflow-x-auto scrollbar-hide scroll-smooth">
          <div className="flex gap-6 min-w-[640px] snap-x snap-mandatory">
            {launches.length === 0 ? (
              <p className="text-gray-400 text-sm">Nothing to see here right now!</p>
            ) : (
              (showAll ? launches : launches.slice(0, 6)).map((launch) => (
                <Card
                  key={launch.id || launch.name}
                  className="cosmic-card border-none overflow-hidden bg-space-dark/60 flex-shrink-0 w-72 snap-start min-h-[26rem]"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      loading="lazy"
                      src={launch.image?.image_url}
                      alt={launch.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-white min-h-[3rem]">
                        {launch.name}
                      </h3>

                      <div className="space-y-2 mb-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                          <FormatDate date={launch.window_start} />
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-space-accent" />
                          <FormatTime date={launch.window_start} />
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-space-accent" />
                          <span>{launch.launch_service_provider?.name}</span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-3 overflow-y-auto">
                        {launch.mission?.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {/* View More / Less Buttons */}
            {launches.length > 6 && (
              <div className="flex-shrink-0 w-72 flex items-center justify-center snap-start">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
                >
                  {showAll ? "Show Less" : "View All Launches"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingLaunches;