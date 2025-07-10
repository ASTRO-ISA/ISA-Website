import axios from "axios";
import DisplayResearchPaper from "./DisplayResearchPaper";
import UploadResearchPaper from "./UploadResearchPaper";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/Spinner";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";

const fetchPapers = async () => {
  const res = await axios.get("http://localhost:3000/api/v1/researchPapers/", {
    withCredentials: true,
  });
  return res.data.data;
};

const ResearchPaper = () => {
  const { data: papers = [], isLoading } = useQuery({
    queryKey: ["research-paper"],
    queryFn: fetchPapers,
  });

  return (
    <div>
      <SpinnerOverlay show={isLoading}>
        <DisplayResearchPaper papers={papers} />
      </SpinnerOverlay>

      {/* <UploadResearchPaper fetchPapers={fetchPapers} /> */}
    </div>
  );
};

export default ResearchPaper;
