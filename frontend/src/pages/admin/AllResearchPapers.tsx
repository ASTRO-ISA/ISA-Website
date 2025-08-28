import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Paper = {
  _id: string;
  title: string;
  authors: string;
  abstract: string;
  publishedOn: string;
  paperUrl?: string;
};

type DisplayPaperProps = {
  papers: Paper[];
};

const AllResearchPapers = ({ papers }: DisplayPaperProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({});

  const { toast } = useToast();

  const toggleAbstract = (paperId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [paperId]: !prev[paperId],
    }));
  };

  // Handle Response Change (Admin's feedback)
  const handleResponseChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], response: value },
    }));
  };

  const changeStatus = async (id: string, newStatus: string) => {
    const response = formData[id]?.response?.trim() || "";

    // Check if response is empty
    if (!response) {
      toast({
        title: "Response required",
        description: "Please add a response before approving or rejecting.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.patch(
        `/research-papers/status/${id}`,
        { status: newStatus, response },
        { withCredentials: true }
      );

      toast({
        description: `Research paper marked as ${newStatus} with response: "${response}"`,
      });
    } catch (err) {
      toast({
        description: `Something went wrong changing the status to ${newStatus}`,
        variant: "destructive",
      });
    }
  };

  if (!papers || papers.length === 0)
    return (
      <p className="min-h-screen text-gray-400 italic flex justify-center items-center">
        Nothing to see here right now.
      </p>
    );

  return (
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

          <div className="mt-3">
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
            {/* Admin Response Textarea */}
            <textarea
              onChange={(e) => handleResponseChange(paper._id, e.target.value)}
              value={formData[paper._id]?.response || ""}
              placeholder="Write admin response here..."
              className="w-full p-2 mt-4 text-sm text-black border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-space-purple"
            />
          </div>
          <Button
            className="max-w-[10rem] bg-green-500 mt-5"
            onClick={() => changeStatus(paper._id, "approved")}
          >
            Approve
          </Button>
          <Button
            className="max-w-[10rem] bg-red-500"
            onClick={() => changeStatus(paper._id, "rejected")}
          >
            Reject
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default AllResearchPapers;
