import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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

const DisplayResearchPaper = ({ papers }: DisplayPaperProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  const toggleAbstract = (paperId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [paperId]: !prev[paperId],
    }));
  };

  const handleWriteClick = () => {
    if (isLoggedIn) {
      // checking using auth context isLoggedIn state
      navigate("/upload-paper");
    } else {
      toast({
        title: "Hold on!",
        description: "Log in first to share your awesome thoughts!",
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Published Research Papers</h2>

            {/* Create Blog Button */}
            <button
              onClick={handleWriteClick}
              className="bg-space-accent text-white px-4 py-2 rounded hover:bg-space-accent/80 transition"
            >
              Publish&nbsp;
              <i
                className="fa-solid fa-plus fa-lg"
                style={{ color: "white" }}
              ></i>
            </button>
          </div>
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
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DisplayResearchPaper;
