import { useEffect, useState } from "react";
import StarBackground from "@/components/StarBackground";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { loginCheck, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loginCheck();
  }, []);

  console.log(user);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading user data or not logged in.</p>
      </div>
    );
  }

  // logout handler
  const logout = async () => {
    try {
      await axios.get("http://localhost:3000/api/v1/users/logout", {
        withCredentials: true,
      });
      // alert('Logged out');
      toast({
        title: "Logout successful!",
        description: "See you again!",
      });
      loginCheck();
      navigate("/");
    } catch (err) {
      // alert('Could not logout');
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  //
  return (
    <>
      {/* <Navbar /> */}
      <StarBackground />
      <div className="min-h-screen  text-white flex flex-col items-center justify-center">
        <img
          src="/public/placeholder.svg"
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto border-2 border-white mb-4"
        />
        <h2 className="text-2xl font-semibold text-white">{user?.user.name}</h2>
        <p className="text-space-light mt-1">{user?.user.email}</p>
        <button
          onClick={logout}
          className="px-4 py-2 border border-gray-700 text-white rounded-md hover:bg-gray-700 hover:text-white transition"
        >
          Logout
        </button>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Profile;
