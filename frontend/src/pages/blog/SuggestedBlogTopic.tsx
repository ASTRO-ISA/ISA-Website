import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import React, { useEffect, useState } from "react";



import axios from "axios";

const SuggestedBlogTopic = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({});

  const handleStatusChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: value,
      },
    }));
  };

  const handleResponseChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        response: value,
      },
    }));
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/suggestBlog/",
          {
            withCredentials: true,
          }
        );

        console.log(res);
        setSuggestions(res.data.data || []);
        const initialFormData = {};
        res.data.data.forEach((s) => {
          initialFormData[s._id] = {
            status: s.status || "pending",
            response: s.response || "",
          };
        });
        setFormData(initialFormData);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    };

    fetchSuggestions();
  }, []);

  const handleUpdate = async (id, status, response) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/suggestBlog/${id}`,
        {
          status,
          response,
        },
        {
          withCredentials: true,
        }
      );
      alert("Updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/suggestBlog/${id}`, {
        withCredentials: true,
      });
      setSuggestions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
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
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="p-4 border border-space-purple/30 rounded bg-space-purple/20 space-y-2"
                  >
                    <p className="font-medium">{s.title}</p>
                    <p className="text-sm text-gray-400">
                      <span className=" text-white ">Description: </span>{" "}
                      {s.description}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className=" text-white ">Suggested By: </span>
                      {s.submittedBy.email}
                    </p>

                    {/* Radio Buttons for Approval */}
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
                        <span className="text-sm">Approved</span>
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
                        <span className="text-sm">Rejected</span>
                      </label>
                    </div>

                    {/* Textarea for Admin Response */}
                    <textarea
                      onChange={(e) =>
                        handleResponseChange(s._id, e.target.value)
                      }
                      placeholder="Write response here..."
                      className="w-full p-2 mt-4 text-sm text-black border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-space-purple"
                      value={formData[s._id]?.response || ""}
                    />
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          handleUpdate(
                            s._id,
                            formData[s._id]?.status || "",
                            formData[s._id]?.response || ""
                          )
                        }
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
