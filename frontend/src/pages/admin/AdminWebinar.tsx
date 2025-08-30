import { useEffect, useState, useRef } from "react"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, PlusCircle, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Spinner from "@/components/ui/Spinner"
import SpinnerOverlay from "@/components/ui/SpinnerOverlay"

const AdminWebinars = () => {
  const { toast } = useToast()
  const [creatingWebinar, setCreatingWebinar] = useState(false)
  const [webinars, setWebinars] = useState([])
  const [editingWebinarId, setEditingWebinarId] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [newWebinarFormData, setNewWebinarFormData] = useState({
    title: "",
    presenter: "",
    description: "",
    webinarDate: "",
    status: "upcoming",
    videoLink: "",
    guests: [""],
    thumbnail: null,
  })
  const [editWebinarFormData, setEditWebinarFormData] = useState({ ...newWebinarFormData })
  const fileInputRef = useRef(null)

  // Handlers for CREATE form
  const handleNewChange = (e) => {
    const { name, value, files } = e.target
    if (name === "thumbnail") {
      setNewWebinarFormData({ ...newWebinarFormData, thumbnail: files[0] })
    } else if (name === "description") {
      setNewWebinarFormData({
        ...newWebinarFormData,
        description: value.slice(0, 180),
      })
    } else {
      setNewWebinarFormData({ ...newWebinarFormData, [name]: value })
    }
  }

  const handleGuestChange = (index, value) => {
    const updatedGuests = [...newWebinarFormData.guests]
    updatedGuests[index] = value
    setNewWebinarFormData({ ...newWebinarFormData, guests: updatedGuests })
  }

  const addGuestField = () => {
    setNewWebinarFormData({ ...newWebinarFormData, guests: [...newWebinarFormData.guests, ""] })
  }

  const removeGuestField = (index) => {
    const updatedGuests = [...newWebinarFormData.guests]
    updatedGuests.splice(index, 1)
    setNewWebinarFormData({ ...newWebinarFormData, guests: updatedGuests })
  }

  const isValidYouTubeLink = (url) => {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/
    return regex.test(url)
  }

  const fetchWebinars = async () => {
    try {
      const res = await api.get("/webinars")
      setWebinars(res.data)
    } catch (err) {
      console.error("Fetch error:", err.message)
    }
  }

  const handleCreate = async () => {
    if (!isValidYouTubeLink(newWebinarFormData.videoLink)) {
      toast({
        title: "Invalid YouTube link",
        description: "Please provide a valid YouTube video link",
        variant: "destructive",
      })
      return
    }

    try {
      setCreatingWebinar(true)
      const formData = new FormData()
      for (const key in newWebinarFormData) {
        if (key === "guests") {
          newWebinarFormData.guests.forEach((guest) => formData.append("guests", guest))
        } else {
          formData.append(key, newWebinarFormData[key])
        }
      }

      await api.post("/webinars/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast({ title: "Webinar created successfully" })
      setNewWebinarFormData({
        title: "",
        presenter: "",
        description: "",
        webinarDate: "",
        status: "upcoming",
        videoLink: "",
        guests: [""],
        thumbnail: null,
      })
      if (fileInputRef.current) fileInputRef.current.value = null
      fetchWebinars()
    } catch (err) {
      toast({ title: "Error creating webinar", variant: "destructive" })
    } finally {
      setCreatingWebinar(false)
    }
  }

  // Handlers for EDIT form
  const handleEditClick = (webinar) => {
    setEditingWebinarId(webinar._id)
    setEditWebinarFormData({
      title: webinar.title || "",
      presenter: webinar.presenter || "",
      description: webinar.description || "",
      webinarDate: webinar.webinarDate || "",
      status: webinar.status || "upcoming",
      videoLink: webinar.videoLink || "", // keep old link
      guests: webinar.guests?.length ? webinar.guests : [""],
      thumbnail: null, // only set if new file chosen
    })
  }

  const handleEditChange = (e) => {
    const { name, value, files } = e.target
    if (name === "thumbnail") {
      setEditWebinarFormData({ ...editWebinarFormData, thumbnail: files[0] })
    } else if (name === "description") {
      setEditWebinarFormData({
        ...editWebinarFormData,
        description: value.slice(0, 180),
      })
    } else {
      setEditWebinarFormData({ ...editWebinarFormData, [name]: value })
    }
  }

  const handleEditGuestChange = (index, value) => {
    const updatedGuests = [...editWebinarFormData.guests]
    updatedGuests[index] = value
    setEditWebinarFormData({ ...editWebinarFormData, guests: updatedGuests })
  }

  const addEditGuestField = () => {
    setEditWebinarFormData({ ...editWebinarFormData, guests: [...editWebinarFormData.guests, ""] })
  }

  const removeEditGuestField = (index) => {
    const updatedGuests = [...editWebinarFormData.guests]
    updatedGuests.splice(index, 1)
    setEditWebinarFormData({ ...editWebinarFormData, guests: updatedGuests })
  }

  const handleUpdate = async () => {
    try {
      const formData = new FormData()
      Object.keys(editWebinarFormData).forEach((key) => {
        if (key === "guests") {
          editWebinarFormData.guests.forEach((guest) => {
            if (guest.trim()) formData.append("guests", guest)
          })
        } else if (key === "thumbnail") {
          if (editWebinarFormData.thumbnail) {
            formData.append("thumbnail", editWebinarFormData.thumbnail)
          }
        } else if (editWebinarFormData[key] !== undefined && editWebinarFormData[key] !== null) {
          formData.append(key, editWebinarFormData[key])
        }
      })
  
      await api.put(`/webinars/${editingWebinarId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
  
      toast({ title: "Webinar updated successfully" })
      setEditingWebinarId(null)
      fetchWebinars()
    } catch (err) {
      toast({ title: "Error updating webinar", variant: "destructive" })
    }
  }

  const handleDelete = async (id) => {
    setIsProcessing(true)
    try {
      await api.delete(`/webinars/${id}`)
      toast({ title: "Deleted successfully" })
      fetchWebinars()
    } catch (err) {
      toast({ title: "Error deleting webinar", variant: "destructive" })
    }
    setIsProcessing(false)
  }

  useEffect(() => {
    fetchWebinars()
  }, [])

  return (
    <>
      {/* Create Webinar Form */}
      <Card className="bg-space-purple/10 border-space-purple/30">
        <CardHeader>
          <CardTitle>Create New Webinar</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCreate()
            }}
          >
            <label className="text-sm text-gray-400">Title *</label>
            <input
              name="title"
              type="text"
              value={newWebinarFormData.title}
              onChange={handleNewChange}
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
              required
            />

            <label className="text-sm text-gray-400">Presenter *</label>
            <input
              name="presenter"
              type="text"
              value={newWebinarFormData.presenter}
              onChange={handleNewChange}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
              required
            />

            <label className="text-sm text-gray-400">Description *</label>
            <textarea
              name="description"
              value={newWebinarFormData.description}
              onChange={handleNewChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
            <p className="text-xs mt-0 mb-4 text-gray-400">
              {newWebinarFormData.description.length}/180
            </p>

            <label className="text-sm text-gray-400">Webinar Date *</label>
            <input
              name="webinarDate"
              type="datetime-local"
              value={newWebinarFormData.webinarDate}
              onChange={handleNewChange}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
              required
            />

            <label className="text-sm text-gray-400">Status *</label>
            <select
              name="status"
              value={newWebinarFormData.status}
              onChange={handleNewChange}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
              required
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            <label className="text-sm text-gray-400">Guests</label>
            {newWebinarFormData.guests.map((guest, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={guest}
                  onChange={(e) => handleGuestChange(index, e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  placeholder={`Guest ${index + 1}`}
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGuestField(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addGuestField}
              className="mb-3"
            >
              <PlusCircle className="w-4 h-4 mr-1" /> Add Guest
            </Button>

            <label className="text-sm text-gray-400">YouTube Link *</label>
            <input
              name="videoLink"
              type="text"
              value={newWebinarFormData.videoLink}
              onChange={handleNewChange}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
              required
            />

            <label className="text-sm text-gray-400">Thumbnail *</label>
            <input
              ref={fileInputRef}
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleNewChange}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
              required
            />

            <Button type="submit" className="w-full" disabled={creatingWebinar}>
              {creatingWebinar ? <Spinner /> : "Create Webinar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Webinar List */}
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
                      value={editWebinarFormData.title}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                      required
                    />
                    <input
                      name="presenter"
                      type="text"
                      value={editWebinarFormData.presenter}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                      required
                    />
                    <textarea
                      name="description"
                      value={editWebinarFormData.description}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                      required
                    />
                    <p className="text-xs text-gray-400">
                      {180 - editWebinarFormData.description.length}/180
                    </p>
                    <input
                      name="webinarDate"
                      type="datetime-local"
                      value={
                        editWebinarFormData.webinarDate
                          ? new Date(editWebinarFormData.webinarDate).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                      required
                    />
                    <select
                      name="status"
                      value={editWebinarFormData.status}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                    <label className="text-sm text-gray-400">Guests</label>
                    {editWebinarFormData.guests.map((guest, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={guest}
                          onChange={(e) => handleEditGuestChange(index, e.target.value)}
                          className="w-full p-2 rounded bg-gray-800 text-white"
                          placeholder={`Guest ${index + 1}`}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEditGuestField(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addEditGuestField}
                    >
                      <PlusCircle className="w-4 h-4 mr-1" /> Add Guest
                    </Button>
                    
                    <div>
                    <label className="text-sm text-gray-400">YouTube Video Link (add new to replace)</label>
                    <input
                      name="videoLink"
                      type="text"
                      value={editWebinarFormData.videoLink}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                    </div>

                    <label className="text-sm text-gray-400">Thumbnail (add new to replace)</label>
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={handleUpdate}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingWebinarId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold">{webinar.title}</p>
                    <p>Presenter: {webinar.presenter}</p>
                    <p>
                      Date:{" "}
                      {new Date(webinar.webinarDate).toLocaleDateString()} at{" "}
                      {new Date(webinar.webinarDate).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p>{webinar.description}</p>
                    {webinar.videoId && (
                      <iframe
                        className="h-60 rounded my-2"
                        src={`https://www.youtube.com/embed/${webinar.videoId}?rel=0`}
                        allowFullScreen
                      ></iframe>
                    )}
                    {webinar.guests?.length > 0 && (
                      <p>
                        Guests:{" "}
                        {webinar.guests.filter((g) => g.trim() !== "").join(", ")}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(webinar)}
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(webinar._id)}
                      >
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
  )
}

export default AdminWebinars