import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";
import { useRef } from "react";

const AdminWebinars = () => {
  const { toast } = useToast();
  const [creatingWebinar, setCreatingWebinar] = useState(false);
  const [webinars, setWebinars] = useState([]);
  const [editingWebinarId, setEditingWebinarId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newWebinarFormData, setNewWebinarFormData] = useState({
    title: "",
    presenter: "",
    description: "",
    webinarDate: "",
    type: "",
    videoLink: "",
    thumbnail: null,
  });
  const [editWebinarFormData, setEditWebinarFormData] = useState({ ...newWebinarFormData });
  const allowedTypes = ["upcoming", "live", "past"];
  const fileInputRef = useRef(null);

  const handleNewChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "image") {
      setNewWebinarFormData({ ...newWebinarFormData, thumbnail: files[0] });
    } else if (name === "description") {
      setNewWebinarFormData({
        ...newWebinarFormData,
        [name]: value.slice(0, 180),
      });
    } else {
      setNewWebinarFormData({ ...newWebinarFormData, [name]: value });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditWebinarFormData({ ...editWebinarFormData, [name]: value });
  };

  const fetchWebinars = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/webinars", { withCredentials: true });
      setWebinars(res.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  const handleCreate = async () => {
    if (!allowedTypes.includes(newWebinarFormData.type.toLowerCase())) {
      toast({
        title: "Invalid type",
        description: "Type must be 'upcoming', 'live', or 'past'",
        variant: "destructive",
      });
      return;}
    try {
      setCreatingWebinar(true);
      const formData = new FormData();
      for (const key in newWebinarFormData) {
        formData.append(key, newWebinarFormData[key]);
      }
      await axios.post("http://localhost:3000/api/v1/webinars/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({ title: "Webinar created" });
      setCreatingWebinar(false);
      setNewWebinarFormData({ title: "", presenter: "", description: "", webinarDate: "", type: "", videoLink: "", thumbnail: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      fetchWebinars();
    } catch (err) {
      console.error("Create error:", err.message);
      setCreatingWebinar(false);
      toast({ title: "Error creating webinar" });
    }
  };

  const handleDelete = async (id) => {
    setIsProcessing(true);
    try {
      await axios.delete(`http://localhost:3000/api/v1/webinars/${id}`, { withCredentials: true });
      toast({ title: "Deleted successfully" });
      fetchWebinars();
    } catch (err) {
      toast({ title: "Error deleting webinar" });
      console.error("Delete error:", err.message);
    }
    setIsProcessing(false);
  };

  const handleUpdate = async () => {
    setIsProcessing(true);
    try {
      await axios.patch(`http://localhost:3000/api/v1/webinars/${editingWebinarId}`, editWebinarFormData, { withCredentials: true });
      toast({ title: "Updated successfully" });
      setEditingWebinarId(null);
      fetchWebinars();
    } catch (err) {
      toast({ title: "Update failed" });
      console.error("Update error:", err.message);
    }
    setIsProcessing(false);
  };

  const handleEditClick = (webinar) => {
    setEditingWebinarId(webinar._id);
    setEditWebinarFormData({ ...webinar });
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  return (
    <>
      <Card className="bg-space-purple/10 border-space-purple/30">
        <CardHeader>
          <CardTitle>Create New Webinar</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            // className="space-y-4"
          >
            <input
              name="title"
              type="text"
              placeholder="Title"
              value={newWebinarFormData.title}
              onChange={handleNewChange}
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
              required
            />
            <input
              name="presenter"
              type="text"
              placeholder="Presenter"
              value={newWebinarFormData.presenter}
              onChange={handleNewChange}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
              required
            />
            <label htmlFor="description" className="text-sm text-gray-400">Description (max 180 characters allowed)</label>
            <textarea
              name="description"
              placeholder="Description"
              value={newWebinarFormData.description}
              onChange={handleNewChange}
              className="w-full p-2 mb-0 rounded bg-gray-800 text-white"
              required
            />
            <p className="text-xs mt-0 mb-4 text-gray-400">
              {180 - newWebinarFormData.description.length}/180
            </p>
            <input
              name="webinarDate"
              type="datetime-local"
              placeholder="Date"
              value={newWebinarFormData.webinarDate}
              onChange={handleNewChange}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
              required
            />
            <label htmlFor="type" className="text-sm text-gray-400">Webinar Type <span>(upcoming/live/past)</span></label>
            <input
              name="type"
              type="text"
              placeholder="Type (upcoming, live, past)"
              value={newWebinarFormData.type}
              onChange={handleNewChange}
              onBlur={() => {
                const allowedTypes = ["upcoming", "live", "past"];
                if (!allowedTypes.includes(newWebinarFormData.type.toLowerCase())) {
                  toast({
                    title: "Invalid type",
                    description: "Type must be 'upcoming', 'live', or 'past'",
                    variant: "destructive",
                  });
                }
              }}
              className="w-full p-2 rounded mb-4 bg-gray-800 text-white"
            />
            <input
              name="videoLink"
              type="text"
              placeholder="YouTube Video Link"
              value={newWebinarFormData.videoLink}
              onChange={handleNewChange}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
            />
            <label htmlFor="image" className="text-sm text-gray-400">Thumbnail</label>
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              onChange={handleNewChange}
              className="w-full p-2 rounded mb-3 bg-gray-800 text-white"
            />
            <Button type="submit" className="w-full">
              {creatingWebinar ? <Spinner /> : "Create Webinar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ul className="space-y-4 mt-4">
        <SpinnerOverlay show={isProcessing}>
            {Array.isArray(webinars) && webinars.length > 0 ? (
            webinars.map((webinar) => (
                <li key={webinar._id} className="p-4 border bg-space-purple/20 rounded">
                {editingWebinarId === webinar._id ? (
                    <div className="space-y-2">
                    <input
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={editWebinarFormData.title}
                        onChange={handleEditChange}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                    <input
                        name="presenter"
                        type="text"
                        placeholder="Presenter"
                        value={editWebinarFormData.presenter}
                        onChange={handleEditChange}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                    <label htmlFor="description" className="text-sm text-gray-400">Description (max 180 characters allowed)</label>
                    <textarea
                      name="description"
                      placeholder="Description"
                      value={newWebinarFormData.description}
                      onChange={handleNewChange}
                      className="w-full p-2 mb-0 rounded bg-gray-800 text-white"
                      required
                    />
                    <p className="text-xs mt-0 mb-4 text-gray-400">
                      {180 - newWebinarFormData.description.length}/180
                    </p>
                    <input
                        name="date"
                        type="datetime-local"
                        value={editWebinarFormData.webinarDate}
                        onChange={handleEditChange}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                    <input
                        name="type"
                        type="text"
                        placeholder="Type"
                        value={editWebinarFormData.type}
                        onChange={handleEditChange}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                    <input
                        name="videoLink"
                        type="text"
                        placeholder="YouTube Video Link"
                        value={editWebinarFormData.videoLink}
                        onChange={handleEditChange}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                    <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={handleUpdate}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingWebinarId(null)}>Cancel</Button>
                    </div>
                    </div>
                ) : (
                    <div className="w-full max-w-[100%] break-words">
                    <p className="font-semibold"><span className="text-gray-400">Title: </span>{webinar.title}</p>
                    <p><span className="text-gray-400">Presenter: </span>{webinar.presenter}</p>
                    <p><span className="text-gray-400">Date: </span>{new Date(webinar.webinarDate).toLocaleDateString()} at {new Date(webinar.webinarDate).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}</p>
                    <p><span className="text-gray-400">Description: </span>{webinar.description}</p>
                    {webinar.videoId && (
                        <iframe
                        className="h-60 rounded my-2"
                        src={`https://www.youtube.com/embed/${webinar.videoId}?rel=0`}
                        allowFullScreen
                        ></iframe>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditClick(webinar)}>
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(webinar._id)}>
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                    </div>
                    </div>
                )}
                </li>
            ))
            ) : (
            <p className="text-center text-gray-400 py-8">No webinars available.</p>
            )}
        </SpinnerOverlay>
        </ul>
    </>
  );
};

export default AdminWebinars;