import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
// import StarBackground from "@/components/StarBackground";

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast();

   // to check if the user is logged in before writing the blog, if the user is not logged in, he cannot write blog
   const handleWriteClick = () => {
    if(isLoggedIn){ // checking using auth context isLoggedIn state
      navigate("/host-event")
    } else {
      toast({
        title: "Hold on!",
        description: "Log in first to host an event.",
      })
    }
  };

  useEffect(() => {
    const res = axios
    .get('http://localhost:3000/api/v1/events')
    .then((res) => {
      setEvents(res.data)
      setLoading(false)
    })
    .catch((err) => {
      console.error('Error fetching events', err)
    })
  }, [])

  // we got all events from which we are making types here
  const communityEvents = events.filter(event => event.type === 'community');
  const astronomicalEvents = events.filter(event => event.type === 'astronomical');

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const completedEvents = events.filter(event => event.status === 'completed');

  if(loading){
    return (
      <div className="min-h-screen flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-100 mb-4"></div>
        <p className="text-gray-100">Loading events for you...</p>
      </div>
    );
  }
  if(!events) return <p className="min-h-screen flex flex-col items-center justify-center h-64">Nothing to see here right now!</p>

  // const upcomingEvents = [
  //   {
  //     id: 1,
  //     title: "Stellar Conventus: Debates & Demonstrations",
  //     date: "December 14, 2023",
  //     time: "10:00 AM - 5:00 PM",
  //     location: "LNCT Campus Auditorium, Bhopal",
  //     image: "/images/51dc2c27-82d2-40f1-a203-b0c090ea514d.png",
  //     description: "Dive into a day of scientific debates, discoveries, and exciting demonstrations about space and astronomy.",
  //     attendees: 120
  //   },
  //   {
  //     id: 2,
  //     title: "Geminid Meteor Shower Observation Night",
  //     date: "December 14, 2023",
  //     time: "9:00 PM - 2:00 AM",
  //     location: "Observatory Hill, Bhopal",
  //     image: "https://images.unsplash.com/photo-1534222190540-49b9de934701?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1ldGVvciUyMHNob3dlcnxlbnwwfHwwfHx8MA%3D%3D",
  //     description: "Join us for a night of stargazing to observe one of the year's best meteor showers with professional telescopes and guidance.",
  //     attendees: 75
  //   },
  //   {
  //     id: 3,
  //     title: "Rocket Model Building Workshop",
  //     date: "December 20, 2023",
  //     time: "2:00 PM - 6:00 PM",
  //     location: "LNCT Engineering Lab, Bhopal",
  //     image: "https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?q=80&w=500",
  //     description: "Learn to design and build functional model rockets in this hands-on workshop led by aerospace engineering students.",
  //     attendees: 40
  //   }
  // ];

  // const astronomicalEvents = [
  //   {
  //     date: "Dec 1",
  //     name: "New Moon",
  //     description: "The Moon will be positioned between the Earth and the Sun and will not be visible from Earth."
  //   },
  //   {
  //     date: "Dec 14",
  //     name: "Geminid Meteor Shower Peak",
  //     description: "One of the best meteor showers of the year, producing up to 120 multicolored meteors per hour."
  //   },
  //   {
  //     date: "Dec 15",
  //     name: "Full Cold Moon",
  //     description: "The Moon will be fully illuminated as seen from Earth, appearing as a bright disc in the night sky."
  //   },
  //   {
  //     date: "Dec 19",
  //     name: "Leonid Meteor Shower Peak",
  //     description: "An annual meteor shower producing meteor rates of about 15 meteors per hour."
  //   },
  //   {
  //     date: "Dec 21",
  //     name: "December Solstice",
  //     description: "The December solstice occurs when the Sun reaches its most southerly declination, marking the first day of winter in the Northern Hemisphere."
  //   },
  //   {
  //     date: "Dec 22",
  //     name: "Ursid Meteor Shower Peak",
  //     description: "A minor meteor shower producing about 5-10 meteors per hour."
  //   }
  // ];

    // to show the date in readable format
    const formatDate = (dateStr) =>
      new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    
    // to set time in readable format
    const formatTime = (dateStr) =>
      new Date(dateStr).toLocaleTimeString('en-IN', {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <StarBackground /> */}
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Astronomical Events & Meetups</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay updated with upcoming astronomical phenomena and ISA club events.
          </p>
        </div>

        {/* Upcoming ISA Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Upcoming ISA Club Events</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming events */}
            {events.map((event) => ( // for time being using just events
              <Link
              to={`/events/${event._id}`}
              key={event._id}
              >
              <div className="cosmic-card overflow-hidden group">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`http://localhost:3000/${event.thumbnail}`} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-4 w-4 mr-2 text-space-accent" />
                      <span>{formatTime(event.eventDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-2 text-space-accent" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 mr-2 text-space-accent" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                  
                  <button className="w-full bg-space-purple/30 hover:bg-space-purple/50 text-white py-2 rounded transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
              </Link>
            ))}
            
          </div>
          
          <div className="text-center mt-10">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors">
              View All Events
            </button>
          </div>
        </section>

        {/* We need astronomical events here */}
        
        {/* Astronomical Calendar */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Astronomical Calendar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
              to={`/events/${event._id}`}
              key={event._id}
              >
              <div className="cosmic-card p-5 hover:transform hover:scale-105 transition-transform">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-space-accent/20 text-space-accent flex items-center justify-center font-bold">
                    {formatDate(event.eventDate).split(' ')[0]}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-gray-400">{formatDate(event.eventDate)}</div>
                    <h3 className="font-semibold">{event.title}</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{event.description}</p>
              </div>
              </Link>
            ))}
          </div>
        </section>
        
        
        
        {/* Host Your Own Event */}
        <section className="cosmic-card p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Host Your Own Stargazing Event</h2>
              <p className="text-gray-300 mb-6">
                ISA Club members can organize their own astronomical observation events with our equipment and guidance. Share your passion for astronomy with others!
              </p>
              <ul className="text-gray-400 mb-6 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-space-accent"></div>
                  <span>Access to telescopes and observation equipment</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-space-accent"></div>
                  <span>Guidance from experienced club members</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-space-accent"></div>
                  <span>Promotion through ISA Club channels</span>
                </li>
              </ul>
              <button className="bg-space-accent hover:bg-space-accent/80 text-white px-5 py-2 rounded transition-colors"
              onClick={handleWriteClick}
              >
                Host an Event
              </button>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?q=80&w=500" 
                alt="Stargazing Event" 
                className="rounded-lg h-auto w-full"
              />
            </div>
          </div>
        </section>
      </main>
      {/*<Footer /> */}
    </div>
  );
};

export default Events;
