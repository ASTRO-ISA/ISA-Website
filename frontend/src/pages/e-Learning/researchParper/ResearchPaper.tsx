import axios from "axios";
import DisplayResearchPaper from "./DisplayResearchPaper";
import UploadResearchPaper from "./UploadResearchPaper";
import { useEffect, useState } from "react";

const ResearchPaper = () => {
  const [papers, setPapers] = useState([]);

  const fetchPapers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/researchPapers/",
        {
          withCredentials: true,
        }
      );
      setPapers(res.data.data);
    } catch (error) {
      console.error("Error fetching papers:", error.message);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  return (
    <div>
      <DisplayResearchPaper papers={papers} />
      <UploadResearchPaper fetchPapers={fetchPapers} />
    </div>
  );
};

export default ResearchPaper;
