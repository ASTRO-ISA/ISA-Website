import { Calendar, Clock } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const BlogDetail = () => {
  const {toast} = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  // to get all the blog data form database
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog", err);
        setLoading(false);
      });
  }, [id]);

 const deleteBlog = (id) => {
    try{
      axios.delete(`http://localhost:3000/api/v1/blogs/delete/${id}`)
      navigate('/blogs')
    }
    catch (err){
      console.error("Blog not deleted", err.message)
      toast({
        description: "Something went wrong deleting the blog."
      })
    }
 };

  if (loading) return <p>Loading blog...</p>;
  if (!blog) return <p>Blog not found.</p>;

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
      {/* <Navbar /> */}

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Blog Image */}
            <div className="rounded-lg overflow-hidden pt-4 ">
            <img
              src={blog.thumbnail} // while we create a blog, the thumbnail's will be uploaded in the 'server/uploads' folder, since we have made the folder static (in 'server/app.js') so the folder will be available at this URL
              alt={blog.title}
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Blog Header */}
          <div>


            
            <h1 className="text-4xl font-bold mb-2 text-center">{blog.title}</h1>

            <p className="text-center mb-2">{blog.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              {/* <Calendar className="w-4 h-4 text-space-accent" /> */}
              <span className="text-xs text-gray-400">BY: {(blog.author.name).toUpperCase()} {formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              {/* <Clock className="w-4 h-4 text-space-accent" /> */}
              {/* <span className="text-xs text-gray-400">{formattedTime}</span> */}
            </div>
          </div>

          </div>

          <hr className="mb-8 mt-6"/>

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
              src="/images/placeholder.svg" // Right now we have not set up this yet
              alt={blog.author?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold">{blog.author?.name}</h4>
              <p className="text-sm text-gray-400">{blog.author?.country}</p>
            </div>
            {/* <p>{blog.author.name}</p> for time being we are using only the auther name, once we set up the above commented (9 lines) details, this can be removed */}
          </div>
          <hr className="mb-3 mt-6"/>
          {userInfo && blog.authorId === userInfo._id && (
          <button
            onClick={() => deleteBlog(blog._id)}
            className="bg-red-600 text-white px-3 py-1 rounded mt-2"
          >
            Delete Blog
          </button>
          )}
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default BlogDetail;
