import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const { token } = useParams();
  console.log(token);

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both fields are the same",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/users/resetPassword`,
        {
          token, // JWT token from URL
          newPassword: form.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast({
        title: "Password Reset Successful!",
        description: "You can now log in with your new password.",
      });

      navigate("/login");
    } catch (err) {
      console.error("Reset error:", err);
      toast({
        title: "Reset Failed",
        description: "The reset link may be invalid or expired",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-16">
        <form
          onSubmit={handleSubmit}
          className="bg-space-purple/10 p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            Reset Password
          </h2>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-space-accent hover:bg-space-accent/80 text-white font-semibold py-2 rounded-md transition-colors"
          >
            Reset
          </button>

          <p className="mt-4 text-sm text-center text-gray-400">
            Back to{" "}
            <Link
              to="/login"
              className="text-space-accent hover:underline hover:text-space-accent/80"
            >
              Login
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default ResetPassword;
