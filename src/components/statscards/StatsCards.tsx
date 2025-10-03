import React from "react";
import { CardContent, Typography } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import CardComponent from "../card/Card";

interface Stat {
  value: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  { value: "155+", label: "Completed Courses", color: "text-blue-500" },
  { value: "39+", label: "Earned Certificate", color: "text-green-500" },
  { value: "25+", label: "Course in Progress", color: "text-purple-500" },
  { value: "18k+", label: "Community Support", color: "text-orange-500" },
];

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <CardComponent key={idx} className="rounded-2xl shadow-sm">
          <CardContent className="flex items-center justify-between">
            <div>
              <Typography variant="h6" className="font-bold">
                {stat.value}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {stat.label}
              </Typography>
            </div>
            <TrendingUp className={`${stat.color}`} />
          </CardContent>
        </CardComponent>
      ))}
    </div>
  );
};

export default StatsCards;
