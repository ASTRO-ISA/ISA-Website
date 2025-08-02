import { useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import Spinner from "@/components/ui/Spinner";

const WriteBlog = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null); // since we are trying to set a file to thumbnail afeter compressing it
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleThumbnailChange = async (e) => {
    const image = e.target.files[0];
    const options = {
      maxSizeMB: 1,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(image, options);
      const fileWithName = new File([compressedFile], image.name, {
        type: compressedFile.type,
      });
      setThumbnail(fileWithName);
    } catch (err) {
      console.error("Image compression failed:", err);
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.length === 0) {
      toast({ title: "Title required.", variant: "destructive" });
      return;
    }
    if (content.length < 1000) {
      toast({
        title: "Content must be at least 1000 characters.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("thumbnail", thumbnail);
    formData.append("description", description);

    try {
      const response = await api.post("/blogs/create", formData);

      console.log("Blog published:", response.data);
      setContent("");
      setDescription("");
      setThumbnail(null);
      setTitle("");
      setLoading(false);
      navigate("/blogs");
      toast({ title: "Blog published successfully!" });
    } catch (err) {
      setLoading(false);
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
              name="thumbnail"
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
              Content (min 1000 characters)
            </label>
            <textarea
              placeholder="Start writing your blog..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
            ></textarea>
            <p className="text-gray-500 text-xs">{content.length}</p>
          </div>

          {/* Blog Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="A brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 180))}
              rows={3}
              className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
            ></textarea>
            <p className="text-gray-500 text-xs">
              {180 - description.length}/180
            </p>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-space-accent hover:bg-space-accent/80 text-white px-6 py-2 rounded transition-colors"
            >
              {loading ? <Spinner /> : "Publish"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default WriteBlog;
