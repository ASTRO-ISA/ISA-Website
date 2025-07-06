import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 text-white">Featured Courses</h2>

        {loading ? (
          <p className="text-gray-400">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-400">No courses available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="cosmic-card overflow-hidden group bg-space-purple/10 border border-space-purple/30 rounded"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.imageUrl}
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
                        {course.rating ?? 4.8} ({course.students ?? 0} students)
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
        )}

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
