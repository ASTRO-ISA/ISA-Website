
// This is the page to read a single blog in detail, the whole content of it

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';

const BlogDetail = () => {
  const {id} = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // to get all the blog data form database
  useEffect(() => {
    axios.get(`http://localhost:3000/api/v1/blogs/${id}`)
    .then((res) => {
        setBlog(res.data);
        setLoading(false);
    })
    .catch((err) => {
        console.error('Error fetching blog', err);
        setLoading(false);
    });
  }, [id]);

  if(loading) return <p>Loading blog...</p>;
  if(!blog) return <p>Blog not found.</p>;

    // to split the created date and time
    const date = new Date(blog.createdAt);

    const formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    }); // e.g., "24 May 2025"

    const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    }); // e.g., "02:45 PM"

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Blog Header */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-space-accent" /> {/* calender symbol */}
                <span>{formattedDate}</span> 
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-space-accent" /> {/* clock symbol */}
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Blog Image */}
          <div className="rounded-lg overflow-hidden">
            <img
              src={`http://localhost:3000/uploads/${blog.thumbnail}`} // while we create a blog, the thumbnail's will be uploaded in the 'server/uploads' folder, since we have made the folder static (in 'server/app.js') so the folder will be available at this URL
              alt={blog.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Blog Content */}
          <div style={{ whiteSpace: "pre-line" }} className="prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-line">
            {blog.content}
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mt-12 pt-6 border-t border-gray-600">
            {/* <img
              src={blog.authorProfileImage} // Right now we have not set up this yet
              alt={blog.author}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold">{blog.author}</h4>
              <p className="text-sm text-gray-400">{blog.authorDescription}</p>
            </div> */}
            <p>{blog.author}</p> {/* for time being we are using only the auther name, once we set up the above commented (9 lines) details, this can be removed */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;