import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const UserResearchPaper = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { userInfo } = useAuth();
  const [isEditingDeleting, setIsEditingDeleting] = useState(false);
  const [isEditingPaper, setIsEditingPaper] = useState(false);
  const [editPaperData, setEditPaperData] = useState(null);
  const [papers, setPapers] = useState([]);

  const fetchPapers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/researchPapers/",
        { withCredentials: true }
      );
      const userPaper = res.data.data.filter(
        (paper) => paper.uploadedBy._id == userInfo.user._id
      );
      setPapers(userPaper);
    } catch (error) {
      console.error("Error fetching papers:", error.message);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const toggleAbstract = (paperId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [paperId]: !prev[paperId],
    }));
  };

  const handleEditPaper = (paper) => {
    setEditPaperData({ ...paper, paperFile: null });
    setIsEditingPaper(true);
  };

  const handleDeletePaper = async (paper_id) => {
    try {
      setIsEditingDeleting(true);
      await axios.delete(
        `http://localhost:3000/api/v1/researchPapers/${paper_id}`,
        {
          withCredentials: true,
        }
      );
      toast({ title: "Deletion successful" });
      await fetchPapers();
    } catch (error) {
      toast({
        title: "Deletion unsuccessful",
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsEditingDeleting(false);
    }
  };

  const handleEditInputChange = (e) => {
    setEditPaperData({ ...editPaperData, [e.target.name]: e.target.value });
  };

  const handleUpdatePaper = async () => {
    try {
      if (!editPaperData) return;
      setIsEditingDeleting(true);

      const formData = new FormData();
      formData.append("title", editPaperData.title);
      formData.append("authors", editPaperData.authors);
      formData.append("abstract", editPaperData.abstract);
      if (editPaperData.paperFile) {
        formData.append("file", editPaperData.paperFile); // <- this is the new PDF file
      }

      await axios.patch(
        `http://localhost:3000/api/v1/researchPapers/${editPaperData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast({ title: "Paper updated successfully!" });
      setIsEditingPaper(false);
      await fetchPapers();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsEditingDeleting(false);
    }
  };

  return (
    <SpinnerOverlay show={isEditingDeleting}>
      <ul className="space-y-4 mt-4">
        {papers.map((paper) => (
          <li
            key={paper._id}
            className="flex flex-col gap-3 p-4 border mb-4 bg-space-purple/20 rounded"
          >
            <p className="text-3xl font-semibold text-orange-200">
              {paper.title}
            </p>
            <p>{paper.authors}</p>
            <p>
              Published on:{" "}
              <span className="font-semibold">
                {new Date(paper.publishedOn).toLocaleDateString()}
              </span>
            </p>

            <button
              onClick={() => toggleAbstract(paper._id)}
              className="text-sm text-blue-400 hover:underline w-fit"
            >
              {expanded[paper._id] ? "Hide Abstract" : "Show Abstract"}
            </button>

            {expanded[paper._id] && (
              <div className="text-sm text-gray-200">
                <p>{paper.abstract}</p>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-4 mt-2">
              <div>
                {paper.paperUrl && (
                  <a
                    href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                      paper.paperUrl
                    )}&embedded=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>View Paper</Button>
                  </a>
                )}
              </div>
              <div className="flex w-62 gap-4">
                <Button
                  size="sm"
                  onClick={() => handleEditPaper(paper)}
                  variant="outline"
                >
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDeletePaper(paper._id)}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Form */}
      {isEditingPaper && editPaperData && (
        <div className="mt-10 p-6 bg-space-purple/10 border rounded-xl max-w-xl mx-auto space-y-4">
          <h2 className="text-xl font-semibold text-center text-space-accent">
            Edit Research Paper
          </h2>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              name="title"
              value={editPaperData.title}
              onChange={handleEditInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Authors</Label>
            <Input
              name="authors"
              value={editPaperData.authors}
              onChange={handleEditInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Abstract</Label>
            <Textarea
              name="abstract"
              value={editPaperData.abstract}
              onChange={handleEditInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload New PDF (Max size 10MB)</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setEditPaperData({
                  ...editPaperData,
                  paperFile: e.target.files?.[0] || null,
                })
              }
            />
          </div>

          <div className="flex gap-4 mt-4 justify-end">
            <Button onClick={handleUpdatePaper}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditingPaper(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </SpinnerOverlay>
  );
};

export default UserResearchPaper;
