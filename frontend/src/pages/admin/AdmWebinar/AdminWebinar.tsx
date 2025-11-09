import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import CreateWebinarForm from "./CreateWebinarForm"
import WebinarList from "./WebinarList"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Helmet } from "react-helmet-async"

const AdminWebinars = () => {
  const { toast } = useToast()
  const [creatingWebinar, setCreatingWebinar] = useState(false)
  const [webinars, setWebinars] = useState([])
  const [editingWebinarId, setEditingWebinarId] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showWebinarList, setShowWebinarList] = useState(false)

  const [newWebinarFormData, setNewWebinarFormData] = useState({
    title: "",
    presenter: "",
    description: "",
    webinarDate: "",
    status: "upcoming",
    videoLink: "",
    guests: [""],
    thumbnail: null,
    isFree: true,
    fee: "",
  })

  const [editWebinarFormData, setEditWebinarFormData] = useState({
    ...newWebinarFormData,
  })

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

  const handleCreate = async (fileInputRef) => {
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
          newWebinarFormData.guests.forEach((guest) =>
            formData.append("guests", guest)
          )
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
        isFree: true,
        fee: "",
      })
      if (fileInputRef.current) fileInputRef.current.value = null
      fetchWebinars()
      setShowCreateForm(false) // close after creation
    } catch (err) {
      toast({ title: "Error creating webinar", variant: "destructive" })
    } finally {
      setCreatingWebinar(false)
    }
  }

  const handleEditClick = (webinar) => {
    setEditingWebinarId(webinar._id)
    setEditWebinarFormData({
      title: webinar.title || "",
      presenter: webinar.presenter || "",
      description: webinar.description || "",
      webinarDate: webinar.webinarDate || "",
      status: webinar.status || "upcoming",
      videoLink: webinar.videoLink || "",
      guests: webinar.guests?.length ? webinar.guests : [""],
      thumbnail: null,
      isFree: webinar.isFree ?? true,
      fee: webinar.fee ?? "",
    })
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
        } else if (
          editWebinarFormData[key] !== undefined &&
          editWebinarFormData[key] !== null
        ) {
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
      <Helmet>
        <title>Admin: Webinars | ISA-India</title>
        <meta name="description" content="Admin page for managing webinars." />
      </Helmet>
      {/* Create New Webinar Section */}
      <Card className="mb-6 relative">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Create New Webinar</CardTitle>
          {showCreateForm && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCreateForm(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {showCreateForm ? (
            <CreateWebinarForm
              newWebinarFormData={newWebinarFormData}
              setNewWebinarFormData={setNewWebinarFormData}
              creatingWebinar={creatingWebinar}
              handleCreate={handleCreate}
            />
          ) : (
            <div className="flex justify-center">
              <Button onClick={() => setShowCreateForm(true)}>
                Create Webinar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webinar List Section */}
      <Card className="relative">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Webinar List</CardTitle>
          {showWebinarList && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowWebinarList(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {showWebinarList ? (
            <WebinarList
              webinars={webinars}
              editingWebinarId={editingWebinarId}
              editWebinarFormData={editWebinarFormData}
              setEditWebinarFormData={setEditWebinarFormData}
              handleEditClick={handleEditClick}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              cancelEdit={() => setEditingWebinarId(null)}
              isProcessing={isProcessing}
            />
          ) : (
            <div className="flex justify-center">
              <Button onClick={() => setShowWebinarList(true)}>
                Show List
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default AdminWebinars