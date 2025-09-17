import { Button } from "@/components/ui/button"
import { PlusCircle, X } from "lucide-react"

const EditWebinarForm = ({
  editWebinarFormData,
  setEditWebinarFormData,
  handleUpdate,
  cancelEdit,
}) => {
  const handleEditChange = (e) => {
    const { name, value, files, type } = e.target
    if (name === "thumbnail") {
      setEditWebinarFormData({ ...editWebinarFormData, thumbnail: files[0] })
    } else if (name === "description") {
      setEditWebinarFormData({
        ...editWebinarFormData,
        description: value.slice(0, 180),
      })
    } else if (name === "isFree") {
      const isFree = value === "true"
      setEditWebinarFormData({
        ...editWebinarFormData,
        isFree,
        fee: isFree ? "" : editWebinarFormData.fee,
      })
    } else if (type === "number") {
      setEditWebinarFormData({ ...editWebinarFormData, [name]: Number(value) })
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
    setEditWebinarFormData({
      ...editWebinarFormData,
      guests: [...editWebinarFormData.guests, ""],
    })
  }

  const removeEditGuestField = (index) => {
    const updatedGuests = [...editWebinarFormData.guests]
    updatedGuests.splice(index, 1)
    setEditWebinarFormData({ ...editWebinarFormData, guests: updatedGuests })
  }

  return (
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

      {/* Free / Paid Selector for Edit */}
      <label className="text-sm text-gray-400">Type *</label>
      <select
        name="isFree"
        value={editWebinarFormData.isFree ? "true" : "false"}
        onChange={handleEditChange}
        className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
        required
      >
        <option value="true">Free</option>
        <option value="false">Paid</option>
      </select>

      {!editWebinarFormData.isFree && (
        <div>
          <label className="text-sm text-gray-400">Fee Amount *</label>
          <input
            name="fee"
            type="number"
            value={editWebinarFormData.fee}
            onChange={handleEditChange}
            className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
            min="1"
            required
          />
        </div>
      )}

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
      <Button type="button" variant="outline" size="sm" onClick={addEditGuestField}>
        <PlusCircle className="w-4 h-4 mr-1" /> Add Guest
      </Button>

      <div>
        <label className="text-sm text-gray-400">
          YouTube Video Link (add new to replace)
        </label>
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
        <Button size="sm" variant="outline" onClick={cancelEdit}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default EditWebinarForm