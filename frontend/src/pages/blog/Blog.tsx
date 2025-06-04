
// This is the main blog page where we will see all the featured blogs, recent blogs etc.

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, ExternalLink} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Blog = () => {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/v1/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error('Error fetching blogs', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBlogs();
  }, []);

  if(loading) return <p>Loading blogs for you...</p>
  if(!blogs) return <p>Nothing to see here right now.</p>

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  
  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blogs</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore Insights from Scientists, Astronauts, and Industry Experts
          </p>
        </div>

        {/* Featured Blog */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Featured Blog</h2>

          <div className="cosmic-card p-0 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-3 relative">
              <div className="aspect-video lg:h-full">
                <img
                  src="https://images.unsplash.com/photo-1501862700950-18382cd41497?q=80&w=1000"
                  alt="Space Talk"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            </div>
              <div className="lg:col-span-2 p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-3">A Blog with NASA Scientist: Mars Exploration Updates</h3>
                <p className="text-gray-400 mb-6">
                  In this blog, Dr. Rajesh Kumar, a NASA scientist working on the Mars Exploration Program, shares exclusive insights about the latest discoveries on the Red Planet.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100"
                    alt="Dr. Rajesh Kumar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">Dr. Rajesh Kumar</h4>
                    <p className="text-sm text-gray-400">NASA Mars Exploration Program</p>
                  </div>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center text-space-accent hover:underline"
                >
                  Read full blog
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Blogs */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Blogs</h2>
            <Link
            to="/write"
            >
            <button
              // onClick={handleWriteClick}
              className="bg-space-accent text-white px-4 py-2 rounded hover:bg-space-accent/80 transition"
            >
              Create&nbsp;<i className="fa-solid fa-plus fa-lg" style={{color: "white"}}></i>
            </button>
            </Link>
            
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (

              <Link
              key={blog._id}
              to={`/blogs/${blog._id}`}
              className="cosmic-card overflow-hidden group flex flex-col cursor-pointer"
              // onClick={() => navigate(`/blogs/${blog.id}`)}
              >
                <div className="h-48 w-full relative">
                  <img
                    src={`http://localhost:3000/uploads/${blog.thumbnail}`}
                    alt={blog.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{blog.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{blog.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-4 w-4 mr-2 text-space-accent" />
                        <span>{formatTime(blog.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={blog.authorProfileImage}
                      alt={blog.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{blog.author}</h4>
                      <p className="text-sm text-gray-400">{blog.authorDescription}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Suggest a Blog Topic */}
        <section className="cosmic-card p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Suggest a Blog Topic</h2>
              <p className="text-gray-300 mb-6">
                Got a Speaker or Topic in Mind? We'd Love to Hear from You!
              </p>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Suggested Speaker or Topic"
                  className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                />
                <textarea
                  placeholder="Why this would be valuable (optional)"
                  rows={3}
                  className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                ></textarea>
                <button
                  type="submit"
                  className="bg-space-accent hover:bg-space-accent/80 text-white px-6 py-2 rounded transition-colors"
                >
                  Submit Suggestion
                </button>
              </form>
            </div>
            <div className="md:w-1/3">
              <img
                src="https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?q=80&w=500"
                alt="Space Speaker"
                className="rounded-lg h-auto w-full"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;