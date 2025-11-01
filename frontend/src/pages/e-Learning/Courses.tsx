import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fetchCourses = async () => {
  const res = await api.get("/courses/");
  return res.data;
};

const Courses = () => {
  const {
    data: courses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  if (isLoading) {
    return (
      <p className="text-gray-400 italic flex justify-center items-center">
        Loading courses...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-red-400 italic flex justify-center items-center">
        Error fetching courses: {error.message}
      </p>
    );
  }

  return (
    <div>
      <section className="mb-20">
        {courses.length === 0 ? (
          <p className="text-gray-400 italic flex justify-center items-center text-center sm:text-start">
            Nothing to see here right now. Listed courses will appear here!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <a
                key={course._id}
                href={course.applyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="cosmic-card overflow-hidden group bg-space-purple/10 border border-space-purple/30 rounded">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-2xl font-semibold mb-1 text-white">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {course.description}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Source: {course.source}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;
