import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const FeaturedSection = () => {
  // Featured Blog
  const { data: featuredBlog } = useQuery({
    queryKey: ["featuredBlog"],
    queryFn: async () => {
      const res = await api.get("/blogs/featured");
      return res.data || null;
    },
  });

  // Featured News
  const { data: featuredNews } = useQuery({
    queryKey: ["featuredNews"],
    queryFn: async () => {
      const res = await api.get("/news/articles");
      return res.data?.[0] || null;
    },
  });

  // Upcoming Event
  const { data: upcomingEvent } = useQuery({
    queryKey: ["upcomingEvent"],
    queryFn: async () => {
      const res = await api.get("/events");
      return res.data?.[0] || null;
    },
  });

  // Featured Webinar
  const { data: featuredWebinar } = useQuery({
    queryKey: ["featuredWebinar"],
    queryFn: async () => {
      const res = await api.get("/webinars/featured");
      return res.data || null;
    },
  });

  return (
    <section className="mb-12 py-4 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Top Picks
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto hidden md:block">
          Handpicked highlights: the best blogs, latest news, and upcoming
          events you shouldn’t miss.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Blog */}
        {featuredBlog && (
          <div className="cosmic-card overflow-hidden shadow-lg cursor-pointer">
            <Link to={`/blogs/${featuredBlog.slug}`}>
              <div className="relative aspect-[16/9] sm:aspect-video">
                <img
                  src={featuredBlog.thumbnail}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0" />
              </div>
              <div className="p-4 sm:p-6">
                <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
                  Featured Blog
                </p>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {featuredBlog.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  Date: {new Date(featuredBlog.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400 mb-3 sm:block">
                  {featuredBlog.description}
                </p>
                <p className="text-xs text-gray-500">
                  Author:{" "}
                  {featuredBlog.author?.name
                    ? featuredBlog.author.name.toUpperCase()
                    : "Unknown"}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Featured News */}
        {featuredNews && (
          <div className="cosmic-card overflow-hidden shadow-lg cursor-pointer">
            <Link to={featuredNews.url}>
              <div className="relative aspect-[16/9] sm:aspect-video">
                <img
                  src={featuredNews.image_url}
                  alt={featuredNews.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0" />
              </div>
              <div className="p-4 sm:p-6">
                <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
                  News
                </p>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {featuredNews.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3 sm:block">
                  {featuredNews.summary.slice(0, 150)}...
                </p>
                <p className="text-xs text-gray-500">
                  Source: {featuredNews.news_site}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Upcoming Event OR Featured Webinar */}
        {upcomingEvent ? (
          <div className="cosmic-card overflow-hidden shadow-lg cursor-pointer">
            <Link to={`/events/${upcomingEvent.slug}`}>
              <div className="relative aspect-[16/9] sm:aspect-video">
                <img
                  src={upcomingEvent.thumbnail}
                  alt={upcomingEvent.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0" />
              </div>
              <div className="p-4 sm:p-6">
                <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
                  Upcoming Event
                </p>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {upcomingEvent.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  Date:{" "}
                  {new Date(upcomingEvent.eventDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400 mb-3 sm:block">
                  {upcomingEvent.description.slice(0, 150)}...
                </p>
                <p className="text-xs text-gray-500">
                  Venue: {upcomingEvent.location}
                </p>
              </div>
            </Link>
          </div>
        ) : (
          featuredWebinar && (
            <div className="cosmic-card overflow-hidden shadow-lg cursor-pointer">
              <Link to={`/webinars/${featuredWebinar.slug}`}>
                <div className="relative aspect-[16/9] sm:aspect-video">
                  <img
                    src={featuredWebinar.thumbnail}
                    alt={featuredWebinar.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" />
                </div>
                <div className="p-4 sm:p-6">
                  <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
                    Featured Webinar
                  </p>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {featuredWebinar.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Date:{" "}
                    {new Date(featuredWebinar.webinarDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400 mb-3 sm:block">
                    {featuredWebinar.description.slice(0, 150)}...
                  </p>
                  <p className="text-xs text-gray-500">
                    Presenter: {featuredWebinar.presenter || "TBA"}
                  </p>
                </div>
              </Link>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;