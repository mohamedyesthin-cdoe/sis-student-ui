import React from "react";
import { Card, CardContent, Typography, Button, Chip } from "@mui/material";
import CardComponent from "../card/Card";

interface Course {
  title: string;
  category: string;
  author: string;
  lessons: number;
  hours: number;
  rating: number;
  students: string;
  image: string;
}

const courses: Course[] = [
  {
    title: "Full Stack Web Development",
    category: "Development",
    author: "Albert James",
    lessons: 24,
    hours: 40,
    rating: 4.9,
    students: "12k",
    image: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
  }
  ,
  {
    title: "Design System",
    category: "Design",
    author: "Albert James",
    lessons: 24,
    hours: 40,
    rating: 4.9,
    students: "12k",
    image: "https://images.pexels.com/photos/1181674/pexels-photo-1181674.jpeg"
  },
  {
    title: "React Native Course",
    category: "Frontend",
    author: "Albert James",
    lessons: 24,
    hours: 40,
    rating: 4.9,
    students: "12k",
    image: "https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg"
  },
];

const CoursesSection: React.FC = () => {
  return (
    <CardComponent className="rounded-2xl shadow-sm ">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-bold">
            Top Courses 
          </Typography>
          <Typography variant="body2" color="primary" className="cursor-pointer">
            See All
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course, i) => (
            <Card key={i} className="rounded-2xl shadow-sm">
              <CardContent>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <Chip
                  label={course.category}
                  size="small"
                  className="mb-2"
                  color="primary"
                />
                <Typography variant="h6" className="font-bold">
                  {course.title}
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-2">
                  Created by <span className="font-medium">{course.author}</span>
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {course.lessons} Lessons • {course.hours} Hours
                </Typography>
                <Typography variant="body2" className="text-yellow-600 mt-1">
                  ⭐ {course.rating} ({course.students})
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  className="mt-3 rounded-full"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </CardComponent>
  );
};

export default CoursesSection;
