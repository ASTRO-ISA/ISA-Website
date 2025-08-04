import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Trash2 } from "lucide-react";

const ApprovedBlogSuggestions = () => {
  const [approvedSuggestions, setApprovedSuggestions] = useState([]);
  const { toast } = useToast();
  const { userInfo } = useAuth();

  const fetchApprovedSuggestions = async () => {
    try {
      const res = await api.get("/suggestBlog");
      const approved = res.data.data.filter((s) => s.status === "approved");
      setApprovedSuggestions(approved);
    } catch (error) {
      console.error("Failed to fetch approved suggestions", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/suggestBlog/${id}`);
      setApprovedSuggestions((prev) => prev.filter((s) => s._id !== id));
      toast({ title: "Deleted successfully." });
    } catch (error) {
      toast({ title: "Deletion failed", description: error.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchApprovedSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-space-dark text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Approved Blog Suggestions</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {approvedSuggestions.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center">No approved suggestions yet.</p>
        ) : (
          approvedSuggestions.map((suggestion) => (
            <Card
              key={suggestion._id}
              className="bg-space-purple/10 border border-space-purple/30 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              <CardHeader>
                <CardTitle className="text-lg text-space-accent">
                  {suggestion.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">{suggestion.description}</p>

                {suggestion.response && (
                  <div className="bg-space-purple/20 p-3 rounded-md">
                    <h4 className="text-sm font-semibold text-white mb-1">Admin's Response:</h4>
                    <p className="text-sm text-gray-300">{suggestion.response}</p>
                  </div>
                )}

                <p className="mt-4 text-xs text-gray-400">
                  Suggested by: {suggestion.submittedBy.email}
                </p>
              </CardContent>

              {/* Delete Button for Admin */}
              {userInfo?.user.role === "admin" && (
                <button
                  onClick={() => handleDelete(suggestion._id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-600"
                  title="Delete Suggestion"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovedBlogSuggestions;