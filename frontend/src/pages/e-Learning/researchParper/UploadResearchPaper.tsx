import { useRef, useState } from "react";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";

const UploadResearchPaper = () => {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    authors: "",
    abstract: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // API call
  const uploadPaper = async () => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));

    const res = await api.post("/research-papers/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: uploadPaper,
    onSuccess: () => {
      setForm({ title: "", authors: "", abstract: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["research-paper"] });
      toast({
        title: "Research paper uploaded successfully.",
        description: "You can check the status of the paper on your profile.",
      });
    },
    onError: () => {
      toast({
        description: "Upload failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast({
        title: "Hold on!",
        description: "Please login first to upload a research paper.",
        variant: "destructive",
      });
      return;
    }

    if (!file || !form.title || !form.authors || !form.abstract) {
      toast({
        title: "Missing fields",
        description: "Please fill out all fields and upload a file before submitting.",
        variant: "destructive",
      });
      return;
    }

    mutate();
  };

  return (
    <div className="min-h-screen bg-space-dark text-white pt-20 px-4">
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold pt-10">Upload Research Paper</h2>

          <form onSubmit={handleUpload} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800"
                placeholder="Enter title"
                required
              />
            </div>

            {/* Authors */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Authors *</label>
              <input
                type="text"
                value={form.authors}
                onChange={(e) => setForm({ ...form, authors: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800"
                placeholder="Enter authors"
                required
              />
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Abstract *</label>
              <textarea
                value={form.abstract}
                onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800"
                placeholder="Enter abstract"
                required
              />
              <p className="text-xs text-gray-400 mt-0">{form.abstract.length} characters</p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Upload File *</label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-300 file:bg-space-purple/30 file:border-0 file:px-4 file:py-2 file:rounded file:text-white hover:file:bg-space-purple/50 transition"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-space-accent p-2 rounded text-white font-bold"
            >
              {isPending ? <Spinner /> : "Upload Paper"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadResearchPaper;
