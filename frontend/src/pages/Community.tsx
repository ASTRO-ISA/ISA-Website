
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Instagram, Users, Award, BookOpen, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// import StarBackground from "@/components/StarBackground";

const Community = () => {
  const discussionTopics = [
    {
      title: "Latest JWST Images Discussion",
      replies: 32,
      lastUpdated: "2 hours ago",
      tags: ["JWST", "Astronomy"]
    },
    {
      title: "DIY Telescope Building Guide",
      replies: 47,
      lastUpdated: "1 day ago",
      tags: ["DIY", "Equipment"]
    },
    {
      title: "Astrophotography Tips for Beginners",
      replies: 85,
      lastUpdated: "3 days ago",
      tags: ["Photography", "Beginner"]
    },
    {
      title: "Space News Roundup - December 2023",
      replies: 23,
      lastUpdated: "12 hours ago",
      tags: ["News", "Current Events"]
    },
    {
      title: "Career Opportunities in Rocket Engineering",
      replies: 56,
      lastUpdated: "4 days ago",
      tags: ["Careers", "Engineering"]
    }
  ];

  const communityProjects = [
    {
      title: "Community Satellite Project",
      description: "A collaborative effort to design and build a CubeSat with members from across India.",
      participants: 28,
      progress: 65,
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=80&w=500"
    },
    {
      title: "Light Pollution Mapping Initiative",
      description: "Mapping light pollution across cities to identify best locations for astronomical observations.",
      participants: 42,
      progress: 80,
      image: "https://images.unsplash.com/photo-1567789734270-a17018302d7f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "High-Altitude Balloon Launch",
      description: "Building and launching a high-altitude balloon with cameras and sensors to capture near-space images.",
      participants: 15,
      progress: 40,
      image: "https://images.unsplash.com/photo-1468186402854-9a641fd7a7c4?q=80&w=500"
    }
  ];

  const members = [
    {
      name: "Priya Sharma",
      role: "Project Lead",
      contributions: 78,
      image: "images/placeholder.svg"
    },
    {
      name: "Arjun Patel",
      role: "Astrophotography Expert",
      contributions: 92,
      image: "images/placeholder.svg"
    },
    {
      name: "Neha Kapoor",
      role: "Telescope Specialist",
      contributions: 65,
      image: "images/placeholder.svg"
    },
    {
      name: "Rahul Mehra",
      role: "Rocket Engineer",
      contributions: 87,
      image: "images/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <StarBackground /> */}
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Community Hub</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with fellow space enthusiasts, participate in discussions, and collaborate on exciting projects.
          </p>
        </div>
        
        {/* Social Links */}
        <section className="mb-16">
          <div className="cosmic-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">Join Our Online Community</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with ISA Club members through our social platforms for daily updates, discussions, and astronomy content.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://www.instagram.com/isa.astrospace?igsh=cGgyeDB3M2d4dDJ5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity px-6 py-3 rounded-lg"
              >
                <Instagram size={24} />
                <span className="font-medium">Follow on Instagram</span>
              </a>
              
              <a 
                href="https://chat.whatsapp.com/L3cBfJnQuO3BAbTnr4FbUE?fbclid=PAZXh0bgNhZW0CMTEAAabtBxDh4K2fihtHj_B3jxL87pA6nBaZurvhwesU32G5CftYqkhHFxdlicg_aem_v3_CsBh8Vl8Pxnf3HD8Ltg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-600 hover:bg-green-700 transition-colors px-6 py-3 rounded-lg"
              >
                <MessageCircle size={24} />
                <span className="font-medium">Join WhatsApp Group</span>
              </a>
            </div>
            
            <div className="mt-8">
              <img 
                src="/images/6e2f90e0-d9db-42ef-9c2d-def808dc9cef.png"
                alt="Community QR Code" 
                className="h-32 w-auto mx-auto"
              />
              <p className="text-sm text-gray-400 mt-2">Scan to join our WhatsApp group</p>
            </div>
          </div>
        </section>
        
        {/* Discussion Forum */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Discussion Forum</h2>
            <Button className="bg-space-accent hover:bg-space-accent/80 text-white">
              Start New Topic
            </Button>
          </div>
          
          <div className="cosmic-card overflow-hidden">
            <div className="divide-y divide-gray-800">
              {discussionTopics.map((topic, index) => (
                <div key={index} className="p-4 hover:bg-space-purple/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1 hover:text-space-accent cursor-pointer">
                        {topic.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {topic.tags.map((tag, i) => (
                          <span key={i} className="text-xs bg-space-purple/20 text-space-light px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-400">
                        Last updated: {topic.lastUpdated}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-space-accent/20 text-space-accent px-3 py-1 rounded-full text-sm">
                        {topic.replies} replies
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 text-center border-t border-gray-800">
              <button className="text-space-accent hover:underline">
                View All Topics
              </button>
            </div>
          </div>
        </section>
        
        {/* Community Projects */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Collaborative Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {communityProjects.map((project, index) => (
              <div key={index} className="cosmic-card overflow-hidden group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-space-accent" />
                      <span className="text-white text-sm">{project.participants} participants</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-space-accent h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-space-purple/30 hover:bg-space-purple/50 text-white py-2 rounded transition-colors">
                    Join Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Featured Members */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Featured Community Members</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <div key={index} className="cosmic-card p-6 text-center">
                <div className="mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-space-accent"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-space-accent text-sm mb-3">{member.role}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Award size={16} className="text-space-accent" />
                  <span>{member.contributions} contributions</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors">
              Meet All Members
            </button>
          </div>
        </section>
        
        {/* Resources */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Community Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="cosmic-card p-6">
              <div className="flex items-start gap-4">
                <div className="bg-space-accent/20 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-space-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Educational Materials</h3>
                  <p className="text-gray-400 mb-4">
                    Access our library of astronomy and space science learning resources, including lecture notes, research papers, and study guides.
                  </p>
                  <button className="text-space-accent hover:underline flex items-center">
                    Browse Library
                    <LinkIcon className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="cosmic-card p-6">
              <div className="flex items-start gap-4">
                <div className="bg-space-accent/20 p-3 rounded-full">
                  <Users className="h-6 w-6 text-space-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Mentorship Program</h3>
                  <p className="text-gray-400 mb-4">
                    Connect with experienced members who can guide you in your astronomy journey or career path in space science.
                  </p>
                  <button className="text-space-accent hover:underline flex items-center">
                    Find a Mentor
                    <LinkIcon className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;
