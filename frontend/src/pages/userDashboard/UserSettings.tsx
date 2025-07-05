import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  BookOpen,
  Award,
  ShoppingBag,
  Calendar,
  Settings,
  BarChart3,
  Trophy,
  Clock,
  Download,
  Eye,
  Heart,
  MessageCircle,
  Star,
  TrendingUp,
  CheckCircle,
  PlayCircle,
  FileText,
  CreditCard,
  Bell,
  Edit,
  Camera,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import UserProfile from "./UserProfile";

const userInfo = {
  // temporory
  name: "dshflh",
  email: "someone@email.com",
  avatar: "/images/placeholder.svg",
  bio: "Welcome to the ISA community! Start your space exploration journey.",
  location: "Bhopal",
  joinDate: "17 08 2025",
  membershipType: "Standard",
  interests: ["Astrophysics", "Space Exploration", "Astronomy", "Science"],
};

const UserSettings = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-space-purple/10 border-space-purple/30">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={userInfo.name}
                    className="bg-space-purple/10 border-space-purple/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userInfo.email}
                    className="bg-space-purple/10 border-space-purple/30"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    defaultValue={userInfo.location}
                    className="bg-space-purple/10 border-space-purple/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue={userInfo.bio}
                    className="bg-space-purple/10 border-space-purple/30"
                    rows={3}
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
                    <p className="font-medium">{userInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Email</Label>
                    <p className="font-medium">{userInfo.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Location</Label>
                    <p className="font-medium">{userInfo.location}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Bio</Label>
                    <p className="font-medium">{userInfo.bio}</p>
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
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserSettings;
