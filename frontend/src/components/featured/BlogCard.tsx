import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  if (!blog) return null;

  return (
    <div className="cosmic-card overflow-hidden shadow-lg cursor-pointer">
      <Link to={`/blogs/${blog.slug}`}>
        <div className="relative aspect-[16/9] sm:aspect-video">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0" />
        </div>
        <div className="p-4 sm:p-6">
          <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
            Featured Blog
          </p>
          <h3 className="text-lg sm:text-xl font-bold mb-2">{blog.title}</h3>
          <p className="text-sm text-gray-400 mb-2">
            Date: {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-400 mb-3 sm:block">
            {blog.description}
          </p>
          <p className="text-xs text-gray-500">
            Author: {blog.author?.name ? blog.author.name.toUpperCase() : "Unknown"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;