import UpcomingWebinars from "./UpcomingWebinars";
import FeaturedWebinars from "./FeaturedWebinar";
import PastWebinars from "./PastWebinars";

const Webinars = () => {
  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Webinars & Live Sessions</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with scientists, astronauts, and industry experts through
            interactive talks and sessions.
          </p>
        </div>

        {/* Upcoming Webinars */}
        <UpcomingWebinars />

        {/* Featured Session */}
        <FeaturedWebinars />

        {/* Past Webinars */}
        <PastWebinars />

      </main>
    </div>
  );
};

export default Webinars;
