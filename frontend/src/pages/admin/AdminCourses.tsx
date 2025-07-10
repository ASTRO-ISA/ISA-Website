import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";

const AdminCourses = () => {
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [courses, setCourses] = useState([]);
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    applyLink: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewCourse((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewCourse((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/courses/", {
        withCredentials: true,
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

  const handleCreateCourse = async () => {
    try {
      setCreatingCourse(true);

      const formData = new FormData();
      formData.append("title", newCourse.title);
      formData.append("description", newCourse.description);
      formData.append("applyLink", newCourse.applyLink);
      formData.append("image", newCourse.image);

      await axios.post("http://localhost:3000/api/v1/courses/create", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({ title: "Course created successfully!" });
      setNewCourse({
        title: "",
        description: "",
        applyLink: "",
        image: null,
      });
      fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error.message);
      toast({ title: "Error occurred while creating course" });
    } finally {
      setCreatingCourse(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:3000/api/v1/courses/${id}`, {
        withCredentials: true,
      });
      toast({ title: "Course deleted successfully!" });
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error.message);
      toast({ title: "Error deleting course" });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <Card className="bg-space-purple/10 border-space-purple/30">
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateCourse();
            }}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <input
              name="title"
              value={newCourse.title}
              onChange={handleInputChange}
              placeholder="Course Title*"
              required
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
            <textarea
              name="description"
              value={newCourse.description}
              onChange={handleInputChange}
              placeholder="Course Description*"
              required
              rows={3}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
            <input
              name="applyLink"
              value={newCourse.applyLink}
              onChange={handleInputChange}
              placeholder="Apply Link*"
              required
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
            <Button type="submit" className="w-full">
              {creatingCourse ? <Spinner /> : "Create Course"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ul className="space-y-4 mt-4">
        <SpinnerOverlay show={isDeleting}>
          {courses.map((course) => (
            <li
              key={course._id}
              className="p-4 border bg-space-purple/20 rounded"
            >
              <p className="font-semibold text-lg">{course.title}</p>
              <p>{course.description}</p>
              <p>
                Apply:{" "}
                <a
                  href={course.applyLink}
                  className="text-blue-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {course.applyLink}
                </a>
              </p>
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-40 object-cover mt-2 rounded"
              />
              <Button
                size="sm"
                onClick={() => handleDeleteCourse(course._id)}
                variant="destructive"
                className="mt-2"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </li>
          ))}
        </SpinnerOverlay>
      </ul>
    </>
  );
};

export default AdminCourses;
