import { useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";
import { Helmet } from "react-helmet-async";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post(
        "/auth/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSubmitted(true);
      setSending(false);
      toast({
        title: "Email sent!",
        description: "Check your inbox for the reset link.",
      });
    } catch (error) {
      setSending(false);
      toast({
        title: "Failed to send reset link",
        description: error.response?.data?.message || "Try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white flex flex-col">
      <Helmet>
        <title>Forgot Password | ISA-India</title>
        <meta name="description" content="Forgot password page for ISA-India." />
      </Helmet>
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-16">
        <form
          onSubmit={handleSubmit}
          className="bg-space-purple/10 p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            Forgot Password
          </h2>

          {!submitted ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Enter your email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-space-accent hover:bg-space-accent/80 text-white font-semibold py-2 rounded-md transition-colors flex justify-center"
              >
                {sending ? <Spinner /> : "Send Reset Link"}
              </button>
            </>
          ) : (
            <p className="text-center text-green-400">
              A reset link has been sent to your email.
            </p>
          )}
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
