import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";

const AdminJobs = () => {
  const [creatingJob, setCreatingJob] = useState(false);
  const [jobs, setJobs] = useState([]);
  const { toast } = useToast();
  const [editingJobId, setEditingJobId] = useState(null);
  const [isEditingDeleting, setIsEditingDeleting] = useState(false);
  const [newJobFormData, setNewJobFormData] = useState({
    title: "",
    role: "",
    description: "",
    applyLink: "",
    document: null,
  });
  const [editJobFormData, setEditJobFormData] = useState({
    title: "",
    role: "",
    description: "",
    applyLink: "",
  });

  const handleNewJobFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "document") {
      const file = files[0];
      if (
        file &&
        ![
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
        ].includes(file.type)
      ) {
        alert("Only PDF, DOCX, and DOC files are allowed.");
        e.target.value = "";
        return;
      }
      setNewJobFormData({ ...newJobFormData, document: file });
    } else {
      setNewJobFormData({ ...newJobFormData, [name]: value });
    }
  };

  const handleEditJobFormChange = (e) => {
    const { name, value } = e.target;
    setEditJobFormData({ ...editJobFormData, [name]: value });
  };

  const handleCreateJob = async () => {
    try {
      setCreatingJob(true);
      const formData = new FormData();
      formData.append("title", newJobFormData.title);
      formData.append("role", newJobFormData.role);
      formData.append("description", newJobFormData.description);
      formData.append("applyLink", newJobFormData.applyLink);
      formData.append("document", newJobFormData.document);

      await axios.post("http://localhost:3000/api/v1/jobs/", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCreatingJob(false);
      toast({ title: "Job created successfully!" });
      setNewJobFormData({
        title: "",
        role: "",
        description: "",
        applyLink: "",
        document: null,
      });
      fetchJobs();
    } catch (error) {
      console.error("Error creating job:", error.message);
      setCreatingJob(false);
      toast({ title: "Error Occurred!" });
    }
  };

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

  const handleDeleteJob = async (id) => {
    try {
      setIsEditingDeleting(true);
      await axios.delete(`http://localhost:3000/api/v1/jobs/${id}`, {
        withCredentials: true,
      });
      setIsEditingDeleting(false);
      toast({ title: "Job deleted successfully!" });
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error.message);
      setIsEditingDeleting(false);
      toast({ title: "Error deleting job!" });
    }
  };

  const handleEditJobClick = (job) => {
    setEditingJobId(job._id);
    setEditJobFormData({
      title: job.title,
      role: job.role,
      description: job.description,
      applyLink: job.applyLink,
    });
  };

  const handleUpdateJob = async () => {
    try {
      setIsEditingDeleting(true);
      await axios.patch(
        `http://localhost:3000/api/v1/jobs/${editingJobId}`,
        editJobFormData,
        { withCredentials: true }
      );
      setIsEditingDeleting(false);

      toast({ title: "Job updated successfully!" });
      setEditingJobId(null);
      fetchJobs();
    } catch (error) {
      setIsEditingDeleting(false);
      toast({
        title: "Job updated successfully!",
        description: "Error updating job",
      });
      console.error("Error updating job:", error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <Card className="bg-space-purple/10 border-space-purple/30">
        <CardHeader>
          <CardTitle>Create New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateJob();
            }}
            className="space-y-4"
          >
            <input
              type="text"
              name="title"
              value={newJobFormData.title}
              onChange={handleNewJobFormChange}
              placeholder="Job Title*"
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
            <input
              type="text"
              name="role"
              value={newJobFormData.role}
              onChange={handleNewJobFormChange}
              placeholder="Job Role"
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
            <textarea
              name="description"
              value={newJobFormData.description}
              onChange={handleNewJobFormChange}
              placeholder="Job Description"
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            ></textarea>
            <label htmlFor="applyLink" className="block text-gray-400 text-sm">
              Apply Link
            <input
              type="url"
              name="applyLink"
              value={newJobFormData.applyLink}
              onChange={handleNewJobFormChange}
              placeholder="Apply Link"
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
            </label>
            <label htmlFor="document" className="block text-gray-400 text-sm">
              The allowed formats are pdf, docx and doc
              <input
              type="file"
              name="document"
              onChange={handleNewJobFormChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
            </label>
            
            <Button type="submit" className="w-full">
              {creatingJob ? <Spinner /> : "Create Job"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ul className="space-y-4 mt-4">
        <SpinnerOverlay show={isEditingDeleting}>
          {jobs.map((job) => (
            <li key={job._id} className="p-4 border bg-space-purple/20 rounded">
              {editingJobId === job._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="title"
                    value={editJobFormData.title}
                    onChange={handleEditJobFormChange}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                  <input
                    type="text"
                    name="role"
                    value={editJobFormData.role}
                    onChange={handleEditJobFormChange}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                  <textarea
                    name="description"
                    value={editJobFormData.description}
                    onChange={handleEditJobFormChange}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  ></textarea>
                  <input
                    type="url"
                    name="applyLink"
                    value={editJobFormData.applyLink}
                    onChange={handleEditJobFormChange}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={handleUpdateJob}
                      variant="default"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setEditingJobId(null)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-full max-w-[100%] break-words">
                  <p className="font-semibold"><span className="text-gray-400">Title: </span>{job.title}</p>
                  <p><span className="text-gray-400">Role: </span>{job.role}</p>
                  <p><span className="text-gray-400">Description: </span>{job.description}</p>
                  <p className="text-blue-400 break-words"><span className="text-gray-400">Apply Link: </span>{job.applyLink}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditJobClick(job)}
                      variant="outline"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDeleteJob(job._id)}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
                </>
              )}
            </li>
          ))}
        </SpinnerOverlay>
      </ul>
    </>
  );
};

export default AdminJobs;
