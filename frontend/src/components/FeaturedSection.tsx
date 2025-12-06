// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import api from "@/lib/api";

// const FeaturedSection = () => {
//   const { data: featuredBlog } = useQuery({
//     queryKey: ["featuredBlog"],
//     queryFn: async () => (await api.get("/blogs/featured")).data || null,
//   });

//   const { data: featuredNews } = useQuery({
//     queryKey: ["featuredNews"],
//     queryFn: async () => (await api.get("/news/articles")).data?.[0] || null,
//   });

//   const { data: upcomingEvent } = useQuery({
//     queryKey: ["upcomingEvent"],
//     queryFn: async () => (await api.get("/events")).data?.[0] || null,
//   });

//   const { data: featuredWebinar } = useQuery({
//     queryKey: ["featuredWebinar"],
//     queryFn: async () => (await api.get("/webinars/featured")).data || null,
//   });

//   const cardClass =
//     "cosmic-card flex flex-col flex-shrink-0 w-72 sm:w-80 lg:flex-1 lg:min-w-0 lg:max-w-none snap-start";

//   return (
//     <section className="mb-12 pt-16 px-4 sm:px-6">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
//           Top Picks
//         </h2>
//         <p className="text-xl text-gray-400 max-w-3xl mx-auto hidden md:block">
//           Handpicked highlights: the best blogs, latest news, and upcoming events you shouldn’t miss.
//         </p>
//       </div>

//       {/* Horizontal on mobile, grid-like on desktop */}
//       <div className="overflow-x-auto lg:overflow-visible scrollbar-hide">
//         <div className="flex gap-6 flex-nowrap lg:flex-wrap scroll-smooth snap-x snap-mandatory items-stretch justify-start lg:justify-center">

//           {featuredBlog && (
//             <div className={cardClass}>
//               <Link to={`/blogs/${featuredBlog.slug}`} className="flex flex-col h-full">
//                 <div className="h-[180px] shrink-0">
//                   <img
//                     src={featuredBlog.thumbnail}
//                     alt={featuredBlog.title}
//                     className="w-full h-full object-cover"
//                     loading="lazy"
//                   />
//                 </div>
//                 <div className="p-5 flex flex-col justify-between flex-1 h-[260px]">
//                   <div>
//                     <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
//                       Featured Blog
//                     </p>
//                     <h3 className="text-lg font-bold mb-2 line-clamp-2">
//                       {featuredBlog.title}
//                     </h3>
//                     <p className="text-sm text-gray-400 mb-2">
//                       Date: {new Date(featuredBlog.createdAt).toLocaleDateString()}
//                     </p>
//                     <p className="text-sm text-gray-400 line-clamp-3">
//                       {featuredBlog.description}
//                     </p>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-3">
//                     Author: {featuredBlog.author?.name?.toUpperCase() || "UNKNOWN"}
//                   </p>
//                 </div>
//               </Link>
//             </div>
//           )}

//           {featuredNews && (
//             <div className={cardClass}>
//               <Link to={featuredNews.url} className="flex flex-col h-full">
//                 <div className="h-[180px] shrink-0">
//                   <img
//                     src={featuredNews.image_url}
//                     alt={featuredNews.title}
//                     className="w-full h-full object-cover"
//                     loading="lazy"
//                   />
//                 </div>
//                 <div className="p-5 flex flex-col justify-between flex-1 h-[260px]">
//                   <div>
//                     <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
//                       News
//                     </p>
//                     <h3 className="text-lg font-bold mb-2 line-clamp-2">
//                       {featuredNews.title}
//                     </h3>
//                     <p className="text-sm text-gray-400 line-clamp-4">
//                       {featuredNews.summary}
//                     </p>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-3">
//                     Source: {featuredNews.news_site}
//                   </p>
//                 </div>
//               </Link>
//             </div>
//           )}

//           {(upcomingEvent || featuredWebinar) && (
//             <div className={cardClass}>
//               <Link
//                 to={
//                   upcomingEvent
//                     ? `/events/${upcomingEvent.slug}`
//                     : `/webinars/${featuredWebinar.slug}`
//                 }
//                 className="flex flex-col h-full"
//               >
//                 <div className="h-[180px] shrink-0">
//                   <img
//                     src={upcomingEvent ? upcomingEvent.thumbnail : featuredWebinar.thumbnail}
//                     alt={upcomingEvent ? upcomingEvent.title : featuredWebinar.title}
//                     className="w-full h-full object-cover"
//                     loading="lazy"
//                   />
//                 </div>
//                 <div className="p-5 flex flex-col justify-between flex-1 h-[260px]">
//                   <div>
//                     <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
//                       {upcomingEvent ? "Upcoming Event" : "Featured Webinar"}
//                     </p>
//                     <h3 className="text-lg font-bold mb-2 line-clamp-2">
//                       {upcomingEvent ? upcomingEvent.title : featuredWebinar.title}
//                     </h3>
//                     <p className="text-sm text-gray-400 line-clamp-3">
//                       {upcomingEvent ? upcomingEvent.description : featuredWebinar.description}
//                     </p>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-3">
//                     {upcomingEvent
//                       ? `Venue: ${upcomingEvent.location}`
//                       : `Presenter: ${featuredWebinar.presenter || "TBA"}`}
//                   </p>
//                 </div>
//               </Link>
//             </div>
//           )}

//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedSection;

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import api from "@/lib/api";

const FeaturedSection = () => {
  const {
    data: featuredBlog,
    isLoading: blogLoading,
  } = useQuery({
    queryKey: ["featuredBlog"],
    queryFn: async () => (await api.get("/blogs/featured")).data || null,
  });

  const {
    data: featuredNews,
    isLoading: newsLoading,
  } = useQuery({
    queryKey: ["featuredNews"],
    queryFn: async () => (await api.get("/news/articles")).data?.[0] || null,
  });

  const {
    data: upcomingEvent,
    isLoading: eventLoading,
  } = useQuery({
    queryKey: ["upcomingEvent"],
    queryFn: async () => (await api.get("/events")).data?.[0] || null,
  });

  const {
    data: featuredWebinar,
    isLoading: webinarLoading,
  } = useQuery({
    queryKey: ["featuredWebinar"],
    queryFn: async () => (await api.get("/webinars/featured")).data || null,
  });

  const isLoading =
    blogLoading || newsLoading || eventLoading || webinarLoading;

  const cardClass =
    "cosmic-card flex flex-col flex-shrink-0 w-72 sm:w-80 lg:flex-1 lg:min-w-0 lg:max-w-none snap-start";

  const SkeletonCard = () => (
    <div className={cardClass}>
      <div className="h-[180px]">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
        />
      </div>

      <div className="p-5 flex flex-col justify-between flex-1 h-[260px]">
        <div className="space-y-2">
          <Skeleton variant="text" width="40%" height={18} />
          <Skeleton variant="text" width="90%" height={22} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="95%" />
        </div>

        <Skeleton variant="text" width="50%" height={14} />
      </div>
    </div>
  );

  return (
    <section className="mb-12 pt-16 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Top Picks
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto hidden md:block">
          Handpicked highlights: the best blogs, latest news, and upcoming events
          you shouldn’t miss.
        </p>
      </div>

      {/* Horizontal on mobile, grid-like on desktop */}
      <div className="overflow-x-auto lg:overflow-visible scrollbar-hide">
        <div className="flex gap-6 flex-nowrap lg:flex-wrap scroll-smooth snap-x snap-mandatory items-stretch justify-start lg:justify-center">

          {isLoading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!isLoading && featuredBlog && (
            <div className={cardClass}>
              <Link to={`/blogs/${featuredBlog.slug}`} className="flex flex-col h-full">
                <div className="h-[180px] shrink-0">
                  <img
                    src={featuredBlog.thumbnail}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 h-[260px]">
                  <div>
                    <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
                      Featured Blog
                    </p>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">
                      {featuredBlog.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      Date:{" "}
                      {new Date(
                        featuredBlog.createdAt
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400 line-clamp-3 overflow-y-auto max-h-24 pr-2">
                      {featuredBlog.description}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Author:{" "}
                    {featuredBlog.author?.name?.toUpperCase() || "UNKNOWN"}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {!isLoading && featuredNews && (
            <div className={cardClass}>
              <Link to={featuredNews.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col h-full">
                <div className="h-[180px] shrink-0">
                  <img
                    src={featuredNews.image_url}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 h-[260px]">
                  <div>
                    <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
                      News
                    </p>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">
                      {featuredNews.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-4 overflow-y-auto max-h-24 pr-2">
                      {featuredNews.summary}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Source: {featuredNews.news_site}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {!isLoading && (upcomingEvent || featuredWebinar) && (
            <div className={cardClass}>
              <Link
                to={
                  upcomingEvent
                    ? `/events/${upcomingEvent.slug}`
                    : `/webinars/${featuredWebinar.slug}`
                }
                className="flex flex-col h-full"
              >
                <div className="h-[180px] shrink-0">
                  <img
                    src={
                      upcomingEvent
                        ? upcomingEvent.thumbnail
                        : featuredWebinar.thumbnail
                    }
                    alt={
                      upcomingEvent
                        ? upcomingEvent.title
                        : featuredWebinar.title
                    }
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 h-[260px]">
                  <div>
                    <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
                      {upcomingEvent
                        ? "Upcoming Event"
                        : "Featured Webinar"}
                    </p>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">
                      {upcomingEvent
                        ? upcomingEvent.title
                        : featuredWebinar.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-3 overflow-y-auto max-h-24 pr-2">
                      {upcomingEvent
                        ? upcomingEvent.description
                        : featuredWebinar.description}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    {upcomingEvent
                      ? `Venue: ${upcomingEvent.location}`
                      : `Presenter: ${
                          featuredWebinar.presenter || "TBA"
                        }`}
                  </p>
                </div>
              </Link>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;