import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  CalendarDays,
  User2,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

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
      navigate("/upload-paper");
    } else {
      toast({
        title: "Hold on!",
        description: "Log in first to share your research!",
        variant: "destructive",
      });
    }
  };

  if (!papers || papers.length === 0)
    return (
      <p className="min-h-screen text-gray-400 italic flex justify-center items-center text-center sm:text-start">
        Nothing to see here right now.
      </p>
    );

  return (
    <section className="mx-auto px-4 py-auto mt-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
        <h2 className="text-3xl text-center sm:text-start md:text-3xl font-bold text-white">
          Published Research Papers
        </h2>
        <Button
          onClick={handleWriteClick}
          className="bg-space-accent hover:bg-space-accent/80 text-white px-4"
        >
          <Plus className="w-5 h-4 mr-2" /> Publish Paper
        </Button>
      </div>

      {/* Papers Grid */}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {papers.map((paper) => (
          <li
            key={paper._id}
            className="border border-gray-700 bg-gradient-to-br from-space-purple/30 to-space-accent/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-space-accent/30 transition duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Title */}
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
  <FileText className="w-5 h-5 text-space-accent" /> {paper.title}
</h3>

{/* Authors */}
<p className="text-gray-300 flex items-center gap-2 text-sm mb-2">
  <User2 className="w-4 h-4 text-space-accent" /> {paper.authors}
</p>

{/* Date */}
<p className="text-gray-400 text-xs flex items-center gap-2">
  <CalendarDays className="w-4 h-4 text-space-accent" />
  {new Date(paper.publishedOn).toLocaleDateString()}
</p>

              {/* Abstract Toggle */}
              <button
                onClick={() => toggleAbstract(paper._id)}
                className="mt-3 text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition"
              >
                {expanded[paper._id] ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Hide Abstract
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Show Abstract
                  </>
                )}
              </button>

              {/* Abstract */}
              {expanded[paper._id] && (
                <div className="mt-3 bg-black/30 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm leading-relaxed">
                  {paper.abstract}
                </div>
              )}
            </div>

            {/* View Paper Button */}
            {paper.paperUrl && (
              <div className="mt-5">
                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                    paper.paperUrl
                  )}&embedded=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    className="w-full bg-space-accent/20 hover:bg-space-accent/40 text-space-accent border border-space-accent/30"
                  >
                    <FileText className="w-4 h-4 mr-2" /> View Full Paper
                  </Button>
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DisplayResearchPaper;