import { useState } from "react";
import { Edit, Settings, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import PasswordChange from "./PasswordChange";
import axios from "axios";

const UserSettings = () => {
  const { userInfo } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userInfo.user.name);
  const [location, setLocation] = useState(userInfo.user.country);
  const [avatar, setAvatar] = useState(userInfo.user.avatar); // Image URL or base64
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleSaveProfile = async () => {
    try {
      // Simulate API call
      const formData = new FormData();
      formData.append("name", name);
      formData.append("country", location);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await axios.patch(
        `http://localhost:3000/api/v1/users/updateUser/${userInfo.user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating profile",
        description: "Something went wrong. Please try again.",
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
              <AvatarImage src={userInfo.user.avatar} />
              <AvatarFallback>{name?.[0]}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <div>
                <Label
                  htmlFor="avatar"
                  className="flex items-center gap-2 cursor-pointer text-sm text-blue-500"
                >
                  <Camera className="w-4 h-4" />
                  Change Photo
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
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-space-purple/10 border-space-purple/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.user.email}
                  disabled
                  className="bg-space-purple/10 border-space-purple/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-space-purple/10 border-space-purple/30"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
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
                <div>
                  <Label className="text-gray-400">Email</Label>
                  <p className="font-medium">{userInfo.user.email}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Location</Label>
                  <p className="font-medium">{location}</p>
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
      <Card className="bg-space-purple/10 border-space-purple/30">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PasswordChange />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
