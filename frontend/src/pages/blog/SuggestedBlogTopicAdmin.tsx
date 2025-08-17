import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const SuggestedBlogTopic = () => {
  const { toast } = useToast();
  const { isLoggedIn } = useAuth(); // optional useAuth, if admin auth needed
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({});

  // Handle Status Change (Approve/Reject)
  const handleStatusChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: value },
    }));
  };

  // Handle Response Change (Admin's feedback)
  const handleResponseChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], response: value },
    }));
  };

  const fetchSuggestions = async () => {
    try {
      const res = await api.get("/suggest-blog/pending");

      const suggestions = res.data.data || res.data; // fallback if it's not nested
      setSuggestions(suggestions);

      const initialFormData = {};
      if (Array.isArray(suggestions)) {
        suggestions.forEach((s) => {
          initialFormData[s._id] = {
            status: s.status || "pending",
            response: s.response || "",
          };
        });
      }

      setFormData(initialFormData);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Update Suggestion Status + Response
  const handleUpdate = async (id) => {
    try {
      const { status, response } = formData[id];
      await api.patch(`/suggest-blog/${id}`, { status, response }, {withCredentials: true});
      toast({ title: "Status updated successfully!" });
      fetchSuggestions();
    } catch (err) {
      console.error("Update failed", err);
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  // Delete Suggestion
  const handleDelete = async (id) => {
    try {
      await api.delete(`/suggest-blog/${id}`);
      setSuggestions((prev) => prev.filter((s) => s._id !== id));
      toast({ title: "Deleted successfully!" });
    } catch (err) {
      toast({ title: "Deletion failed", variant: "destructive" });
    }
  };

  return (
    <div>
      <TabsContent value="suggestions" className="space-y-6">
        <Card className="bg-space-purple/10 border-space-purple/30">
          <CardHeader>
            <CardTitle>Suggested Blog Topics</CardTitle>
          </CardHeader>
          <CardContent>
            {suggestions.length === 0 ? (
              <p className="text-gray-400">No suggestions yet.</p>
            ) : (
              <ul className="space-y-4">
                {suggestions.map((s) => (
                  <li key={s._id} className="p-4 border border-space-purple/30 rounded bg-space-purple/20 space-y-2">
                    <p className="font-medium">{s.title}</p>
                    <p className="text-sm text-gray-400">
                      <span className="text-white">Description: </span> {s.description}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-white">Suggested By: </span> {s.submittedBy.email}
                    </p>

                    {/* Approve / Reject Radio */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`status-${s._id}`}
                          value="approved"
                          checked={formData[s._id]?.status === "approved"}
                          onChange={() => handleStatusChange(s._id, "approved")}
                          className="accent-space-purple"
                        />
                        <span className="text-sm">Approve</span>
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`status-${s._id}`}
                          value="rejected"
                          checked={formData[s._id]?.status === "rejected"}
                          onChange={() => handleStatusChange(s._id, "rejected")}
                          className="accent-space-purple"
                        />
                        <span className="text-sm">Reject</span>
                      </label>
                    </div>

                    {/* Admin Response Textarea */}
                    <textarea
                      onChange={(e) => handleResponseChange(s._id, e.target.value)}
                      value={formData[s._id]?.response || ""}
                      placeholder="Write admin response here..."
                      className="w-full p-2 mt-4 text-sm text-black border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-space-purple"
                    />

                    {/* Update / Delete Buttons */}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleUpdate(s._id)}
                        className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Update
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default SuggestedBlogTopic;
