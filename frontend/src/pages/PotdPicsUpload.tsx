import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import api from "@/lib/api";

const UserPicUpload = () => {
  const [userPicCaption, setUserPicCaption] = useState("");
  const [userPicSocial, setUserPicSocial] = useState("");
  const [userPicFile, setUserPicFile] = useState<File | null>(null);
  const [userPicPreviewUrl, setUserPicPreviewUrl] = useState<string | null>(null);
  const [userPicLoading, setUserPicLoading] = useState(false);
  const { toast } = useToast();

  const userPicFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUserPicSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only PNG, JPG, and JPEG files are allowed.",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
      setUserPicFile(file);
      setUserPicPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUserPicUpload = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!userPicFile || !userPicCaption) {
      toast({
        title: "Field required!",
        description: "Please fill all required fields and select an image.",
        variant: "destructive"
      });
      return;
    }
  
    // inline validator
    const validateSocialLink = (url: string) => {
      if (!url.trim()) return { valid: true }; // optional, empty is fine
  
      try {
        const parsed = new URL(url);
  
        if (!["http:", "https:"].includes(parsed.protocol)) {
          return { valid: false, reason: "Only http/https links are allowed." };
        }
  
        const allowedDomains = [
          "facebook.com",
          "instagram.com",
          "x.com",
          "linkedin.com",
          "github.com"
        ];
        const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
  
        if (!allowedDomains.some(d => hostname.endsWith(d))) {
          return { valid: false, reason: "Only social media links are allowed. Please check the allowed domains." };
        }
  
        if (url.length > 200) {
          return { valid: false, reason: "Link too long." };
        }
  
        return { valid: true, sanitized: parsed.toString() };
      } catch {
        return { valid: false, reason: "Invalid URL format provided. Only http/https links are allowed." };
      }
    };
  
    // run validation only if link is provided
    let result: { valid: boolean; reason?: string; sanitized?: string } = { valid: true }
    if (userPicSocial.trim()) {
      result = validateSocialLink(userPicSocial)
      if (!result.valid) {
        toast({
          description: result.reason,
          variant: "destructive"
        })
        return
      }
    }
  
    setUserPicLoading(true);
  
    const formData = new FormData();
    formData.append("image", userPicFile);
    formData.append("caption", userPicCaption);
    if (userPicSocial.trim()) formData.append("social", result.sanitized || userPicSocial);
  
    try {
      const response = await api.post("/user-potd-pics/upload", formData );
  
      if (response.status === 500) {
        toast({ 
          description: "Something went wrong submitting the image. Please try again later.",
          variant: "destructive"
        });
        throw new Error("Upload failed");
      }
  
      toast({ 
        description: "Your image has been submitted and is now pending admin review."
      });
  
      // reset state
      setUserPicFile(null);
      setUserPicCaption("");
      setUserPicSocial("");
      setUserPicPreviewUrl(null);
      if (userPicFileInputRef.current) {
        userPicFileInputRef.current.value = "";
      }
    } catch (err: any) {
      toast({ 
        title: "Can't upload image.",
        description: err.response?.data || "Unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setUserPicLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white pt-20 px-4">
      <main className="container mx-auto max-w-2xl pb-16">
      <div className="mb-4 p-4 bg-gray-900 rounded-xl border border-gray-700 text-gray-300 text-sm">
        <h2 className="text-lg font-semibold text-white mb-2">Upload Guidelines</h2>
        <ul className="list-disc list-inside space-y-1">
            <li>Upload only your own original photos.</li>
            <li>Ensure images are <span className="font-medium text-white">clear</span> and of good resolution.</li>
            <li>Add a <span className="font-medium text-white">relevant and concise caption</span>.</li>
            <li>Provide a valid social media link (e.g., Instagram, LinkedIn, Facebook, or X (formerly Twitter), GitHub for attribution. Avoid fake or broken links (it should be only http/https).</li>
            <li>Avoid any sensitive, offensive, inappropriate, restricted or copyrighted content. Doing so will lead to a<span className="text-red-500 font-semibold"> permanent ban</span> from the website.</li>
            <li>Prefer <span className="font-medium text-white">landscape orientation</span> (16:9) if possible.</li>
            <li>Max file size: <span className="font-medium text-white">8MB</span>; Formats allowed are: <code>.jpg</code>, <code>.jpeg</code>, <code>.png</code>.</li>
        </ul>
        <p className="mt-3 text-gray-400 italic">
            *Your image will be visible only to the admin and may be selected as a featured image. Avoid sending more than 2 images.
        </p>
        </div>
        <h2 className="text-2xl font-bold mb-6">Upload Picture</h2>

        <form onSubmit={handleUserPicUpload} className="space-y-6">
          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image File *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUserPicSelect}
              ref={userPicFileInputRef}
              className="block w-full text-sm text-gray-300 file:bg-space-purple/30 file:border-0 file:px-4 file:py-2 file:rounded file:text-white hover:file:bg-space-purple/50 transition"
              required
            />
          </div>

          {/* Preview */}
          {userPicPreviewUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Preview:
              </label>
              <img
                src={userPicPreviewUrl}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border border-gray-700"
              />
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Caption *
            </label>
            <input
              type="text"
              value={userPicCaption}
              onChange={(e) => setUserPicCaption(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 text-white"
              required
            />
          </div>

          {/* Social Link */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Social Link (optional)
            </label>
            <input
              type="text"
              value={userPicSocial}
              onChange={(e) => setUserPicSocial(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={userPicLoading} className="w-full">
            {userPicLoading ? <Spinner /> : "Upload Image"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default UserPicUpload;