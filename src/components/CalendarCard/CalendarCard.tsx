import React, { useState } from "react";
import { CardContent, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import CardComponent from "../card/Card";

const CalendarCard: React.FC = () => {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <CardComponent className="rounded-2xl shadow-sm h-full flex flex-col">
      <CardContent className="flex flex-col flex-1">
        <Typography variant="h6" className="font-bold mb-2">
          September 2025
        </Typography>
        <div className="flex-1 flex items-center justify-center">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={date}
              onChange={(newValue:any) => setDate(newValue)}
            />
          </LocalizationProvider>
        </div>
      </CardContent>
    </CardComponent>
  );
};

export default CalendarCard;
