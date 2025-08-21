import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
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
  const [loading, setLoading] = useState(false);

  const fetchPapers = async (userId) => {
    setLoading(true);
    try {
      const res = await api.get(`/research-papers/my-papers/${userId}`);
      setPapers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching papers:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers(userInfo.user._id);
  }, [userInfo?.user?._id]);

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
      await api.delete(`/research-papers/${paper_id}`);
      toast({ title: "Deletion successful" });
      await fetchPapers(userInfo?.user?._id);
    } catch (error) {
      toast({
        title: "Deletion unsuccessful.",
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

      await api.patch(`/research-papers/${editPaperData._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({ title: "Paper updated successfully!" });
      setIsEditingPaper(false);
      await fetchPapers(userInfo?.user?._id);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-100">Loading...</p>
      </div>
    );
  }

  return (
    <SpinnerOverlay show={isEditingDeleting}>
      <ul className="space-y-4 mt-4">
        {papers.length === 0 ? (
          <p className="text-gray-500 italic">
            Nothing to see here right now!. The reaserch papers you upload will
            appear here.
          </p>
        ) : (
          <ul className="space-y-4 mt-4">
{papers.map((paper) => (
  <li
    key={paper._id}
    className="flex flex-col gap-3 p-4 border mb-4 bg-space-purple/20 rounded"
  >
    <p className="text-3xl font-semibold text-orange-200">{paper.title}</p>
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

    {/* Inline Edit Form */}
    {isEditingPaper && editPaperData && editPaperData._id === paper._id && (
      <div className="mt-6 p-6 bg-space-purple/10 border rounded-xl space-y-4">
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
          <Label>Upload New PDF (Max size 8MB)</Label>
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
          </li>
        ))}
          </ul>
        )}
      </ul>
    </SpinnerOverlay>
  );
};

export default UserResearchPaper;
