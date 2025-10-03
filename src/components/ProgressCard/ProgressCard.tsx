import React from "react";
import {  CardContent, Typography, CircularProgress } from "@mui/material";
import CardComponent from "../card/Card";

const ProgressCard: React.FC = () => {
  const progress = 82;

  return (
    <CardComponent  className="rounded-2xl shadow-sm">
      <CardContent className="flex flex-col items-center">
        <Typography variant="h6" className="font-bold mb-2">
          My Progress
        </Typography>
        <div className="relative inline-flex">
          <CircularProgress
            variant="determinate"
            value={progress}
            size={100}
            thickness={5}
            className="text-blue-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Typography variant="h6">{progress}%</Typography>
          </div>
        </div>
        <Typography variant="body2" className="mt-3 text-gray-600">
          Total hour: 6h 32 min
        </Typography>

        <div className="flex justify-between w-full mt-3 text-sm text-gray-600">
          <span>60/60 Completed</span>
          <span>60/60 Completed</span>
          <span>60/60 Completed</span>
        </div>
      </CardContent>
    </CardComponent>
  );
};

export default ProgressCard;
