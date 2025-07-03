import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/Spinner";

type UploadResearchPaperProps = {
  fetchPapers: () => void;
};

const UploadResearchPaper = ({ fetchPapers }: UploadResearchPaperProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    authors: "",
    abstract: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file || !form.title || !form.authors || !form.abstract) {
      return alert("Please fill all fields and select a file");
    }

    const formData = new FormData();
    formData.append("file", file);
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val);
    });

    try {
      setIsLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/researchPapers/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Uploaded:", res.data);
      setForm({ title: "", authors: "", abstract: "" });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsLoading(false);
      fetchPapers();
    } catch (error) {
      setIsLoading(false);
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div>
      <Card className="mt-10 bg-space-purple/10 border-space-purple/30">
        <CardHeader>
          <CardTitle>Upload a paper</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <input
            type="text"
            value={form.title}
            placeholder="Title"
            className="w-full p-2 rounded bg-gray-800 text-white"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="text"
            value={form.authors}
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Authors"
            onChange={(e) => setForm({ ...form, authors: e.target.value })}
          />
          <textarea
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={form.abstract}
            placeholder="Abstract"
            onChange={(e) => setForm({ ...form, abstract: e.target.value })}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="w-full p-2 rounded bg-gray-800 text-white"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button className="w-full" onClick={handleUpload}>
            {isLoading ? <Spinner /> : " Upload Paper"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadResearchPaper;
