// form/page to write a blog

import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const WriteBlog = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("thumbnail", thumbnail);
    formData.append("description", description);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/blogs/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Blog published:", response.data);
      setContent("");
      setDescription("");
      setThumbnail("");
      setTitle("");
      setTimeout(() => {
        navigate("/blogs");
      }, 1000);
      toast({ title: "Blog published successfully!" });
    } catch (err) {
      console.error("Failed to publish blog", err);
      toast({ title: "Error publishing blog.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Write a Blog</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Share your insights, stories, or research with the space community.
          </p>
        </div>

        {/* Form to write blog */}
        <form className="space-y-6 max-w-4xl mx-auto" onSubmit={handleSubmit}>
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              placeholder="Choose a file"
              onChange={handleThumbnailChange}
              className="block w-full text-sm text-gray-300 file:bg-space-purple/30 file:border-0 file:px-4 file:py-2 file:rounded file:text-white hover:file:bg-space-purple/50 transition"
            />
          </div>

          {/* Blog Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Blog Title
            </label>
            <input
              type="text"
              placeholder="Enter the blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
            />
          </div>

          {/* Blog Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <textarea
              placeholder="Start writing your blog..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
            ></textarea>
          </div>

          {/* Blog Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descriptioin
            </label>
            <textarea
              placeholder="A brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-space-accent hover:bg-space-accent/80 text-white px-6 py-2 rounded transition-colors"
            >
              Publish
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default WriteBlog;
