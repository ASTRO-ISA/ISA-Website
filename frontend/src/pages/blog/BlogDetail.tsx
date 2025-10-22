import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";

const BlogDetail = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();
  const [deleting, setDeleting] = useState(false);
  (blog)

  // to get the blog data form database
  useEffect(() => {
    setLoading(true);
    api
      .get(`/blogs/${slug}`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog", err);
        setLoading(false);
      });
  }, [slug]);

  const deleteBlog = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/blogs/delete/${id}`);
      setDeleting(false);
      toast({
        description: "Blog deleted successfully.",
      });
      navigate("/blogs");
    } catch (err) {
      console.error("Blog not deleted", err.message);
      toast({
        description: "Something went wrong deleting the blog.",
      });
      setDeleting(false);
    }
  };

  if (loading) return <p className="min-h-screen flex justify-center items-center text-gray-400">Loading blog...</p>;
  if (!blog) return <p className="min-h-screen flex justify-center items-center text-gray-400">Blog not found.</p>;

  // to split the created date and time
  const date = new Date(blog.createdAt);

  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // e.g., "24 May 2025"

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }); // e.g., "02:45 PM"

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Blog Image */}
          <div className="rounded-lg mb-5 overflow-hidden pt-4 aspect-[16/9}">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full rounded-lg h-auto object-cover aspect-[16/9]"
            />
          </div>

          {/* Blog Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2 text-center">
              {blog.title}
            </h1>

            <p className="text-center mb-2">{blog.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                {/* <Calendar className="w-4 h-4 text-space-accent" /> */}
                <span className="text-xs text-gray-400">
                  BY: {blog?.author?.name?.toUpperCase()}&nbsp;&nbsp;&nbsp;{formattedDate} at{" "}
                  {formattedTime}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* <Clock className="w-4 h-4 text-space-accent" /> */}
                {/* <span className="text-xs text-gray-400">{formattedTime}</span> */}
              </div>
            </div>
          </div>

          <hr className="mb-8 mt-6" />

          {/* Blog Content */}
          <div
            style={{ whiteSpace: "pre-line" }}
            className="pt-4 prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-line"
          >
            {blog.content}
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mt-12 pt-6 border-t border-gray-600">
            <img
              loading="lazy"
              src={blog.author?.avatar}
              alt={blog.author?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold">{blog.author?.name}</h4>
              <p className="text-sm text-gray-400">{blog.author?.country}</p>
            </div>
          </div>
          <hr className="mb-3 mt-6" />
          {userInfo && blog?.author?._id === userInfo?.user?._id && (
            <button
              onClick={() => deleteBlog(blog._id)}
              className="bg-red-600 text-white px-3 py-1 rounded mt-2"
            >
              {deleting ? <Spinner /> : "Delete Blog"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogDetail;
