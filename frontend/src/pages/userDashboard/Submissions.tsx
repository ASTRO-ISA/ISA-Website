import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function Submissions() {
  const { userInfo } = useAuth();

  const fetchBlogs = async ({ queryKey }) => {
    const [_key, userId] = queryKey;
    const res = await api.get(`/blogs/my-blogs/${userId}`);
    return res.data;
  };
  const fetchSuggestedBlogs = async () => {
    const res = await api.get(`/suggest-blog/blogs-suggested-by`);
    return res.data;
  };
  const fetchEvents = async ({ queryKey }) => {
    const [_key, userId] = queryKey;
    const res = await api.get(`/events/my-events/${userId}`);
    return res.data;
  };
  const fetchResearchPapers = async ({ queryKey }) => {
    const [_key, userId] = queryKey;
    const res = await api.get(`/research-papers/my-papers/${userId}`);
    return res.data;
  };

  const { data: userBlogs, isLoading: loadingUserBlogs } = useQuery({
    queryKey: ["blogs", userInfo?.user?._id],
    queryFn: fetchBlogs,
    enabled: !!userInfo?.user?._id,
  });
  const { data: userSuggestedBlogs, isLoading: loadingUserSuggestedBlogs } =
    useQuery({
      queryKey: ["SuggestedBlogs", userInfo?.user?._id],
      queryFn: fetchSuggestedBlogs,
      enabled: !!userInfo?.user?._id,
    });
  const { data: userEvents, isLoading: loadingUserEvents } = useQuery({
    queryKey: ["events", userInfo?.user?._id],
    queryFn: fetchEvents,
    enabled: !!userInfo?.user?._id,
  });
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
        <h3 className="text-lg font-bold mb-2 text-white group-hover:underline">
          {item.title || item.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3">{item.description}</p>
        <p className="text-xs text-gray-500 mb-2">
          Submitted on {new Date(item.createdAt).toLocaleDateString()}
        </p>
        {type === "event" && (
          <p className="text-xs text-gray-400 mb-2">
            Event Date: {new Date(item.eventDate).toDateString()}
          </p>
        )}
        {type === "paper" && (
          <p className="text-xs text-gray-400 mb-2">Journal: {item.journal}</p>
        )}
        {(type === "suggested-blogs" || type === "paper" || type === "blog") &&
          item.status === "rejected" &&
          item.response && (
            <p className="text-xs text-gray-400 mb-2">
              <span className="text-white">Response: </span> {item.response}
            </p>
          )}
        {(type === "blog" || type === "paper" || type === "suggested-blogs") && (
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
        {/* {item.status === "rejected" && item.adminComment && ( */}
          <p className="text-xs text-red-300 mt-2">
            <strong>Admin Comment:</strong> {item.adminComment}
          </p>
        {/* )} */}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      {/* Info message */}
      <div className="mb-4">
        <p className="text-sm text-yellow-300 bg-yellow-900/40 border border-yellow-700 rounded-md p-3">
          ! If your submission gets{" "}
          <span className="font-semibold">rejected</span>, you will only see its
          rejected status for <span className="font-semibold">two days</span>.
          However, you will also receive an email notification.
        </p>
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="w-full space-y-3">
        <AccordionItem value="blogs">
          <AccordionTrigger className="text-xl font-semibold text-white">Blogs</AccordionTrigger>
          <AccordionContent>
            {loadingUserBlogs ? (
              <p>Loading...</p>
            ) : userBlogs?.length ? (
              <div className="space-y-4">
                {userBlogs.map((e) => renderCard(e, "blog"))}
              </div>
            ) : (
              <p className="text-gray-400">No blogs found.</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="events">
          <AccordionTrigger className="text-xl font-semibold text-white">Events</AccordionTrigger>
          <AccordionContent>
            {loadingUserEvents ? (
              <p>Loading...</p>
            ) : userEvents?.length ? (
              <div className="space-y-4">
                {userEvents.map((e) => renderCard(e, "event"))}
              </div>
            ) : (
              <p className="text-gray-400">No events found.</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="papers">
          <AccordionTrigger className="text-xl font-semibold text-white">Research Papers</AccordionTrigger>
          <AccordionContent>
            {loadingUserPapers ? (
              <p>Loading...</p>
            ) : userResearchPapers?.length ? (
              <div className="space-y-4">
                {userResearchPapers.map((e) => renderCard(e, "paper"))}
              </div>
            ) : (
              <p className="text-gray-400">No research papers found.</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="suggested-blogs">
          <AccordionTrigger className="text-xl font-semibold text-white hover:no-underline">Suggested Blogs</AccordionTrigger>
          <AccordionContent>
            {loadingUserSuggestedBlogs ? (
              <p>Loading...</p>
            ) : userSuggestedBlogs?.data?.length ? (
              <div className="space-y-4">
                {userSuggestedBlogs.data.map((e) =>
                  renderCard(e, "suggested-blogs")
                )}
              </div>
            ) : (
              <p className="text-gray-400">No suggested blogs found.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}