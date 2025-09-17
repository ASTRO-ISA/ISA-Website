import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import SpinnerOverlay from "@/components/ui/SpinnerOverlay"
import EditWebinarForm from "./EditWebinarForm"

const WebinarList = ({
  webinars,
  editingWebinarId,
  editWebinarFormData,
  setEditWebinarFormData,
  handleEditClick,
  handleUpdate,
  handleDelete,
  cancelEdit,
  isProcessing,
}) => {
  return (
    <ul className="space-y-4 mt-4">
      <SpinnerOverlay show={isProcessing}>
        {Array.isArray(webinars) && webinars.length > 0 ? (
          webinars.map((webinar) => (
            <li
              key={webinar._id}
              className="p-4 border bg-space-purple/20 rounded"
            >
              {editingWebinarId === webinar._id ? (
                <EditWebinarForm
                  editWebinarFormData={editWebinarFormData}
                  setEditWebinarFormData={setEditWebinarFormData}
                  handleUpdate={handleUpdate}
                  cancelEdit={cancelEdit}
                />
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
                  {webinar.isFree ? (
                    <p className="text-green-400">Free Webinar</p>
                  ) : (
                    <p className="text-yellow-400">
                      Paid Webinar – Fee: ₹{webinar.fee}
                    </p>
                  )}
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
  )
}

export default WebinarList