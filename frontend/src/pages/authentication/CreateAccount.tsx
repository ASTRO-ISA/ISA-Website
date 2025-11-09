import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";
import { Helmet } from "react-helmet-async";

const Signup = ({ url = "/auth/signup" }) => {
  const { refetchUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSigningIn(true);

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      setSigningIn(false);
      return;
    }

    try {
      const response = await api.post(url, form, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setSigningIn(false);
      await refetchUser();
      toast({
        description: "Account created successfully."
      })
      navigate("/");
    } catch (err) {
      // console.error("Something went wrong", err);
      toast({
        title: "Something went wrong",
        description: err.response.data.message,
        variant: "destructive",
      });
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <Helmet>
        <title>Create Account | ISA-India</title>
        <meta name="description" content="Create an account with ISA-India." />
      </Helmet>
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-xl">
        <div className="bg-space-purple/10 p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-6">
            Create Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNo"
                value={form.phoneNo}
                onChange={handleChange}
                placeholder="Number"
                required
                className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm text-gray-300 mb-1">
                Set Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 pr-10 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-300 hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
              />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-space-accent hover:bg-space-accent/80 text-white px-6 py-2 rounded transition-colors"
              >
                {signingIn ? <Spinner /> : "Sign Up"}
              </button>
            </div>

            {/* Switch to Sign In */}
            {url === "/users/signup" && (
              <div className="text-center text-sm text-gray-400 mt-4">
                Already have an account?{" "}
                <a href="/login" className="text-space-accent hover:underline">
                  Sign In
                </a>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Signup;