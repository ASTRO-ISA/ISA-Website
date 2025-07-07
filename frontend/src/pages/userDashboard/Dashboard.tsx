import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import {
//   User,
//   BookOpen,
//   Award,
//   ShoppingBag,
//   Calendar,
//   Settings,
//   BarChart3,
//   Trophy,
//   Clock,
//   Download,
//   Eye,
//   Heart,
//   MessageCircle,
//   Star,
//   TrendingUp,
//   CheckCircle,
//   PlayCircle,
//   FileText,
//   CreditCard,
//   Bell,
//   Edit,
//   Camera,
//   LogOut,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import UserProfile from "./UserProfile";
import UserSettings from "./UserSettings";
import UserEvents from "./UserEvents";
import QuickActions from "./QuickActions";
import UserBlogs from "./UserBlogs";
import UserResearchPaper from "./UserResearchPaper";

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  thumbnail: string;
  category: string;
  enrolled: string;
  lastAccessed: string;
}

interface Certificate {
  id: string;
  title: string;
  issuedDate: string;
  instructor: string;
  credentialId: string;
  category: string;
}

interface Order {
  id: string;
  date: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: "completed" | "processing" | "shipped";
}

interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  totalStudyHours: number;
  averageProgress: number;
  streakDays: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("events");
  const [isEditing, setIsEditing] = useState(false);
  const { loginCheck, userInfo: user } = useAuth();

  // Mock data - in real app would come from API
  const [userStats] = useState<UserStats>({
    coursesEnrolled: 8,
    coursesCompleted: 5,
    certificatesEarned: 3,
    totalStudyHours: 127,
    averageProgress: 68,
    streakDays: 15,
  });

  const [enrolledCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Advanced Astrophysics: Black Holes and Neutron Stars",
      instructor: "Dr. Neil deGrasse Tyson",
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      duration: "12 weeks",
      thumbnail:
        "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400",
      category: "Astrophysics",
      enrolled: "2024-02-01",
      lastAccessed: "2024-06-08",
    },
    {
      id: "2",
      title: "Mars Exploration and Colonization",
      instructor: "Dr. Robert Zubrin",
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      duration: "8 weeks",
      thumbnail:
        "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400",
      category: "Space Exploration",
      enrolled: "2024-03-15",
      lastAccessed: "2024-06-07",
    },
  ]);

  const [certificates] = useState<Certificate[]>([
    {
      id: "1",
      title: "Planetary Science Specialization",
      issuedDate: "2024-03-15",
      instructor: "Dr. Alan Stern",
      credentialId: "ISA-PS-2024-001",
      category: "Planetary Science",
    },
    {
      id: "2",
      title: "Astrophotography Mastery",
      issuedDate: "2024-02-28",
      instructor: "Prof. Emily Chen",
      credentialId: "ISA-AP-2024-002",
      category: "Technology",
    },
  ]);

  const [orders] = useState<Order[]>([
    {
      id: "ORD-2024-001",
      date: "2024-06-05",
      items: [
        {
          name: "ISA Premium Membership - Annual",
          price: 199.99,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=100",
        },
      ],
      total: 199.99,
      status: "completed",
    },
  ]);

  // logout handler {manual}
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/v1/users/logout", {
        withCredentials: true,
      });
      toast({
        title: "Logout successful!",
        description: "See you again!",
      });
      loginCheck();
      navigate("/");
    } catch (err) {
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "processing":
        return "bg-yellow-500";
      case "shipped":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header Section */}
        <UserProfile />

        {/* Quick Actions */}
        {/* <QuickActions /> */}

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 mt-8"
        >
          <TabsList className="grid w-full grid-cols-4 bg-space-purple/20">
            <TabsTrigger value="events">Registered Events</TabsTrigger>
            <TabsTrigger value="blogs">My Blogs</TabsTrigger>
            <TabsTrigger value="research_papers">My Research Papers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <UserEvents />
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-6">
            <UserBlogs />
          </TabsContent>

          {/* Research Paper Tab */}
          <TabsContent value="research_papers" className="space-y-6">
            <UserResearchPaper />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <UserSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
