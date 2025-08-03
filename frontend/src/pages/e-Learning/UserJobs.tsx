import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";

const fetchJobs = async () => {
  const res = await api.get("/jobs/");
  return res.data.data;
};

const UserJobs = () => {
  const {
    data: jobs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  if (isError)
    return (
      <p className="text-center mt-4 text-red-500">
        Error fetching jobs: {error.message}
      </p>
  );

  if (!jobs || jobs.length === 0)
    return (
      <p className="text-gray-400 italic flex justify-center items-center">
        Nothing to see here right now. Future job and internship postings will appear here!
      </p>
  );

  return (
    <div>
      <SpinnerOverlay show={isLoading}>
        <ul className="space-y-4 mt-4">
          {jobs.map((job) => (
            <li
              key={job._id}
              className="p-4 border mb-4 bg-space-purple/20 rounded"
            >
              <p>
                <span className="font-semibold"> Title : </span> {job.title}
              </p>
              <p>
                <span className="font-semibold"> Role : </span> {job.role}
              </p>
              <p>
                <span className="font-semibold"> Description : </span>{" "}
                {job.description}
              </p>

              <div className="flex gap-4 mt-2">
                {job.applyLink && (
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>Apply Link</Button>
                  </a>
                )}
                {job.documentUrl && (
                  <a
                    href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                      job.documentUrl
                    )}&embedded=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>View Document</Button>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </SpinnerOverlay>
    </div>
  );
};

export default UserJobs;
