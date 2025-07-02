import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const ResearchPaper = () => {
  const [papers, setPapers] = useState([]);
  const [expanded, setExpanded] = useState({});

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/jobs/", {
        withCredentials: true,
      });
      setPapers(res.data.data);
    } catch (error) {
      console.error("Error fetching papers:", error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleAbstract = (jobId) => {
    setExpanded((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  return (
    <div>
      <ul className="space-y-4 mt-4">
        {papers.map((paper) => (
          <li
            key={paper._id}
            className="flex flex-col gap-3 p-4 border mb-4 bg-space-purple/20 rounded"
          >
            <p className="text-3xl font-semibold text-orange-200">
              Effects of severe signal degradation on ear detection
            </p>
            <p>J. Wagner; A. Pflug; C. Rathgeb; C. Busch</p>
            <p>
              Published on:{" "}
              <span className="font-semibold"> 07 July 2025 </span>{" "}
            </p>

            <button
              onClick={() => toggleAbstract(paper._id)}
              className="text-sm text-blue-400 hover:underline w-fit"
            >
              {expanded[paper._id] ? "Hide Abstract" : "Show Abstract"}
            </button>

            {expanded[paper._id] && (
              <div className=" text-sm text-gray-200">
                <p>
                  To improve the viability of the authors' previous work
                  regarding single-view-based ear biometrics, empirical
                  evaluations were performed using super-resolution images and
                  images with barrel distortion. To improve the viability of the
                  authors' previous work regarding single-view-based ear
                  biometrics, empirical evaluations were performed using
                  super-resolution images and images with barrel distortion.
                </p>
              </div>
            )}

            <div className="mt-3">
              {paper.documentUrl ? (
                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                    paper.documentUrl
                  )}&embedded=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>View Paper</Button>
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResearchPaper;
