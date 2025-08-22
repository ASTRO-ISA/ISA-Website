import api from "@/lib/api";
import DisplayResearchPaper from "./DisplayResearchPaper";
import UploadResearchPaper from "./UploadResearchPaper";
import { useQuery } from "@tanstack/react-query";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";

const fetchPapers = async () => {
  const res = await api.get("/research-papers/");
  return res.data || [];
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

      {/* <UploadResearchPaper /> */}
    </div>
  );
};

export default ResearchPaper;
