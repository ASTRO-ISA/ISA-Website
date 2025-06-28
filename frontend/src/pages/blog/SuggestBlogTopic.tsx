import axios from "axios";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SuggestBlogTopic = () => {
  const { toast } = useToast();
  const [blogSuggest, setBlogSuggest] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogSuggest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitTopic = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/suggestBlog/",
        blogSuggest,
        {
          withCredentials: true,
        }
      );
      setBlogSuggest({
        title: "",
        description: "",
      })
      toast({ title: 'suggesion posted successfully' })
    } catch (error) {
      console.error("Post failed", error);
      toast({ title: 'something went wrong'})
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
                Submit Suggestion
              </button>
            </form>
          </div>
          <div className="md:w-1/3">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?q=80&w=500"
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
