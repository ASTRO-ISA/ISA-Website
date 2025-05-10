
import StarBackground from "@/components/StarBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, Users, Play, ExternalLink } from "lucide-react";

const Webinars = () => {
  const upcomingWebinars = [
    {
      id: 1,
      title: "Exploring the James Webb Space Telescope Discoveries",
      presenter: "Dr. Anjali Gupta",
      date: "December 18, 2023",
      time: "7:00 PM - 8:30 PM",
      description: "Join us as Dr. Anjali Gupta discusses the latest discoveries from the James Webb Space Telescope and their implications for our understanding of the universe.",
      attendees: 245,
      image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=500"
    },
    {
      id: 2,
      title: "Careers in Space Science and Technology",
      presenter: "Panel of Industry Experts",
      date: "January 5, 2024",
      time: "6:00 PM - 7:30 PM",
      description: "Discover career paths in the growing space industry with insights from professionals working in different sectors of space science and technology.",
      attendees: 178,
      image: "https://images.unsplash.com/photo-1590959651373-a3db0f38a961?q=80&w=500"
    },
    {
      id: 3,
      title: "Amateur Astronomy: Getting Started with Limited Budget",
      presenter: "Rahul Mehra",
      date: "January 15, 2024",
      time: "7:30 PM - 9:00 PM",
      description: "Learn how to begin your astronomy journey with affordable equipment and free resources. Perfect for beginners and students.",
      attendees: 120,
      image: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=500"
    }
  ];

  const pastWebinars = [
    {
      id: 1,
      title: "Black Holes: Beyond the Event Horizon",
      presenter: "Dr. Vikram Shah",
      duration: "1h 23m",
      views: "1.2k",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=500"
    },
    {
      id: 2,
      title: "Satellite Design and Engineering Fundamentals",
      presenter: "Neha Kapoor",
      duration: "1h 45m",
      views: "876",
      image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=500"
    },
    {
      id: 3,
      title: "Exoplanets: The Search for Habitable Worlds",
      presenter: "Dr. Arjun Patel",
      duration: "1h 12m",
      views: "1.5k",
      image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=500"
    },
    {
      id: 4,
      title: "The Future of Space Travel and Colonization",
      presenter: "Priya Sharma",
      duration: "1h 30m",
      views: "2.3k",
      image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=500"
    }
  ];

  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <StarBackground /> */}
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Webinars & Live Sessions</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with scientists, astronauts, and industry experts through interactive talks and sessions.
          </p>
        </div>
        
        {/* Upcoming Webinars */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Upcoming Webinars</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingWebinars.map((webinar) => (
              <div key={webinar.id} className="cosmic-card overflow-hidden group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={webinar.image} 
                    alt={webinar.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <span className="text-white font-medium">{webinar.presenter}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-3">{webinar.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-4 w-4 mr-2 text-space-accent" />
                      <span>{webinar.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 mr-2 text-space-accent" />
                      <span>{webinar.attendees} registered</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{webinar.description}</p>
                  
                  <button className="w-full bg-space-purple/30 hover:bg-space-purple/50 text-white py-2 rounded transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Past Webinars */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Recent Webinar Recordings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastWebinars.map((webinar) => (
              <div key={webinar.id} className="cosmic-card overflow-hidden group">
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={webinar.image} 
                    alt={webinar.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-space-accent/80 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 text-white line-clamp-2">{webinar.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{webinar.presenter}</p>
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Duration: {webinar.duration}</span>
                    <span>{webinar.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors">
              View All Recordings
            </button>
          </div>
        </section>
        
        {/* Featured Session */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Featured Talk</h2>
          
          <div className="cosmic-card p-0 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 h-64 lg:h-auto relative">
                <img 
                  src="https://images.unsplash.com/photo-1501862700950-18382cd41497?q=80&w=1000" 
                  alt="Space Talk"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-space-accent/80 flex items-center justify-center cursor-pointer hover:bg-space-accent transition-colors">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-3">An Evening with NASA Scientist: Mars Exploration Updates</h3>
                <p className="text-gray-400 mb-6">
                  In this special session, we hosted Dr. Rajesh Kumar, a NASA scientist working on the Mars Exploration Program, who shared exclusive insights about the latest discoveries on the Red Planet.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100" 
                    alt="Dr. Rajesh Kumar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">Dr. Rajesh Kumar</h4>
                    <p className="text-sm text-gray-400">NASA Mars Exploration Program</p>
                  </div>
                </div>
                <a 
                  href="#" 
                  className="inline-flex items-center text-space-accent hover:underline"
                >
                  Watch full session
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Suggest a Speaker */}
        <section className="cosmic-card p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Suggest a Speaker or Topic</h2>
              <p className="text-gray-300 mb-6">
                Have a speaker or topic you'd like to see featured in our webinar series? We welcome your suggestions and are constantly looking for exciting new content.
              </p>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Suggested Speaker or Topic"
                  className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                />
                <textarea
                  placeholder="Why this would be valuable (optional)"
                  rows={3}
                  className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                ></textarea>
                <button type="submit" className="bg-space-accent hover:bg-space-accent/80 text-white px-6 py-2 rounded transition-colors">
                  Submit Suggestion
                </button>
              </form>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?q=80&w=500" 
                alt="Space Speaker" 
                className="rounded-lg h-auto w-full"
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Webinars;
