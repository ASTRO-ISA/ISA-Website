import { useEffect, useState } from "react";
import axios from "axios";
import { ExternalLink } from "lucide-react";

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
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1 text-white">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {course.description}
                  </p>

                  <div className="flex justify-end mt-4">
                    <a
                      href={course.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-space-accent hover:bg-space-accent/80 text-white px-3 py-1 rounded transition-colors inline-flex items-center gap-1"
                    >
                      Apply <ExternalLink className="h-4 w-4" />
                    </a>
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
