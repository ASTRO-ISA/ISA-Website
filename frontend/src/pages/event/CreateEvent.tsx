// components/EventForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    attendeeCount: 0,
    eventType: "",
    hostedBy: [{ name: "" }],
    presentedBy: "",
    type: "",
    status: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e, idx = null) => {
    const { name, value } = e.target;

    if (name.startsWith("hostedBy") && idx !== null) {
      const updatedHosts = [...formData.hostedBy];
      updatedHosts[idx].name = value;
      setFormData({ ...formData, hostedBy: updatedHosts });
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
        description: "You can’t set an event in the past. Please select correct date." 
      })
      return;
    }
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "hostedBy") {
          data.append(key, JSON.stringify(value)); // hostedBy is an array of objects
        } else if (typeof value === "number") {
          data.append(key, value.toString()); // convert number to string
        } else if (value !== null && value !== undefined) {
          data.append(key, value.toString());
        }
      });
      if (thumbnailFile) {
        data.append("thumbnail", thumbnailFile);
      }

      const res = await axios.post(
        "http://localhost:3000/api/v1/events/create",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setSuccessMsg("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        attendeeCount: 0,
        eventType: "",
        hostedBy: [{ name: "" }],
        presentedBy: "",
        type: "",
        status: "",
      });
      setThumbnailFile(null);
      navigate("/events");
      toast({
        title: "Event created successfully!",
      });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
      toast({
        title: "Error creating event!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* <div className="max-w-2xl mx-auto mt-10 p-6 bg-zinc-900 text-white rounded-xl shadow-lg"> */}
      <h2 className="text-2xl font-bold mb-4 pt-11 mt-10">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Thumbnail Image
        </label>
        <input
          type="file"
          accept="image/*"
          placeholder="Choose a file"
          onChange={handleThumbnailChange}
          className="block w-full text-sm text-gray-300 file:bg-space-purple/30 file:border-0 file:px-4 file:py-2 file:rounded file:text-white hover:file:bg-space-purple/50 transition"
        />

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800"
          placeholder="Title *"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800"
          placeholder="Description (min 100 characters)"
          required
        />

        <input
          type="datetime-local"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800"
          required
          min={new Date().toISOString().split("T")[0]}
        />

        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800"
          placeholder="Location *"
          required
        />

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

        {/* Hosted By (Multiple) */}
        <div>
          <label className="block mb-1 font-medium">Hosted By:</label>
          {formData.hostedBy.map((host, idx) => (
            <input
              key={idx}
              name={`hostedBy-${idx}`}
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

        {/* Type and Status */}
        <label htmlFor="event-type" className="block mb-1 font-medium">
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

        <label htmlFor="status" className="block mb-1 font-medium">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-space-accent bg-space-accent-700 p-2 rounded text-white font-bold"
        >
          {isSubmitting ? "Submitting..." : "Create Event"}
        </button>

        {successMsg && <p className="text-green-500 mt-2">{successMsg}</p>}
        {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
      </form>
      {/* </div> */}
    </>
  );
};

export default CreateEvent;
