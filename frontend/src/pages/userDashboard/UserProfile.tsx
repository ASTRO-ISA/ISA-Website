import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";

const UserProfile = () => {
  const navigate = useNavigate();
  const { refetchUser, userInfo } = useAuth();

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      toast({
        title: "Logout successful!",
        description: "See you again!",
      });
      refetchUser();
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const formatDate = (isoDateStr: string): string => {
    const date = new Date(isoDateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!userInfo) return <Spinner />;

  return (
    <div className="mb-8">
      <Card className="bg-space-purple/10 border-space-purple/30">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={userInfo.user.avatar}
                  alt={userInfo.user.name}
                  className="object-cover"
                />{" "}
                <AvatarFallback className="text-2xl bg-space-purple">
                  {userInfo.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {/* <Button
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-space-accent"
                onClick={() => setIsEditing(true)}
              >
                <Camera className="w-4 h-4" />
              </Button> */}
            </div>

            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {userInfo.user.name}
                  </h1>
                  <p className="text-gray-400 mb-2">{userInfo.user.email}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Country: {userInfo.user.country}</span>
                    <span>Joined: {formatDate(userInfo.user.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-6 mt-4 lg:mt-0">
                  <button
                    onClick={handleLogout}
                    className="flex justify-center items-center border border-red-700 py-2 pl-4 pr-4 text-red-800 hover:bg-red-500/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <p>Logout</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
