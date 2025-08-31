import api from "@/lib/api"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Spinner from "@/components/ui/Spinner"
import { useAuth } from "@/context/AuthContext"

const SuggestBlogTopic = () => {
  const { isLoggedIn } = useAuth()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [blogSuggest, setBlogSuggest] = useState({
    title: "",
    description: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setBlogSuggest((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitTopic = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      toast({
        title: "Hold on!",
        description: "Login to suggest your beautiful idea.",
        variant: "destructive",
      })
      return
    }

    if (blogSuggest.description.trim().length < 180) {
      toast({
        title: "Description too short!",
        description: "Please write at least 180 characters so we understand your idea better.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await api.post("/suggest-blog", blogSuggest)
      setBlogSuggest({ title: "", description: "" })
      toast({
        title: "We got it.",
        description: "You can track the status of your suggestion on dashboard.",
      })
      setShowForm(false)
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: error.response?.data,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {!showForm ? (
        <button
          className="bg-space-accent hover:bg-space-accent/80 text-white px-6 py-2 rounded transition-colors"
          onClick={() => setShowForm(true)}
        >
          Suggest a Blog Topic
        </button>
      ) : (
        <section className="cosmic-card p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Suggest a Blog Topic</h2>
              <p className="text-gray-300 mb-6">
                Got a Speaker or Topic in Mind? We'd Love to Hear from You!
              </p>

              <form className="space-y-4" onSubmit={handleSubmitTopic}>
                <input
                  type="text"
                  name="title"
                  value={blogSuggest.title}
                  onChange={handleChange}
                  placeholder="Suggested Speaker or Topic"
                  className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                />
                <div>
                  <label htmlFor="description" className="text-gray-400 text-xs">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={blogSuggest.description}
                    onChange={handleChange}
                    placeholder="Why this would be valuable (description)"
                    rows={3}
                    className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                  ></textarea>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-400">
                      *You can only post a suggestion per week.
                    </span>
                    <span
                      className={`${
                        blogSuggest.description.length < 180
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {blogSuggest.description.length}/180
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-space-accent hover:bg-space-accent/80 text-white px-6 py-2 rounded transition-colors"
                  >
                    {submitting ? <Spinner /> : "Submit Suggestion"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border border-gray-500 text-gray-300 px-6 py-2 rounded transition-colors hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            <div className="hidden sm:block md:w-1/4">
              <img
                loading="lazy"
                src="images/questionmark.png"
                alt="Space Speaker"
                className="rounded-lg h-auto w-full"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default SuggestBlogTopic