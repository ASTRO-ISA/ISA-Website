import { Star } from "lucide-react";
import React from "react";

const Courses = () => {
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
      image:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=500",
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
      image:
        "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=500",
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
      image:
        "https://images.unsplash.com/photo-1581822261290-991b38693d1b?q=80&w=500",
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
      image:
        "https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=500",
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
      image:
        "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?q=80&w=500",
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
      image:
        "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=500",
    },
  ];
  return (
    <div>
      {" "}
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
                <h3 className="text-lg font-semibold mb-1 text-white">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  by {course.instructor}
                </p>

                <div className="flex justify-between text-sm text-gray-400 mb-3">
                  <span>{course.duration}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-space-accent mr-1 fill-space-accent" />
                    <span>
                      {course.rating} ({course.students} students)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-space-accent">
                    {course.price}
                  </span>
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
    </div>
  );
};

export default Courses;
