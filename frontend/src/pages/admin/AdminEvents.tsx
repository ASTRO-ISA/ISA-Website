import { useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminEvents() {
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Events
  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get("/events/");
      return response.data;
    },
  });

  // Update Event Mutation
  const updateEventMutation = useMutation<
    void,
    unknown,
    {
      id: string;
      data: { title: string; description: string; eventDate: string };
    }
  >({
    mutationFn: async ({ id, data }) => {
      await api.put(`/events/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Event updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setEditingEventId(null);
      setEventFormData({ title: "", description: "", eventDate: "" });
    },
    onError: () => {
      toast({ title: "Error updating event" });
    },
  });

  // Delete Event Mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/events/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Event deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: () => {
      toast({ title: "Error deleting event" });
    },
  });

  const handleEditEventClick = (event) => {
    setEditingEventId(event._id);
    setEventFormData({
      title: event.title,
      description: event.description,
      eventDate: event.eventDate.split("T")[0],
    });
  };

  const handleCancelEventEdit = () => {
    setEditingEventId(null);
    setEventFormData({ title: "", description: "", eventDate: "" });
  };

  const handleEventChange = (e) => {
    setEventFormData({ ...eventFormData, [e.target.name]: e.target.value });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    updateEventMutation.mutate({
      id: editingEventId,
      data: eventFormData,
    });
  };

  if (isLoading) return <p className="text-gray-400">Loading events...</p>;
  if (isError) return <p className="text-red-500">Failed to load events</p>;

  return (
    <Card className="bg-space-purple/10 border-space-purple/30">
      <CardHeader>
        <CardTitle>Manage Events</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-gray-400">No events available.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event._id}
                className="p-4 border bg-space-purple/20 rounded"
              >
                {editingEventId === event._id ? (
                  <form onSubmit={handleEventSubmit} className="space-y-2">
                    <label>
                      Title:
                      <input
                        type="text"
                        name="title"
                        value={eventFormData.title}
                        onChange={handleEventChange}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        required
                      />
                    </label>
                    <label>
                      Description:
                      <textarea
                        name="description"
                        value={eventFormData.description}
                        onChange={handleEventChange}
                        rows={4}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        required
                      ></textarea>
                    </label>
                    <label>
                      Event Date:
                      <input
                        type="date"
                        name="eventDate"
                        value={eventFormData.eventDate}
                        onChange={handleEventChange}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </label>
                    <div className="flex gap-2">
                      <Button type="submit">
                        {updateEventMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancelEventEdit}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="font-semibold">
                      <span className="text-gray-400">Title: </span>
                      {event.title}
                    </p>
                    <p>
                      <span className="text-gray-400">Description: </span>
                      {event.description}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-400">Date: </span>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditEventClick(event)}
                        variant="outline"
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => deleteEventMutation.mutate(event._id)}
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
