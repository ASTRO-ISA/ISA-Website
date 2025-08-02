import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { refetchUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/users/login",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      toast({
        title: "Login successful!",
        description: "Welcome back!",
      });

      await refetchUser();
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Login failed",
        description: "Invalid credentials",
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
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-space-accent hover:bg-space-accent/80 text-white font-semibold py-2 rounded-md transition-colors"
          >
            Sign In
          </button>

          {/* Forgot Password */}
          <p className=" mt-4 text-center text-sm text-space-accent mt-1">
            <Link to="/forgot-password" className="hover:underline">
              Forgot Password?
            </Link>
          </p>

          {/* Signup Redirect */}
          <p className="mt-4 text-sm text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-space-accent hover:underline hover:text-space-accent/80"
            >
              Create Account
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Login;
