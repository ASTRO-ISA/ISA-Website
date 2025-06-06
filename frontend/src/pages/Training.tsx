
import StarBackground from "@/components/StarBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";

const Training = () => {
  const courses = [
    {
      id: 1,
      title: "Introduction to Astronomy",
      instructor: "Dr. Emily Carter",
      level: "Beginner",
      duration: "6 weeks",
      rating: 4.8,
      students: 1250,
      price: "$49.99",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=500"
    },
    {
      id: 2,
      title: "Astrophotography Masterclass",
      instructor: "Michael Huang",
      level: "Intermediate",
      duration: "8 weeks",
      rating: 4.9,
      students: 876,
      price: "$79.99",
      image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=500"
    },
    {
      id: 3,
      title: "Satellite Programming Basics",
      instructor: "Dr. James Wilson",
      level: "Intermediate",
      duration: "10 weeks",
      rating: 4.7,
      students: 642,
      price: "$89.99",
      image: "https://images.unsplash.com/photo-1581822261290-991b38693d1b?q=80&w=500"
    },
    {
      id: 4,
      title: "Telescope Building Workshop",
      instructor: "Sarah Martinez",
      level: "Advanced",
      duration: "12 weeks",
      rating: 4.6,
      students: 389,
      price: "$129.99",
      image: "https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=500"
    },
    {
      id: 5,
      title: "Space Weather Forecasting",
      instructor: "Dr. Robert Chang",
      level: "Advanced",
      duration: "8 weeks",
      rating: 4.8,
      students: 421,
      price: "$99.99",
      image: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?q=80&w=500"
    },
    {
      id: 6,
      title: "Rocketry Fundamentals",
      instructor: "Alex Johnson",
      level: "Intermediate",
      duration: "10 weeks",
      rating: 4.9,
      students: 756,
      price: "$109.99",
      image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=500"
    }
  ];

  const certifications = [
    {
      title: "Certified Astronomy Educator",
      description: "Learn to teach astronomy to students of all ages with this comprehensive certification program.",
      level: "Professional",
      duration: "6 months"
    },
    {
      title: "Space Science Specialist",
      description: "Gain expertise in the latest space science research and applications with this advanced certification.",
      level: "Expert",
      duration: "12 months"
    },
    {
      title: "Aerospace Engineering Fundamentals",
      description: "Master the basics of aerospace engineering with practical projects and in-depth theory.",
      level: "Intermediate",
      duration: "9 months"
    }
  ];

  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <StarBackground /> */}
      {/* <Navbar /> */}
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Training & Certification</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Enhance your knowledge and skills in astronomy, space science, and technology.
          </p>
        </div>
        
        {/* Featured Courses */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Featured Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="cosmic-card overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-space-purple/90 text-white text-xs font-bold px-2 py-1 rounded">
                    {course.level}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1 text-white">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">by {course.instructor}</p>
                  
                  <div className="flex justify-between text-sm text-gray-400 mb-3">
                    <span>{course.duration}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-space-accent mr-1 fill-space-accent" />
                      <span>{course.rating} ({course.students} students)</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-space-accent">{course.price}</span>
                    <button className="bg-space-accent hover:bg-space-accent/80 text-white px-3 py-1 rounded transition-colors">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors">
              Browse All Courses
            </button>
          </div>
        </section>
        
        {/* Certifications */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Professional Certifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="cosmic-card p-6">
                <h3 className="text-xl font-semibold mb-3 text-white">{cert.title}</h3>
                <p className="text-gray-400 mb-4">{cert.description}</p>
                <div className="flex justify-between text-sm text-gray-400 mb-4">
                  <span>Level: {cert.level}</span>
                  <span>Duration: {cert.duration}</span>
                </div>
                <button className="w-full bg-space-purple/30 hover:bg-space-purple/50 text-white py-2 rounded transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </section>
        
        {/* Testimonials */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Student Testimonials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="cosmic-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-space-purple/30"></div>
                <div>
                  <h4 className="font-semibold">Priya Sharma</h4>
                  <p className="text-sm text-gray-400">Completed: Astrophotography Masterclass</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The course provided me with in-depth knowledge of astrophotography techniques. The instructor was extremely helpful and the practical assignments helped me improve my skills significantly."
              </p>
              <div className="flex mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-space-accent fill-space-accent" />
                ))}
              </div>
            </div>
            
            <div className="cosmic-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-space-purple/30"></div>
                <div>
                  <h4 className="font-semibold">Rahul Patel</h4>
                  <p className="text-sm text-gray-400">Completed: Satellite Programming Basics</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "This course opened new career opportunities for me. The hands-on projects were challenging but rewarding, and I gained practical skills that I'm now using in my professional work."
              </p>
              <div className="flex mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-space-accent fill-space-accent" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
};

export default Training;
