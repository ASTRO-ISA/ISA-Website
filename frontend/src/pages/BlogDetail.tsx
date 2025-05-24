import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogDetail = ({ blogs }) => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog) return <div className="text-white p-10">Blog not found</div>;

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-400 mb-6">
          {blog.date} • {blog.time}
        </p>
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full rounded mb-6"
        />
        <div className="mb-8 text-lg leading-relaxed">
          {blog.description}
          <p className="mt-4 text-gray-400">[Add full blog content here]</p>
        </div>
        <div className="flex items-center gap-4">
          <img
            src={blog.autherProfileImage}
            alt="image"
            className="w-14 h-14 rounded-full"
          />
          <div>
            <h4 className="font-semibold">{blog.auther}</h4>
            <p className="text-sm text-gray-400">{blog.autherDescription}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
