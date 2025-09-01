import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Paper = {
  _id: string;
  title: string;
  authors: string;
  abstract: string;
  publishedOn: string;
  paperUrl?: string;
  status: "pending" | "approved" | "rejected";
};

const fetchPapers = async (status: string) => {
  const res = await api.get(`/research-papers/${status}`, {
    withCredentials: true,
  });

  const data = res.data;
  return Array.isArray(data) ? data : [];
};

const AllResearchPapers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, { response: string }>>({});
  const [showRejectBox, setShowRejectBox] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );

  // Queries for each status
  const { data: pendingPapers } = useQuery({
    queryKey: ["papers", "pending"],
    queryFn: () => fetchPapers("pending"),
  });

  const { data: approvedPapers } = useQuery({
    queryKey: ["papers", "approved"],
    queryFn: () => fetchPapers("approved"),
  });

  const { data: rejectedPapers } = useQuery({
    queryKey: ["papers", "rejected"],
    queryFn: () => fetchPapers("rejected"),
  });

  // Mutation for status change
  const mutation = useMutation({
    mutationFn: async ({
      id,
      newStatus,
      response,
    }: {
      id: string;
      newStatus: string;
      response?: string;
    }) => {
      await api.patch(
        `/research-papers/status/${id}`,
        { status: newStatus, response },
        { withCredentials: true }
      );
    },
    onSuccess: (_, variables) => {
      toast({
        description: `Research paper marked as ${variables.newStatus}.`,
      });

      queryClient.invalidateQueries({ queryKey: ["papers", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["papers", variables.newStatus] });
    },
    onError: (_, variables) => {
      toast({
        description: `Something went wrong while marking as ${variables.newStatus}.`,
        variant: "destructive",
      });
    },
  });

  const toggleAbstract = (paperId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [paperId]: !prev[paperId],
    }));
  };

  const handleResponseChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], response: value },
    }));
  };

  const changeStatus = (id: string, newStatus: "approved" | "rejected") => {
    const response = formData[id]?.response?.trim() || "";

    if (newStatus === "rejected" && !response) {
      toast({
        title: "Response required",
        description: "Please add a response before rejecting.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({ id, newStatus, response });
    setShowRejectBox((prev) => ({ ...prev, [id]: false }));
  };

  const renderPaper = (paper: Paper, showActions = false) => (
    <li
      key={paper._id}
      className="flex flex-col gap-3 p-4 border mb-4 bg-space-purple/20 rounded"
    >
      <p className="text-3xl font-semibold text-orange-200">{paper.title}</p>
      <p><span className="text-gray-400">Author: </span>{paper.authors}</p>
      <p>
        <span className="text-gray-400">Published on: </span>
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

      <hr className="mt-2"/>

      {showActions && (
        <div className="flex flex-col gap-3 mt-4">
          {/* Approve button (instant) */}
          <Button
            className="max-w-[10rem]"
            onClick={() => changeStatus(paper._id, "approved")}
          >
            Approve
          </Button>

          {/* Reject flow */}
          {!showRejectBox[paper._id] ? (
            <Button
              className="max-w-[10rem]"
              onClick={() =>
                setShowRejectBox((prev) => ({ ...prev, [paper._id]: true }))
              }
            >
              Reject
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea
                onChange={(e) => handleResponseChange(paper._id, e.target.value)}
                value={formData[paper._id]?.response || ""}
                placeholder="Write admin response (required for rejection)..."
                className="w-full p-2 text-sm text-black border border-gray-300 rounded"
              />
              <div className="flex gap-2">
                <Button
                  className="max-w-[10rem]"
                  onClick={() => changeStatus(paper._id, "rejected")}
                >
                  Confirm Reject
                </Button>
                <Button
                  className="max-w-[10rem] bg-gray-500 hover:bg-gray-600"
                  onClick={() =>
                    setShowRejectBox((prev) => ({ ...prev, [paper._id]: false }))
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );

  const renderList = () => {
    const list =
      activeTab === "pending"
        ? pendingPapers
        : activeTab === "approved"
        ? approvedPapers
        : rejectedPapers;

    if (!Array.isArray(list) || list.length === 0) {
      return <p className="text-gray-400">No {activeTab} papers.</p>;
    }

    return (
      <ul>
        {list.map((p: Paper) => renderPaper(p, activeTab === "pending"))}
      </ul>
    );
  };

  return (
    <div className="space-y-10 mt-4">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setActiveTab("pending")}
          className={activeTab === "pending" ? "bg-space-accent" : ""}
        >
          Pending
        </Button>
        <Button
          onClick={() => setActiveTab("approved")}
          className={activeTab === "approved" ? "bg-space-accent" : ""}
        >
          Approved
        </Button>
        <Button
          onClick={() => setActiveTab("rejected")}
          className={activeTab === "rejected" ? "bg-space-accent" : ""}
        >
          Rejected
        </Button>
      </div>

      {/* Active Section */}
      <section>
        <h2 className="text-2xl font-bold capitalize mb-3">
          {activeTab} Papers
        </h2>
        {renderList()}
      </section>
    </div>
  );
};

export default AllResearchPapers;