
import { Card, CardContent } from "@/components/ui/card";

const astronomicalEvents = [
  {
    date: "Dec 1",
    name: "New Moon",
    image: "/images/7024007d-9651-4448-8d1f-c8f6c7b67611.png",
    description: "The Moon will be positioned between the Earth and the Sun and will not be visible from Earth."
  },
  {
    date: "Dec 14",
    name: "Geminid Meteor Shower Peak",
    image: "/images/7024007d-9651-4448-8d1f-c8f6c7b67611.png",
    description: "One of the best meteor showers of the year, producing up to 120 multicolored meteors per hour."
  },
  {
    date: "Dec 15",
    name: "Full Cold Moon",
    image: "/images/7024007d-9651-4448-8d1f-c8f6c7b67611.png",
    description: "The Moon will be fully illuminated as seen from Earth, appearing as a bright disc in the night sky."
  },
  {
    date: "Dec 19",
    name: "Leonid Meteor Shower Peak",
    image: "/images/7024007d-9651-4448-8d1f-c8f6c7b67611.png",
    description: "An annual meteor shower producing meteor rates of about 15 meteors per hour."
  }
];

const EventsCalendar = () => {
  return (
    <section className="py-20 bg-space-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Upcoming Astronomical Events</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Mark your calendar for these celestial phenomena and join our community observation sessions.
          </p>
        </div>

        {/* <div className="flex flex-wrap justify-center mb-8">
          <img 
            src="/images/7024007d-9651-4448-8d1f-c8f6c7b67611.png" 
            alt="Astronomical Calendar" 
            className="rounded-lg shadow-2xl max-w-full h-auto"
          />
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {astronomicalEvents.map((event, index) => (
            <Card key={index} className="cosmic-card border-none overflow-hidden bg-space-dark/60">
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-space-blue/30">
                  {/* <span className="text-5xl font-bold text-white">{event.date.split(" ")[1]}</span> */}
                  <img src={event.image} alt={event.date.split(" ")[1]} />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="text-white font-semibold">{event.date}</div>
                  <h3 className="text-xl font-bold text-white">{event.name}</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-gray-400 text-sm">{event.description}</p>
                <button className="mt-4 text-space-accent hover:text-space-accent/80 text-sm font-medium">
                  Learn more →
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors">
            <a href="/events">View Full Calendar</a>
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventsCalendar;
