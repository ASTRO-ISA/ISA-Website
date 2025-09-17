import { useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, X } from "lucide-react"
import Spinner from "@/components/ui/Spinner"

const CreateWebinarForm = ({
  newWebinarFormData,
  setNewWebinarFormData,
  creatingWebinar,
  handleCreate,
}) => {
  const fileInputRef = useRef(null)

  const handleNewChange = (e) => {
    const { name, value, files, type } = e.target
    if (name === "thumbnail") {
      setNewWebinarFormData({ ...newWebinarFormData, thumbnail: files[0] })
    } else if (name === "description") {
      setNewWebinarFormData({
        ...newWebinarFormData,
        description: value.slice(0, 180),
      })
    } else if (name === "isFree") {
      const isFree = value === "true"
      setNewWebinarFormData({
        ...newWebinarFormData,
        isFree,
        fee: isFree ? "" : "", // reset when switching
      })
    } else if (type === "number") {
      setNewWebinarFormData({ ...newWebinarFormData, [name]: Number(value) })
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
    setNewWebinarFormData({
      ...newWebinarFormData,
      guests: [...newWebinarFormData.guests, ""],
    })
  }

  const removeGuestField = (index) => {
    const updatedGuests = [...newWebinarFormData.guests]
    updatedGuests.splice(index, 1)
    setNewWebinarFormData({ ...newWebinarFormData, guests: updatedGuests })
  }

  return (
    <Card className="bg-space-purple/10 border-space-purple/30">
      <CardHeader>
        <CardTitle>Create New Webinar</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleCreate(fileInputRef)
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

          {/* Free / Paid Selector */}
          <label className="text-sm text-gray-400">Type *</label>
          <select
            name="isFree"
            value={newWebinarFormData.isFree ? "true" : "false"}
            onChange={handleNewChange}
            className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
            required
          >
            <option value="true">Free</option>
            <option value="false">Paid</option>
          </select>

          {!newWebinarFormData.isFree && (
            <div>
              <label className="text-sm text-gray-400">Fee Amount *</label>
              <input
                name="fee"
                type="number"
                value={newWebinarFormData.fee}
                onChange={handleNewChange}
                className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
                min="1"
                required
              />
            </div>
          )}

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
  )
}

export default CreateWebinarForm