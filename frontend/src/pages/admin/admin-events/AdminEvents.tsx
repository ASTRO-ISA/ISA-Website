import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";

// Types
interface RegisteredUser {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  eventDate: string;
  seatCapacity: number;
  isRegistrationOpen?: boolean;
  registeredUsers?: RegisteredUser[];
  slug: string;
}

export default function AdminEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deletingEventId, setDeletingEventId] = useState(null);
  // Fetch Events
  const { data: events = [], isLoading, isError } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const response = await api.get("/events/all");
        return Array.isArray(response.data) ? response.data : [];
      } catch (err) {
        console.error("Error fetching events:");
        return [];
      }
    },
  });

  // Mutations
  const deleteEventMutation = useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      if (!id) throw new Error("Invalid event ID");
      setDeletingEventId(id);
      return api.delete(`/events/${id}`);
    },
    onSuccess: () => {
      setDeletingEventId(null);
      toast({ title: "Event deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      setDeletingEventId(null);
      console.error("Delete error:", err);
      toast({ title: "Error deleting event" });
    },
  });

  const toggleRegistrationMutation = useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      if (!id) throw new Error("Invalid event ID");
      return api.patch(`/events/${id}/toggle-registration`);
    },
    onSuccess: () => {
      toast({ title: "Registration status updated!" });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      console.error("Toggle registration error:");
      toast({ title: "Error updating registration status" });
    },
  });

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
            {events.map((event) => {
              const seatsTaken = event.registeredUsers?.length ?? 0;
              const seatsLeft = (event.seatCapacity ?? 0) - seatsTaken;
              const soldOut = seatsLeft <= 0;

              return (
                <li key={event._id} className="p-4 border bg-space-purple/20 rounded">
                  <p className="font-semibold">Title: {event.title}</p>
                  <p className="text-gray-400">Description: {event.description}</p>
                  <p className="text-sm text-gray-300">
                    Date: {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "N/A"}
                  </p>
                  <p className="text-sm text-gray-300 pb-2">
                    Seats: {seatsTaken}/{event.seatCapacity}{" "}
                    {soldOut && <span className="text-red-500 font-semibold">(Sold Out)</span>}
                  </p>
                  <div className="flex border-t border-white pt-2 flex-col sm:flex-row gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/events/edit/${event.slug}`)}
                      variant="outline"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => toggleRegistrationMutation.mutate(event._id)}
                      variant={event.isRegistrationOpen ? "destructive" : "outline"}
                      disabled={soldOut}
                    >
                      {event.isRegistrationOpen ? "Disable Registration" : "Enable Registration"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this? This action cannot be undone.")) {
                          deleteEventMutation.mutate(event._id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {deletingEventId === event._id ? <Spinner /> : "Delete"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}