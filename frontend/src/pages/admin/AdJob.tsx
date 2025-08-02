import { useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchJobs = async () => {
  const res = await axios.get("http://localhost:3000/api/v1/jobs/", {
    withCredentials: true,
  });
  return res.data.data;
};

const AdminJobs = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [creatingJob, setCreatingJob] = useState(false);
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

  // Fetch jobs with useQuery
  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  //Create Job
  const createJobMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      Object.entries(newJobFormData).forEach(([key, val]) =>
        formData.append(key, val)
      );

      await api.post(`/jobs/`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast({ title: "Job created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setNewJobFormData({
        title: "",
        role: "",
        description: "",
        applyLink: "",
        document: null,
      });
    },
    onError: () => toast({ title: "Error Occurred!" }),
  });

  // Delete Job
  const deleteJobMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/jobs/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Job deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast({ title: "Error deleting job!" }),
  });

  // Update Job
  const updateJobMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/jobs/${editingJobId}`, editJobFormData);
    },
    onSuccess: () => {
      toast({ title: "Job updated successfully!" });
      setEditingJobId(null);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      toast({ title: "Error updating job" });
    },
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

  const handleEditJobClick = (job) => {
    setEditingJobId(job._id);
    setEditJobFormData({
      title: job.title,
      role: job.role,
      description: job.description,
      applyLink: job.applyLink,
    });
  };

  if (isLoading)
    return <SpinnerOverlay show={isLoading}>{null}</SpinnerOverlay>;
  if (isError) return <p className="text-red-500">Error loading jobs...</p>;

  return (
    <>
      {/* New Job Form */}
      <Card className="bg-space-purple/10 border-space-purple/30">
        <CardHeader>
          <CardTitle>Create New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createJobMutation.mutate();
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
              {createJobMutation.isPending ? <Spinner /> : "Create Job"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Job List */}
      <ul className="space-y-4 mt-4">
        <SpinnerOverlay
          show={deleteJobMutation.isPending || updateJobMutation.isPending}
        >
          {jobs.map((job) => (
            <li key={job._id} className="p-4 border bg-space-purple/20 rounded">
              {editingJobId === job._id ? (
                <div className="space-y-2">
                  {/* Edit Form Inputs */}
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
                      onClick={() => updateJobMutation.mutate()}
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
                  {/* Display Job */}
                  <p className="font-semibold">
                    <span className="text-gray-400">Title: </span>
                    {job.title}
                  </p>
                  <p>
                    <span className="text-gray-400">Role: </span>
                    {job.role}
                  </p>
                  <p>
                    <span className="text-gray-400">Description: </span>
                    {job.description}
                  </p>
                  <p className="text-blue-400 break-words">
                    <span className="text-gray-400">Apply Link: </span>
                    {job.applyLink}
                  </p>
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
                      onClick={() => deleteJobMutation.mutate(job._id)}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
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
