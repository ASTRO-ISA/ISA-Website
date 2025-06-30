import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import axios from "axios";

const AdminGallerySection = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [captionInputValue, setCaptionInputValue] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("caption", captionInputValue);

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/v1/gallery", formData, {
        withCredentials: true,
      });
      const newImage = {
        _id: res.data.pic._id,
        src: res.data.pic.imageUrl,
        caption: res.data.pic.caption || captionInputValue,
      };
      setImages((prev) => [...prev, newImage]);
      setCaptionInputValue("");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Error uploading images", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/gallery/${id}`, {
        withCredentials: true,
      });
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      console.error("Error deleting image", err);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/gallery", {
        withCredentials: true,
      });
      setImages(
        res.data.map((img) => ({
          _id: img._id,
          src: img.imageUrl,
          caption: img.caption || "",
        }))
      );
    };
    fetchImages();
  }, []);

  return (
    <Card className="bg-space-purple/10 border-space-purple/30">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>Gallery Uploads</CardTitle>
        <Button onClick={() => document.getElementById("gallery-upload").click()} disabled={loading}>
          <Plus className="w-4 h-4 mr-1" /> Select Image
        </Button>
        <input
          type="file"
          id="gallery-upload"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileSelect}
        />
      </CardHeader>
      <CardContent>
        {previewUrl && (
          <div className="mb-4">
            <img src={previewUrl} alt="Preview" className="w-48 h-48 object-cover rounded mb-2" />
            <input
              type="text"
              placeholder="Enter caption"
              value={captionInputValue}
              onChange={(e) => setCaptionInputValue(e.target.value)}
              className="block w-full p-2 rounded bg-gray-800 text-white mb-2"
            />
            <Button onClick={handleUpload} disabled={loading}>Upload</Button>
          </div>
        )}

        {images.length === 0 ? (
          <p className="text-gray-400">No gallery images found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {images.map((image, i) => (
                <div
                  key={image._id}
                  className="group overflow-hidden rounded-lg relative animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <img
                    src={image.src}
                    alt={image.caption}
                    onClick={() => {
                      setOpen(true);
                      setIndex(i);
                    }}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                  />
                  <div className="absolute top-2 right-2 pointer-events-auto">
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(image._id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                  <p className="text-white font-medium">{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
            <Lightbox
              open={open}
              close={() => setOpen(false)}
              index={index}
              slides={images.map((img) => ({ src: img.src, type: "image" }))}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminGallerySection;

