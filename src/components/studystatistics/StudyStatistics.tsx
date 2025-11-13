import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CardContent } from "@mui/material";
import CardComponent from "../card/Card";
import Customtext from "../customtext/Customtext";

const data = [
  { month: "Jan", Study: 10, Test: 5 },
  { month: "Feb", Study: 15, Test: 10 },
  { month: "Mar", Study: 20, Test: 12 },
  { month: "Apr", Study: 40, Test: 20 },
  { month: "May", Study: 25, Test: 15 },
  { month: "Jun", Study: 45, Test: 30 },
  { month: "Jul", Study: 30, Test: 18 },
  { month: "Aug", Study: 35, Test: 25 },
  { month: "Sep", Study: 20, Test: 15 },
  { month: "Oct", Study: 30, Test: 22 },
  { month: "Nov", Study: 28, Test: 18 },
  { month: "Dec", Study: 40, Test: 28 },
];

const StudyStatistics: React.FC = () => {
  return (
    <CardComponent className="rounded-2xl shadow-sm h-full flex flex-col">
      <CardContent className="flex flex-col flex-1">
        <Customtext
          fieldName={'Study Statistics'}
          variantName="h6"
          sx={{ mb: 4 }}
        />
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Study"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorStudy)"
              />
              <Area
                type="monotone"
                dataKey="Test"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorTest)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </CardComponent>
  );
};

export default StudyStatistics;
