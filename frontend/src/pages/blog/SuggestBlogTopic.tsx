import api from "@/lib/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";

const SuggestBlogTopic = () => {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [blogSuggest, setBlogSuggest] = useState({
    title: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogSuggest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitTopic = async (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      try {
        setSubmitting(true);
        await api.post("/suggestBlog/", blogSuggest);
        setBlogSuggest({
          title: "",
          description: "",
        });
        setSubmitting(false);
        toast({ title: "Suggesion posted successfully." });
      } catch (error) {
        toast({ title: "something went wrong" });
        setSubmitting(false);
      }
    } else {
      toast({
        title: "Hold on!",
        description: "Login to suggest your beautiful ideas.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <section className="cosmic-card p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Suggest a Blog Topic</h2>
            <p className="text-gray-300 mb-6">
              Got a Speaker or Topic in Mind? We'd Love to Hear from You!
            </p>

            <form className="space-y-4">
              <input
                type="text"
                name="title"
                value={blogSuggest.title}
                onChange={handleChange}
                placeholder="Suggested Speaker or Topic"
                className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
              />
              <textarea
                name="description"
                value={blogSuggest.description}
                onChange={handleChange}
                placeholder="Why this would be valuable (description)"
                rows={3}
                className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
              ></textarea>
              <button
                onClick={handleSubmitTopic}
                type="submit"
                className="bg-space-accent hover:bg-space-accent/80 text-white px-6 py-2 rounded transition-colors"
              >
                {submitting ? <Spinner /> : "Submit Suggestion"}
              </button>
            </form>
          </div>
          <div className="md:w-1/4">
            <img
              loading="lazy"
              src="images/questionmark.png"
              alt="Space Speaker"
              className="rounded-lg h-auto w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuggestBlogTopic;
