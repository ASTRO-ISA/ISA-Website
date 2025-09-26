import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Types
interface HostedBy { name: string; }
interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  eventEndTime: string;
  location: string;
  seatCapacity: string;
  eventType: string;
  hostedBy: HostedBy[];
  presentedBy: string;
  type: string;
  status: string;
  isFree: boolean;
  fee: string;
}

export default function EditEvent() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [eventId, setEventId] = useState<string | null>(null)

  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: "",
    description: "",
    eventDate: "",
    eventEndTime: "",
    location: "",
    seatCapacity: "",
    eventType: "",
    hostedBy: [{ name: "" }],
    presentedBy: "",
    type: "",
    status: "",
    isFree: true,
    fee: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Event Details
  useEffect(() => {
    if (!slug) return;
    api.get(`/events/${slug}`)
      .then(res => {
        const event = res.data;
        setEventId(event._id);
        setEventFormData({
          title: event.title ?? "",
          description: event.description ?? "",
          eventDate: event.eventDate?.slice(0, 16) ?? "",
          eventEndTime: event.eventEndTime?.slice(0, 16) ?? "",
          location: event.location ?? "",
          seatCapacity: event.seatCapacity ?? 0,
          eventType: event.eventType ?? "",
          hostedBy: event.hostedBy?.length ? event.hostedBy : [{ name: "" }],
          presentedBy: event.presentedBy ?? "",
          type: event.type ?? "",
          status: event.status ?? "",
          isFree: event.isFree ?? true,
          fee: event.fee ?? "",
        });
      })
      .catch(err => {
        console.error(err);
        toast({ title: "Error fetching event details" });
      });
  }, [slug]);

  // Handle Input Changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    idx: number | null = null
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("hostedBy") && idx !== null) {
      const updatedHosts = [...eventFormData.hostedBy];
      updatedHosts[idx] = { name: value };
      setEventFormData({ ...eventFormData, hostedBy: updatedHosts });
    } else if (name === "isFree") {
      setEventFormData({ 
        ...eventFormData, 
        isFree: value === "true", 
        fee: value === "true" ? "0" : eventFormData.fee 
      });
    } else if (type === "number") {
      setEventFormData({ 
        ...eventFormData, 
        [name]: value === "" ? "" : Number(value) 
      });
    } else {
      setEventFormData({ ...eventFormData, [name]: value });
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setThumbnailFile(e.target.files[0]);
  };

  const addHost = () => {
    setEventFormData({ ...eventFormData, hostedBy: [...eventFormData.hostedBy, { name: "" }] });
  };

  // Mutation
  const updateMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
        if (!eventId) throw new Error('Event ID is missing')
      const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === "hostedBy") formData.append(key, JSON.stringify(value))
          else if (key === "isFree") formData.append(key, value ? "true" : "false")
          else if (key === "fee") {
            if (data.isFree) formData.append("fee", "0") // force 0 if free
            else formData.append(key, value.toString())
          }
          else if (value !== null && value !== undefined) formData.append(key, value.toString())
        });
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
      return api.put(`/events/${eventId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: () => {
      toast({ title: "Event updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
    onError: () => toast({ title: "Error updating event" }),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    updateMutation.mutate(eventFormData, {
      onSettled: () => setIsSubmitting(false),
    });
  };

  return (
    <div className="min-h-screen bg-space-dark text-white pt-20 px-4">
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold pt-10">Edit Event</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Banner */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Banner</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className="block w-full text-sm text-gray-300 file:bg-space-purple/30 file:border-0 file:px-4 file:py-2 file:rounded file:text-white hover:file:bg-space-purple/50 transition"/>
            </div>

            {/* Title */}
            <input name="title" value={eventFormData.title} onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" placeholder="Title *" required/>

            {/* Description */}
            <div>
              <label htmlFor="description" className="text-sm text-gray-400">Description (min 100 characters) (Drag from bottom right corner to expand)</label>
              <textarea name="description" value={eventFormData.description} onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" placeholder="Description" required/>
              <p className="text-xs text-gray-400 mt-0">{eventFormData.description.length}</p>
            </div>

            {/* Dates */}
            <label htmlFor="eventDate" className="block text-gray-400 text-xs">
              Start Date and Time*
              <input type="datetime-local" name="eventDate" value={eventFormData.eventDate} onChange={handleChange} className="block p-2 mt-1 rounded bg-zinc-800" required/>
            </label>

            <label htmlFor="eventEndTime" className="block text-gray-400 text-xs">
              End Time*
              <input type="datetime-local" name="eventEndTime" value={eventFormData.eventEndTime} onChange={handleChange} className="block p-2 mt-1 rounded bg-zinc-800"/>
            </label>

            {/* Location & Capacity */}
            <input name="location" value={eventFormData.location} onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" placeholder="Location *" required/>
            <input name="seatCapacity" value={eventFormData.seatCapacity} onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" placeholder="Seat Capacity *" min={1} required/>
            <input name="eventType" value={eventFormData.eventType} onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" placeholder="Event Type *" required/>
            <input name="presentedBy" value={eventFormData.presentedBy} onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" placeholder="Presented By"/>

            {/* Hosted By */}
            {eventFormData.hostedBy.map((host, idx) => (
              <input key={idx} value={host.name} onChange={(e) => handleChange(e, idx)} className="w-full p-2 rounded bg-zinc-800 mb-2" placeholder={`Host ${idx + 1}`}/>
            ))}
            <button type="button" onClick={addHost} className="text-sm text-space-accent underline">+ Add another host</button>

            {/* Dropdowns */}
            <select name="type" value={eventFormData.type} onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" required>
              <option value="">-- Select Category --</option>
              <option value="community">Community</option>
              <option value="astronomical">Astronomical</option>
            </select>

            <select name="status" value={eventFormData.status} onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" required>
              <option value="">-- Event Status --</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>

            <select name="isFree" value={eventFormData.isFree ? "true" : "false"} onChange={handleChange} className="w-full p-2 rounded bg-zinc-800">
              <option value="true">Free</option>
              <option value="false">Paid</option>
            </select>

            {!eventFormData.isFree && (
              <input name="fee" type="number" value={eventFormData.fee} onChange={handleChange} min={1} placeholder="Fee Amount (₹)" className="w-full p-2 rounded bg-zinc-800" required/>
            )}

            {/* Buttons */}
            <div className="flex gap-2 mt-2">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
              <Button type="button" onClick={() => navigate("/admin/events")} variant="outline">Cancel</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}