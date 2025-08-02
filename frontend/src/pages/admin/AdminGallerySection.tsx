import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";

const AdminGallerySection = () => {
  const { toast } = useToast();
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [captionInputValue, setCaptionInputValue] = useState("");

  const [featuredFile, setFeaturedFile] = useState(null);
  const [featuredPreviewUrl, setFeaturedPreviewUrl] = useState(null);
  const [featuredCaption, setFeaturedCaption] = useState("");
  const [featuredAuthor, setFeaturedAuthor] = useState("");
  const [featuredImageData, setFeaturedImageData] = useState([]);
  const featuredFileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only PNG, JPG, and JPEG files are allowed.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFeaturedSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only PNG, JPG, and JPEG files are allowed.",
          variant: "destructive",
        });
        return;
      }
      setFeaturedFile(file);
      setFeaturedPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!captionInputValue) {
      toast({ title: "Please write a caption", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("caption", captionInputValue);
    setLoading(true);

    try {
      const res = await api.post("/gallery", formData);
      const newImage = {
        _id: res.data.pic._id,
        src: res.data.pic.imageUrl,
        caption: res.data.pic.caption || captionInputValue,
      };
      setImages((prev) => [...prev, newImage]);
      setCaptionInputValue("");
      setSelectedFile(null);
      setPreviewUrl(null);
      toast({ title: "Image Uploaded Successfully." });
    } catch (err) {
      console.error("Error uploading image", err);
      toast({ title: "Error uploading image" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await api.delete(`/gallery/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast({ title: "Deleted Successfully." });
      setDeletingId(null);
    } catch (err) {
      console.error("Error deleting image", err);
      toast({ title: "Error deleting image" });
      setDeletingId(null);
    }
  };

  const handleFeaturedUpload = async () => {
    if (featuredImageData.length > 0) {
      toast({
        title: "Featured image already exists.",
        description:
          "Please delete the previous featured image before uploading a new one.",
        variant: "destructive",
      });
      return;
    }

    if (!featuredFile) {
      toast({
        title: "Missing Fields",
        description: "Please select an image.",
        variant: "destructive",
      });
      return;
    }

    if (!featuredAuthor) {
      toast({
        title: "Missing Fields",
        description: "Please enter the author name.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", featuredFile);
    formData.append("caption", featuredCaption);
    formData.append("author", featuredAuthor);

    setFeaturedLoading(true);
    try {
      const res = await api.post("/gallery/featured", formData);
      setFeaturedImageData([res.data.pic]);
      setFeaturedFile(null);
      setFeaturedPreviewUrl(null);
      setFeaturedCaption("");
      setFeaturedAuthor("");
      if (featuredFileInputRef.current) {
        featuredFileInputRef.current.value = "";
      }
      toast({ title: "Featured image uploaded successfully." });
    } catch (err) {
      console.error("Error uploading featured image", err);
      toast({ title: "Error uploading featured image" });
    } finally {
      setFeaturedLoading(false);
    }
  };

  const handleDeleteFeatured = async () => {
    if (!featuredImageData[0]?._id) return;
    try {
      setDeleting(true);
      await api.delete(`/gallery/featured/${featuredImageData[0]._id}`);
      setFeaturedImageData([]);
      toast({ title: "Featured image deleted successfully." });
      setDeleting(false);
    } catch (err) {
      console.error("Error deleting featured image", err);
      toast({ title: "Error deleting featured image" });
      setDeleting(false);
    }
  };

  const fetchImages = async () => {
    const res = await api.get("/gallery", {
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

  const fetchFeaturedImage = async () => {
    try {
      const res = await api.get("/gallery/featured");
      setFeaturedImageData(res.data || []);
    } catch (err) {
      console.error("Error fetching featured image:", err);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchFeaturedImage();
  }, []);

  return (
    <Card className="bg-space-purple/10 border-space-purple/30 p-4">
      <CardHeader>
        <CardTitle>Gallery Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Regular Upload Section */}
        <h3 className="font-semibold text-lg mb-2">
          Uploaded images will appear in gallery
        </h3>
        <p className="text-gray-500 text-sm mb-3">
          You can upload 'png', 'jpg' and 'jpeg'
        </p>
        <div className="mb-8">
          <Button
            onClick={() => document.getElementById("gallery-upload").click()}
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-1" /> Select Image
          </Button>
          <input
            type="file"
            id="gallery-upload"
            style={{ display: "none" }}
            accept=".png, .jpg, .jpeg"
            onChange={handleFileSelect}
          />
          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-48 h-48 object-cover rounded mb-2"
              />
              <input
                type="text"
                placeholder="Enter caption"
                value={captionInputValue}
                onChange={(e) => setCaptionInputValue(e.target.value)}
                className="block w-full p-2 rounded bg-gray-800 text-white mb-2"
              />
              <Button onClick={handleUpload} disabled={loading}>
                {loading ? <Spinner /> : "Upload"}
              </Button>
            </div>
          )}
        </div>
        <hr className="w-full mb-5" />

        {/* Featured Upload Section */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-2">
            Upload Featured Picture
          </h3>
          <p className="text-gray-500 text-sm mb-3">
            Please delete the previous featured image before uploading a new one
          </p>
          <input
            type="file"
            onChange={handleFeaturedSelect}
            accept=".png, .jpg, .jpeg"
            ref={featuredFileInputRef}
          />
          {featuredPreviewUrl && (
            <img
              src={featuredPreviewUrl}
              alt="Featured Preview"
              className="w-48 h-48 object-cover mt-2 rounded"
            />
          )}
          <input
            type="text"
            placeholder="Caption"
            value={featuredCaption}
            onChange={(e) => setFeaturedCaption(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white mt-2"
          />
          <input
            type="text"
            placeholder="Author Name*"
            value={featuredAuthor}
            onChange={(e) => setFeaturedAuthor(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white mt-2 mb-2"
          />
          <Button onClick={handleFeaturedUpload} disabled={featuredLoading}>
            {featuredLoading ? <Spinner /> : "Upload Featured"}
          </Button>
        </div>

        <hr className="w-full mb-5" />

        {/* Featured Display */}
        {featuredImageData?.length > 0 ? (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">
              Current Featured Image
            </h3>
            <img
              src={featuredImageData[0].imageUrl}
              alt="Featured"
              className="w-48 h-48 object-cover rounded"
            />
            <p className="text-sm text-white mt-1">
              {featuredImageData[0].caption}
            </p>
            <p className="text-xs text-gray-400">
              By: {featuredImageData[0].author}
            </p>
            <Button
              onClick={handleDeleteFeatured}
              disabled={deleting}
              variant="destructive"
              className="mt-2"
            >
              {deleting ? <Spinner /> : "Delete Featured"}
            </Button>
          </div>
        ) : (
          <p className="text-gray-400 mb-6">No featured image uploaded yet.</p>
        )}

        <hr className="w-full mb-5" />

        {/* Regular Gallery */}
        <h3 className="font-semibold text-lg mb-2">Gallery</h3>
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
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(image._id)}
                    >
                      {deletingId === image._id ? (
                        <Spinner />
                      ) : (
                        <Trash className="w-4 h-4" />
                      )}
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
