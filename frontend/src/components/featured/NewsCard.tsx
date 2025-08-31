import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NewsCard = ({ news, upcomingLaunches }) => {
  const [validImage, setValidImage] = useState(true);

  useEffect(() => {
    if (!news?.image_url) {
      setValidImage(false);
      return;
    }

    const img = new Image();
    img.src = news.image_url;

    img.onload = () => setValidImage(true);
    img.onerror = () => setValidImage(false);
  }, [news]);

  // If no news at all
  if (!news) return null;

  // If image is invalid (blocked, broken, or missing) → fallback to launches
  if (!validImage) {
    return (
      <div className="cosmic-card overflow-hidden shadow-lg p-4">
        <h3 className="text-lg sm:text-xl font-bold mb-4">
          Upcoming Launches 🚀
        </h3>
        {upcomingLaunches?.length > 0 ? (
          <ul className="space-y-2">
            {upcomingLaunches.map((launch, index) => (
              <li key={index} className="text-sm text-gray-300">
                <span className="font-semibold">{launch.name}</span> —{" "}
                {new Date(launch.date).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No upcoming launches found.</p>
        )}
      </div>
    );
  }

  // Normal news card
  return (
    <div className="cosmic-card overflow-hidden shadow-lg cursor-pointer">
      <Link to={news.url}>
        <div className="relative aspect-[16/9] sm:aspect-video">
          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0" />
        </div>
        <div className="p-4 sm:p-6">
          <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
            News
          </p>
          <h3 className="text-lg sm:text-xl font-bold mb-2">{news.title}</h3>
          <p className="text-sm text-gray-400 mb-3 sm:block">
            {news.summary.slice(0, 150)}...
          </p>
          <p className="text-xs text-gray-500">Source: {news.news_site}</p>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;