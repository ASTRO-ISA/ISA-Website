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
// import { useAuth } from '@/context/FirebaseAuthContext';
// import { signOut, User as FirebaseUser } from 'firebase/auth';
// import { auth } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

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
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const { loginCheck, user } = useAuth();

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
  // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (!loading && !authUser) {
  //     navigate('/login');
  //   }
  // }, [authUser, loading, navigate]);

  // Firebase logout handler
  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     toast({
  //       title: "Logged out successfully",
  //       description: "See you again!",
  //     });
  //     navigate('/');
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //     toast({
  //       title: "Logout failed",
  //       description: "Please try again",
  //       variant: "destructive",
  //     });
  //   }
  // };

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

  // Show loading state
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-space-dark text-white flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-space-accent mx-auto mb-4"></div>
  //         <p>Loading your dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }
  // Show login redirect message if not authenticated
  // if (!authUser) {
  //   return (
  //     <div className="min-h-screen bg-space-dark text-white flex items-center justify-center">
  //       <div className="text-center">
  //         <p>Redirecting to login...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // User data from Firebase (real data)
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
        <div className="mb-8">
          <Card className="bg-space-purple/10 border-space-purple/30">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userInfo.avatar} alt={userInfo.name} />{" "}
                    {/* use this after defining user info */}
                    <AvatarFallback className="text-2xl bg-space-purple">
                      {userInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-space-accent"
                    onClick={() => setIsEditing(true)}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {user ? user.user.name : userInfo.name}
                      </h1>
                      <p className="text-gray-400 mb-2">
                        {user ? user.user.email : userInfo.email}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>📍 {userInfo.location}</span>
                        <span>🗓️ Joined: 19 June 2025</span>
                        {/* <span>🗓️ Joined {formatDate(user.joinDate)}</span> */}
                        <Badge className="bg-space-accent text-white">
                          {userInfo.membershipType}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 lg:mt-0">
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="border-space-purple/50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{userInfo.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {userInfo.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-space-purple/50"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-space-purple/10 border-space-purple/30">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-space-accent" />
              <div className="text-2xl font-bold">
                {userStats.coursesEnrolled}
              </div>
              <div className="text-xs text-gray-400">Courses Enrolled</div>
            </CardContent>
          </Card>

          <Card className="bg-space-purple/10 border-space-purple/30">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">
                {userStats.coursesCompleted}
              </div>
              <div className="text-xs text-gray-400">Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-space-purple/10 border-space-purple/30">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold">
                {userStats.certificatesEarned}
              </div>
              <div className="text-xs text-gray-400">Certificates</div>
            </CardContent>
          </Card>

          <Card className="bg-space-purple/10 border-space-purple/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">
                {userStats.totalStudyHours}
              </div>
              <div className="text-xs text-gray-400">Study Hours</div>
            </CardContent>
          </Card>

          <Card className="bg-space-purple/10 border-space-purple/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold">
                {userStats.averageProgress}%
              </div>
              <div className="text-xs text-gray-400">Avg Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-space-purple/10 border-space-purple/30">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold">{userStats.streakDays}</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4 bg-space-purple/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-space-purple/10 border-space-purple/30">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-space-purple/20 rounded-lg">
                      <PlayCircle className="w-5 h-5 text-green-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Completed Lesson 18
                        </p>
                        <p className="text-xs text-gray-400">
                          Advanced Astrophysics Course
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-space-purple/20 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Earned Certificate
                        </p>
                        <p className="text-xs text-gray-400">
                          Planetary Science Specialization
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-space-purple/10 border-space-purple/30">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      className="h-20 flex-col gap-2 bg-space-accent/20 hover:bg-space-accent/30"
                      onClick={() => navigate("/training")}
                    >
                      <BookOpen className="w-6 h-6" />
                      Browse Courses
                    </Button>
                    <Button
                      className="h-20 flex-col gap-2 bg-space-accent/20 hover:bg-space-accent/30"
                      onClick={() => navigate("/events")}
                    >
                      <Calendar className="w-6 h-6" />
                      View Events
                    </Button>
                    <Button
                      className="h-20 flex-col gap-2 bg-space-accent/20 hover:bg-space-accent/30"
                      onClick={() => navigate("/community")}
                    >
                      <MessageCircle className="w-6 h-6" />
                      Join Community
                    </Button>
                    <Button
                      className="h-20 flex-col gap-2 bg-space-accent/20 hover:bg-space-accent/30"
                      onClick={() => navigate("/shop")}
                    >
                      <ShoppingBag className="w-6 h-6" />
                      Visit Shop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card className="bg-space-purple/10 border-space-purple/30">
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="bg-space-purple/20 border-space-purple/40"
                    >
                      <CardContent className="p-6">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold mb-2">{course.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          By {course.instructor}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>
                              {course.completedLessons}/{course.totalLessons}{" "}
                              lessons
                            </span>
                            <span>
                              Last accessed: {formatDate(course.lastAccessed)}
                            </span>
                          </div>
                        </div>

                        <Button className="w-full bg-space-accent hover:bg-space-accent/80">
                          Continue Learning
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <Card className="bg-space-purple/10 border-space-purple/30">
              <CardHeader>
                <CardTitle>My Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert) => (
                    <Card
                      key={cert.id}
                      className="bg-gradient-to-br from-space-purple/30 to-space-accent/20 border-space-accent/30"
                    >
                      <CardContent className="p-6 text-center">
                        <Award className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                        <h3 className="font-bold mb-2">{cert.title}</h3>
                        <p className="text-sm text-gray-400 mb-1">
                          Issued by {cert.instructor}
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          {formatDate(cert.issuedDate)}
                        </p>
                        <Badge variant="outline" className="mb-4">
                          {cert.category}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
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
                        <Button onClick={handleSaveProfile}>
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
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
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Data
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
