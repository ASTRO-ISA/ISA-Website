import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const UserJobs = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/jobs/", {
        withCredentials: true,
      });
      setJobs(res.data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  return (
    <div>
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
              <span className="font-semibold"> Description : </span>
              {job.description}
            </p>
            <div className="flex gap-4 mt-2">
              {job.applyLink ? (
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button> Apply Link </Button>
                </a>
              ) : null}
              {job.documentUrl ? (
                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                    job.documentUrl
                  )}&embedded=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>View Document</Button>
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserJobs;
