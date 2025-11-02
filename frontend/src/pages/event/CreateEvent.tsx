import { useState } from "react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventEndTime: "",
    location: "",
    attendeeCount: 0,
    seatCapacity: "",
    eventType: "",
    hostedBy: [{ name: "" }],
    presentedBy: "",
    type: "",
    status: "",
    isFree: true,
    fee: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e, idx = null) => {
    const { name, value, type } = e.target;
  
    if (name.startsWith("hostedBy") && idx !== null) {
      const updatedHosts = [...formData.hostedBy];
      updatedHosts[idx].name = value;
      setFormData({ ...formData, hostedBy: updatedHosts });
    } else if (name === "isFree") {
      const isFree = value === "true";
      setFormData({ ...formData, isFree, fee: isFree ? "" : formData.fee });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const addHost = () => {
    setFormData({
      ...formData,
      hostedBy: [...formData.hostedBy, { name: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selected = new Date(formData.eventDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // zero out time

    if (selected < now) {
      toast({
        description:
          "You can’t set an event in the past. Please select correct date.",
      });
      return;
    }
    if (formData.description.length < 100) {
      toast({
        description: "Mininum 100 characters required for description.",
      });
      return;
    }
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "hostedBy") {
          data.append(key, JSON.stringify(value));
        } else if (typeof value === "number") {
          data.append(key, value.toString());
        } else if (typeof value === "boolean") {
          data.append(key, value ? "true" : "false"); // store boolean as string
        } else if (value !== null && value !== undefined) {
          data.append(key, value.toString());
        }
      });
      if (thumbnailFile) {
        data.append("thumbnail", thumbnailFile);
      }

      const res = await api.post("/events/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        eventDate: "",
        eventEndTime: "",
        location: "",
        attendeeCount: 0,
        seatCapacity: "",
        eventType: "",
        hostedBy: [{ name: "" }],
        presentedBy: "",
        type: "",
        status: "",
        isFree: true,   // <-- added
        fee: "",        // <-- added
      });
      setThumbnailFile(null);
      navigate("/events");
      toast({
        title: "Event created successfully!",
        description: "It will be live once its been reviewd."
      });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
      toast({
        description: "Something went wrong creating event!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white pt-20 px-4">
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold pt-10">Create Event</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Banner */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Banner
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="block w-full text-sm text-gray-300 file:bg-space-purple/30 file:border-0 file:px-4 file:py-2 file:rounded file:text-white hover:file:bg-space-purple/50 transition"
              />
            </div>

            {/* Title */}
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-zinc-800"
              placeholder="Title *"
              required
            />

            {/* Description */}
            <div>
              <label htmlFor="description" className="text-sm text-gray-400">
                Description (min 100 characters)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-800"
                placeholder="Description"
                required
              />
              <p className="text-xs text-gray-400 mt-0">
                {formData.description.length}
              </p>
            </div>

            {/* Dates */}
            <label htmlFor="eventDate" className="block text-gray-400 text-xs">
              Start Date and Time* (use given calender option for precision)
              <input
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="block p-2 mt-1 rounded bg-zinc-800"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </label>

            <label
              htmlFor="eventEndTime"
              className="block text-gray-400 text-xs"
            >
              End Time*
              <input
                type="datetime-local"
                name="eventEndTime"
                value={formData.eventEndTime}
                onChange={handleChange}
                className="block p-2 mt-1 rounded bg-zinc-800"
              />
            </label>

            {/* Other Inputs */}
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 rounded bg-zinc-800"
              placeholder="Location *"
              required
            />

            <div>
              <label htmlFor="seatCapacity" className="block text-sm text-gray-400">
                Seat Capacity (Max Attendees Allowed) *
              </label>
              <input
                id="seatCapacity"
                name="seatCapacity"
                value={formData.seatCapacity}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-800"
                min="1"
                required
              />
            </div>

            <input
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full p-2 rounded bg-zinc-800"
              placeholder="Event Type (Virtual/In-Person) *"
              required
            />

            <input
              name="presentedBy"
              value={formData.presentedBy}
              onChange={handleChange}
              className="w-full p-2 rounded bg-zinc-800"
              placeholder="Presented By"
            />

            {/* Hosted By */}
            <div>
              <label
                htmlFor="host"
                className="block mb-1 text-sm text-gray-400"
              >
                Hosted By:
              </label>
              {formData.hostedBy.map((host, idx) => (
                <input
                  key={idx}
                  name={`hostedBy-${idx}`}
                  id="host"
                  value={host.name}
                  onChange={(e) => handleChange(e, idx)}
                  className="w-full mb-2 p-2 rounded bg-zinc-800"
                  placeholder={`Host ${idx + 1} name`}
                />
              ))}
              <button
                type="button"
                onClick={addHost}
                className="text-sm text-space-accent underline"
              >
                + Add another host
              </button>
            </div>

            {/* Dropdowns */}
            <div>
              <label
                htmlFor="event-type"
                className="block text-sm text-gray-400"
              >
                Event Category:
              </label>
              <select
                id="event-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-800"
                required
              >
                <option value="">-- Select Event Category --</option>
                <option value="community">Community</option>
                <option value="astronomical">Astronomical</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm text-gray-400">
                Event Status:
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-800"
                required
              >
                <option value="">-- Event Status --</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
  <label htmlFor="isFree" className="block text-sm text-gray-400">
    Event Type (Free/Paid):
  </label>
  <select
    id="isFree"
    name="isFree"
    value={formData.isFree ? "true" : "false"}
    onChange={handleChange}
    className="w-full p-2 rounded bg-zinc-800"
    required
  >
    <option value="true">Free</option>
    <option value="false">Paid</option>
  </select>
</div>

{!formData.isFree && (
  <div>
    <label htmlFor="fee" className="block text-sm text-gray-400">
      Fee Amount (₹):
    </label>
    <input
      id="fee"
      name="fee"
      type="number"
      value={formData.fee}
      onChange={handleChange}
      className="w-full p-2 rounded bg-zinc-800"
      min="1"
      required
    />
  </div>
)}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-space-accent p-2 rounded text-white font-bold"
            >
              {isSubmitting ? "Submitting..." : "Create Event"}
            </button>

            {successMsg && <p className="text-green-500 mt-2">{successMsg}</p>}
            {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
