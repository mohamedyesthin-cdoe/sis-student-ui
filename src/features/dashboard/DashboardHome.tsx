import React from "react";
import StatsCards from "../../components/statscards/StatsCards";
import StudyStatistics from "../../components/studystatistics/StudyStatistics";
import CoursesSection from "../../components/CoursesSection/CoursesSection";
import Assignments from "../../components/Assignments/Assignments";
import ProgressCard from "../../components/ProgressCard/ProgressCard";
import CalendarCard from "../../components/CalendarCard/CalendarCard";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Top Stats */}
      <StatsCards />

      {/* Chart + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 items-stretch">
        {/* Chart */}
        <div className="col-span-2 h-full">
          <div className="h-full flex flex-col">
            <StudyStatistics />
          </div>
        </div>

        {/* Calendar */}
        <div className="h-full">
          <div className="h-full flex flex-col">
            <CalendarCard />
          </div>
        </div>
      </div>

      {/* Courses + Right Column (Assignments + Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 items-stretch">
        {/* Courses Section (2/3 width) */}
        <div className="col-span-2 h-full">
          <CoursesSection />
        </div>

        {/* Right Column (Assignments + Progress stacked) */}
        <div className="flex flex-col gap-0  h-full">
          <div className="flex-1">
            <Assignments />
          </div>
          <div className="flex-1">
            <ProgressCard />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
