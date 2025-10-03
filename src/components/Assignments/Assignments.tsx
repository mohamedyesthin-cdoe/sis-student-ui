import React from "react";
import {CardContent, Typography, Checkbox } from "@mui/material";
import CardComponent from "../card/Card";

interface Assignment {
  title: string;
  due: string;
}

const assignments: Assignment[] = [
  { title: "Do The Research", due: "Due in 9 days" },
  { title: "PHP Development", due: "Due in 2 days" },
  { title: "Graphic Design", due: "Due in 5 days" },
];

const Assignments: React.FC = () => {
  return (
    <CardComponent className="rounded-2xl shadow-sm">
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <Typography variant="h6" className="font-bold">
            Assignments
          </Typography>
          <Typography variant="body2" color="primary" className="cursor-pointer">
            See All
          </Typography>
        </div>
        <div className="flex flex-col gap-2">
          {assignments.map((a, i) => (
            <div key={i} className="flex items-center justify-between border rounded-lg p-2">
              <div className="flex items-center gap-2">
                <Checkbox size="small" />
                <div>
                  <Typography variant="body1">{a.title}</Typography>
                  <Typography variant="caption" className="text-gray-500">
                    {a.due}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </CardComponent>
  );
};

export default Assignments;
