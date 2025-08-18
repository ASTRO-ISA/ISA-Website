import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function Submissions() {
  const { userInfo } = useAuth();

  const fetchBlogs = async ({ queryKey }) => {
    const [_key, userId] = queryKey;
    const res = await api.get(`/blogs/my-blogs/${userId}`);
    return res.data;
  };
  
  const { data: userBlogs, isLoading: loadingUserBlogs } = useQuery({
    queryKey: ["blogs", userInfo?.user?._id],
    queryFn: fetchBlogs,
    enabled: !!userInfo?.user?._id, // only run if userId exists
  });

  const fetchEvents = async ({ queryKey }) => {
    const [_key, userId] = queryKey;
    const res = await api.get(`/events/my-events/${userId}`);
    return res.data;
  };

  const { data: userEvents, isLoading: loadingUserEvents } = useQuery({
    queryKey: ["events", userInfo?.user?._id],
    queryFn: fetchEvents,
    enabled: !!userInfo?.user?._id,
  });

  const fetchResearchPapers = async ({ queryKey }) => {
    const [_key, userId] = queryKey;
    const res = await api.get(`/research-papers/my-papers/${userId}`);
    return res.data;
  };

  const { data: userResearchPapers, isLoading: loadingUserPapers } = useQuery({
    queryKey: ["research_papers", userInfo?.user?._id],
    queryFn: fetchResearchPapers,
    enabled: !!userInfo?.user?._id,
  });

  const renderCard = (item, type) => (
    <Card
      key={item.id}
      className="w-full cosmic-card group flex flex-col cursor-pointer relative bg-gray-800/90 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <CardContent className="p-5 flex flex-col justify-between">
        {/* Title */}
        <h3 className="text-lg font-bold mb-2 text-white group-hover:underline">
          {item.title || item.name}
        </h3>
  
        {/* Description */}
        <p className="text-gray-400 text-sm mb-3">
          {item.description}
        </p>
  
        {/* Submission Date */}
        <p className="text-xs text-gray-500 mb-2">
          Submitted on {new Date(item.createdAt).toLocaleDateString()}
        </p>
  
        {/* Extra field for events & papers */}
        {type === "event" && (
          <p className="text-xs text-gray-400 mb-2">
            Event Date: {new Date(item.eventDate).toDateString()}
          </p>
        )}
        {type === "paper" && (
          <p className="text-xs text-gray-400 mb-2">
            Journal: {item.journal}
          </p>
        )}
  
        {/* Status */}
        {(type === "blog" || type === "paper") && (
          <p
            className={`text-sm font-semibold ${
              item.status === "approved"
                ? "text-green-400"
                : item.status === "pending"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {item.status}
          </p>
        )}
  
        {type === "event" && (
          <p
            className={`text-sm font-semibold ${
              item.statusAR === "approved"
                ? "text-green-400"
                : item.status === "pending"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {item.statusAR}
          </p>
        )}
  
        {/* Admin Comment if Rejected */}
        {item.status === "rejected" && item.adminComment && (
          <p className="text-xs text-red-300 mt-2">
            <strong>Admin Comment:</strong> {item.adminComment}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
  {/* Info message */}
  <div className="col-span-1 md:col-span-3 mb-4">
    <p className="text-sm text-yellow-300 bg-yellow-900/40 border border-yellow-700 rounded-md p-3">
      ! If your submission gets <span className="font-semibold">rejected</span>, 
      you will only see its rejected status for <span className="font-semibold">two days</span>. 
      However, you will also receive an email notification.
    </p>
  </div>

  {/* Blogs */}
  <motion.div whileHover={{ scale: 1.02 }} className="bg-space-purple/20 rounded-2xl p-4 shadow-lg">
    <h2 className="text-xl font-semibold mb-4 text-white">Blogs</h2>
    <div className="space-y-4">
      {loadingUserBlogs ? (<p>Loading...</p>) : (userBlogs ? userBlogs.map((e) => renderCard(e, "blog")) : (<p>No blogs found.</p>))}
    </div>
  </motion.div>

  {/* Events */}
  <motion.div whileHover={{ scale: 1.02 }} className="bg-space-purple/20 rounded-2xl p-4 shadow-lg">
    <h2 className="text-xl font-semibold mb-4 text-white">Events</h2>
    <div className="space-y-4">
      {loadingUserEvents ? (<p>Loading...</p>) : (userEvents ? userEvents.map((e) => renderCard(e, "event")) : (<p>No events found.</p>))}
    </div>
  </motion.div>

  {/* Research Papers */}
  <motion.div whileHover={{ scale: 1.02 }} className="bg-space-purple/20 rounded-2xl p-4 shadow-lg">
    <h2 className="text-xl font-semibold mb-4 text-white">Research Papers</h2>
    <div className="space-y-4">
      {loadingUserPapers ? (<p>Loading...</p>) : (userResearchPapers ? userResearchPapers.map((e) => renderCard(e, "paper")) : <p>No research papers found.</p>)}
    </div>
  </motion.div>
  </div>
  );
}