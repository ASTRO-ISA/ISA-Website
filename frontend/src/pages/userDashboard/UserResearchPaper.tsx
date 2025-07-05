import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";

const UserResearchPaper = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { userInfo } = useAuth();
  const [isEditingSeleting, setIsEditingDeleting] = useState(false);
  const toggleAbstract = (paperId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [paperId]: !prev[paperId],
    }));
  };

  const [papers, setPapers] = useState([]);

  const fetchPapers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/researchPapers/",
        {
          withCredentials: true,
        }
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

  const handleEditPaper = (paper) => {};
  const handleDeletePaper = async (paper_id) => {
    try {
      setIsEditingDeleting(true);
      await axios.delete(
        `http://localhost:3000/api/v1/researchPapers/${paper_id}`,
        {
          withCredentials: true,
        }
      );
      setIsEditingDeleting(false);
      toast({
        title: "Deletion successful",
      });
      fetchPapers();
    } catch (error) {
      setIsEditingDeleting(false);
      toast({
        title: "Deletion unsuccessful",
        variant: "destructive",
        description: error.message,
      });
      console.log(error.message);
    }
  };

  return (
    <SpinnerOverlay show={isEditingSeleting}>
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
    </SpinnerOverlay>
  );
};

export default UserResearchPaper;
