import { useState } from "react";
import { Edit, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import PasswordChange from "./PasswordChange";
import api from "@/lib/api";
import Spinner from "@/components/ui/Spinner";

const UserSettings = () => {
  const { userInfo, refetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userInfo?.user.name || "");
  const [avatar, setAvatar] = useState(userInfo?.user.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const isAdmin = userInfo.user.role === "admin";

  const handleSaveProfile = async () => {
    const isNameChanged = !isAdmin && name !== userInfo.user.name;
    const isAvatarChanged = Boolean(avatarFile);

    if (!isNameChanged && !isAvatarChanged) {
      toast({
        title: "No changes detected",
        description: "Make some changes before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      const formData = new FormData();

      if (!isAdmin) {
        formData.append("name", name);
      }

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await api.patch(`/users/updateUser/${userInfo.user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await refetchUser();

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });

      setIsUpdating(false);
      setIsEditing(false);
    } catch (error) {
      setIsUpdating(false);
      setName(userInfo.user.name);
      setAvatarFile(null);
    
      const errorMessage = error?.response?.data || "Something went wrong.";
      toast({
        title: "Error updating profile",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profile Settings */}
      <Card className="bg-space-purple/10 border-space-purple/30">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
          <AvatarImage src={userInfo.user.avatar} className="object-cover" />
          <AvatarFallback>{name?.[0]}</AvatarFallback>
          </Avatar>
            {isEditing && (
              <div>
                <Label
                  htmlFor="avatar"
                  className="flex items-center gap-2 cursor-pointer text-sm text-blue-500"
                >
                  <Camera className="w-4 h-4" />
                  Change
                </Label>
                <Input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {isEditing ? (
            <>
              {/* Name field (disabled for admins) */}
              <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-gray-400">
                Full Name
                {isAdmin && (
                  <p className="text-gray-500 text-sm">
                    *Admin is not allowed to change name.
                  </p>
                )}
              </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isAdmin}
                  className="bg-space-purple/10 border-space-purple/30"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveProfile}>
                  {isUpdating ? <Spinner /> : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-400">Full Name</Label>
                  <p className="font-medium">{name}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Account Settings */}
      {userInfo.user.role !== "admin" && (
        <Card className="bg-space-purple/10 border-space-purple/30">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PasswordChange />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSettings;