import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import BlogCard from "./BlogCard";
import NewsCard from "./NewsCard";
import EventCard from "./EventCard";
import WebinarCard from "./WebinarCard";

const FeaturedSection = () => {
  // Queries
  const { data: featuredBlog, isLoading: blogLoading, error: blogError } = useQuery({
    queryKey: ["featuredBlog"],
    queryFn: async () => (await api.get("/blogs/featured")).data ?? null,
    initialData: null,
  });

  const validateUrl = async (url) => {
    try {
      const res = await fetch(url, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  };

    const { data: featuredNews, isLoading: newsLoading, error: newsError } = useQuery({
    queryKey: ["featuredNews"],
    queryFn: async () => {
        const res = await api.get("/news/articles");
        const firstNews = res.data?.[0] ?? null;

        if (firstNews && firstNews.url) {
        const valid = await validateUrl(firstNews.url);
        return valid ? firstNews : null; // skip if blocked
        }
        return null;
    },
    initialData: null,
    });

    const { data: upcomingLaunches, isLoading: launchLoading, error: launchError } = useQuery({
        queryKey: ["upcomingLaunch"],
        queryFn: async () => (await api.get("/launches")).data?.[0] ?? null,
        initialData: null,
        });

  const { data: upcomingEvent, isLoading: eventLoading, error: eventError } = useQuery({
    queryKey: ["upcomingEvent"],
    queryFn: async () => (await api.get("/events")).data?.[0] ?? null,
    initialData: null,
  });

  const { data: featuredWebinar, isLoading: webinarLoading, error: webinarError } = useQuery({
    queryKey: ["featuredWebinar"],
    queryFn: async () => (await api.get("/webinars/featured")).data ?? null,
    initialData: null,
  });

  if (blogLoading || newsLoading || eventLoading || webinarLoading) return <p>Loading...</p>;
  if (blogError || newsError || eventError || webinarError) return <p>Error loading data</p>;

  return (
    <section className="mb-12 py-4 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Top Picks</h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto hidden md:block">
          Handpicked highlights: the best blogs, latest news, and upcoming
          events you shouldn’t miss.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <BlogCard blog={featuredBlog} />

  {featuredNews ? (
    <NewsCard news={featuredNews} upcomingLaunches={upcomingLaunches ? [upcomingLaunches] : []} />
  ) : (
    <div className="cosmic-card p-6 flex flex-col justify-center items-center text-center">
      <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
        Upcoming Launch 🚀
      </p>
      <h3 className="text-lg sm:text-xl font-bold">Stay tuned for the next big mission!</h3>
    </div>
  )}

  {upcomingEvent ? <EventCard event={upcomingEvent} /> : <WebinarCard webinar={featuredWebinar} />}
</div>
    </section>
  );
};

export default FeaturedSection;