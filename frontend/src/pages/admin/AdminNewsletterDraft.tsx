import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

const AdminNewsletterDraft = () => {
  const { toast } = useToast();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchDraft = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/newsletter/draft", { withCredentials: true });
      console.log(res.data)
      setDraft({
        blogs: res.data.blogs || [],
        events: res.data.events || [],
      });
    } catch (err) {
      toast({ title: "Error fetching draft", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    try {
      setSending(true);
      await axios.post("http://localhost:3000/api/v1/newsletter/draft/send", {}, { withCredentials: true });
      toast({ title: "Newsletter sent!" });
      setDraft(null);
    } catch (err) {
      toast({ title: "Failed to send newsletter", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleRemove = async (type, id) => {
    try {
      await axios.post("http://localhost:3000/api/v1/newsletter/draft/remove", { type, id }, { withCredentials: true });
      toast({ title: `${type} removed from draft` });
      fetchDraft();
    } catch (err) {
      toast({ title: "Error removing item", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchDraft();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  if (!draft || (!draft.blogs.length && !draft.events.length)) {
    return <p className="text-center text-gray-400 py-8">No items in draft.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Newsletter Draft</h1>
      <SpinnerOverlay show={sending}>
        <div className="space-y-4">
          {draft.blogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Blogs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {draft.blogs.map((blog) => (
                    <li key={blog._id} className="flex justify-between items-start bg-gray-800 p-3 rounded">
                      <div>
                        <p className="font-semibold">{blog.title}</p>
                        <p className="text-sm text-gray-400">{blog.summary}</p>
                      </div>
                      <Button variant="ghost" onClick={() => handleRemove("blog", blog._id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {draft.events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {draft.events?.map((event) => (
                    <li key={event._id} className="flex justify-between items-start bg-gray-800 p-3 rounded">
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-gray-400">{event.description}</p>
                      </div>
                      <Button variant="ghost" onClick={() => handleRemove("event", event._id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button
            className="w-full"
            onClick={handleSendNewsletter}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Newsletter"}
          </Button>
        </div>
      </SpinnerOverlay>
    </div>
  );
};

export default AdminNewsletterDraft;