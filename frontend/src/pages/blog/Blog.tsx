// this is the main blog page where we will see all the featured blogs, recent blogs etc.
import { Calendar, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import SuggestBlogTopic from "./SuggestBlogTopic";

const Blog = () => {
  const [userBlogs, setUserBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserBlogs, setLoadingUserBlogs] = useState(true);
  const [showAllUserBlogs, setShowAllUserBlogs] = useState(false);
  const [loadingExternalBlogs, setLoadingExternalBlogs] = useState(true);
  const [showAllExternalBlogs, setShowAllExternalBlogs] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [featured, setFeatured] = useState({
    _id: "",
    thumbnail: "",
    title: "",
    description: "",
    content: "",
    author: {
      name: "",
      country: "",
    },
    createdAt: "",
  });
  const [noFeatured, setNoFeatured] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();

  // to get all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingUserBlogs(true);
        const res = await axios.get("http://localhost:3000/api/v1/blogs");
        setUserBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs", err);
      } finally {
        setLoadingUserBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  // to get featured blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:3000/api/v1/blogs/featured"
        );
        if(!res.data){
          setNoFeatured(true);
        }
        else {
          setFeatured(res.data);
        }
      } catch (err) {
        console.error("Error fetching blogs", err);
        setNoFeatured(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, []);

  // to get external blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingExternalBlogs(true);
        const res = await axios.get(
          "http://localhost:3000/api/v2/blogs/external"
        );
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching external blogs", err);
      } finally {
        setLoadingExternalBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  // to get external articles
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingArticles(true);
        const res = await axios.get(
          "http://localhost:3000/api/v1/news/articles"
        );
        setArticles(res.data);
      } catch (err) {
        console.error("Error fetching external blogs", err);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-100 mb-4"></div>
        <p className="text-gray-100">Loading blogs for you...</p>
      </div>
    );
  }
  if (!userBlogs) return <p>Nothing to see here right now.</p>;

  // to show the date in readable format
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // to set time in readable format
  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // to check if the user is logged in before writing the blog, if the user is not logged in, he cannot write blog
  const handleWriteClick = () => {
    if (isLoggedIn) {
      // checking using auth context isLoggedIn state
      navigate("/write");
    } else {
      toast({
        title: "Hold on!",
        description: "Log in first to share your awesome thoughts!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <Navbar /> */}

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blogs & News</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore real-time discoveries and personal perspectives from
            scientists, astronomers, and industry insiders — all in one cosmic
            stream.
          </p>
        </div>

        {/* Featured Blog */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Featured Blog</h2>

          {noFeatured ? (<p>No featured for the moment.</p>) : (

          <div className="cosmic-card p-0 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-3 relative">
              <div className="aspect-video lg:h-full">
                <img
                  loading="lazy"
                  src={`http://localhost:3000/uploads/${featured.thumbnail}`}
                  alt="Space Talk"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            </div>
            <div className="lg:col-span-2 p-6 flex flex-col justify-center">
              <Link to={`/blogs/${featured._id}`}>
                <h3 className="text-2xl font-bold mb-3">
                  A Blog with NASA Scientist: Mars Exploration Updates
                </h3>
              </Link>
              <p className="text-gray-400 mb-6">{featured.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <img
                  loading="lazy"
                  src={`http://localhost:3000/uploads/${featured.thumbnail}`}
                  alt={featured.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{featured.author.name}</h4>
                  <p className="text-sm text-gray-400">
                    NASA Mars Exploration Program
                  </p>
                </div>
              </div>
              {/* <a
                href="#"
                className="inline-flex items-center text-space-accent hover:underline"
              >
                Read full blog
                <ExternalLink className="ml-1 h-4 w-4" />
              </a> */}
            </div>
          </div>
          </div>

          )}
          
        </section>

        {/* Recent Blogs */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Blogs</h2>

            {/* Create Blog Button */}
            <button
              onClick={handleWriteClick}
              className="bg-space-accent text-white px-4 py-2 rounded hover:bg-space-accent/80 transition"
            >
              Create&nbsp;
              <i
                className="fa-solid fa-plus fa-lg"
                style={{ color: "white" }}
              ></i>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingUserBlogs ? (
              <p>Loading...</p>
            ) : userBlogs.length === 0 ? (
              <p>Nothing to see here right now!</p>
            ) : (
              (showAllUserBlogs ? userBlogs : userBlogs.slice(0, 3)).map(
                (blog) => (
                  <Link
                    key={blog._id}
                    to={`/blogs/${blog._id}`}
                    className="cosmic-card overflow-hidden group flex flex-col cursor-pointer"
                  >
                    <div className="h-48 w-full relative">
                      <img
                        loading="lazy"
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          {blog.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {blog.description}
                        </p>

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
                          loading="lazy"
                          src="/images/placeholder.svg"
                          alt={blog.author}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{blog.author?.name}</h4>
                          <p className="text-sm text-gray-400">
                            {blog.author?.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )
            )}
          </div>

          {/* View all blogs button */}
          {/* if there are no blpgs, no need to show the see all events button */}
          {blogs.length > 3 && !showAllUserBlogs && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllUserBlogs(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View All Blogs
              </button>
            </div>
          )}
        </section>

        {/* Astronomical Blogs */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Astronomical Blogs</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingExternalBlogs ? (
              <p>Loading...</p>
            ) : blogs.length === 0 ? (
              <p>Nothing to see here right now!</p>
            ) : (
              (showAllExternalBlogs ? blogs : blogs.slice(0, 3)).map((blog) => (
                <Link
                  key={blog.id}
                  to={blog.url}
                  className="cosmic-card overflow-hidden group flex flex-col cursor-pointer"
                >
                  <div className="h-48 w-full relative">
                    <img
                      loading="lazy"
                      src={blog.image_url}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {blog.summary}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                          <span>{formatDate(blog.published_at)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-4 w-4 mr-2 text-space-accent" />
                          <span>{formatTime(blog.published_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        loading="lazy"
                        src="/images/placeholder.svg"
                        alt={blog.authors?.[0]?.name || "Author"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">
                          {blog.authors?.[0]?.name || "Unknown"}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Published at: {formatDate(blog.published_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* View all blogs button */}
          {/* if there are no events, no need to show the see all events button */}
          {blogs.length > 3 && !showAllExternalBlogs && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllExternalBlogs(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View All Blogs
              </button>
            </div>
          )}
        </section>

        {/* News */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">News</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingArticles ? (
              <p>Loading...</p>
            ) : articles.length === 0 ? (
              <p>Nothing to see here right now!</p>
            ) : (
              (showAllArticles ? articles : articles.slice(0, 3)).map(
                (article) => (
                  <Link
                    key={article.id}
                    to={article.url}
                    className="cosmic-card overflow-hidden group flex flex-col cursor-pointer"
                  >
                    <div className="h-48 w-full relative">
                      <img
                        loading="lazy"
                        src={article.image_url}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {article.summary}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatDate(article.published_at)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatTime(article.published_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          loading="lazy"
                          src="/images/placeholder.svg"
                          alt={article.authors?.[0]?.name || "Author"}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">
                            {article.authors?.[0]?.name || "Unknown"}
                          </h4>
                          <p className="text-sm text-gray-400">
                            Published at: {formatDate(article.published_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )
            )}
          </div>

          {blogs.length > 3 && !showAllExternalBlogs && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllArticles(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View All Articles
              </button>
            </div>
          )}
        </section>

        {/* Suggest a Blog Topic */}
        <SuggestBlogTopic />
      </main>
    </div>
  );
};

export default Blog;
