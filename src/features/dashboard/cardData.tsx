import studentIcon from "../../assets/images/student.svg";
import teacherIcon from "../../assets/images/teacher.svg";
import staffIcon from "../../assets/images/staff.svg";
import subjectIcon from "../../assets/images/subject.svg";
import theme from "../../styles/theme";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { Box } from "@mui/material";
export const cardData = [
  {
    id: 1,
    title: "Total Students",
    value: 3654,
    active: 3540,
    inactive: 11,
    percentage: "1.2%",
    icon: studentIcon,
    color: theme.palette.secondary.main
  },
  {
    id: 2,
    title: "Total Teachers",
    value: 120,
    active: 118,
    inactive: 2,
    percentage: "0.8%",
    icon: teacherIcon,
    color: theme.palette.info.main
  },
  {
    id: 3,
    title: "Total Courses",
    value: 58,
    active: 40,
    inactive: 18,
    percentage: "2.5%",
    icon: staffIcon,
    color: theme.palette.warning.main
  },
  {
    id: 4,
    title: "Departments",
    value: 12,
    active: 12,
    inactive: 0,
    percentage: "0%",
    icon: subjectIcon,
    color: theme.palette.error.main
  },
];
export const EventData = [
  {
    id: 1,
    title: "Parents, Teachers Meet",
    value: "15 Oct 2025",
    time: "09:10 AM - 10:50 PM",
    icon: <Box position="relative" display="inline-flex">
      <PersonIcon sx={{ fontSize: 20 }} />
      <EditIcon
        sx={{
          fontSize: 12,
          position: "absolute",
          bottom: 0,
          right: 0,
          bgcolor: "white",
          borderRadius: "50%",
          bordercolor: ''
        }}
      />
    </Box>,
    color: theme.palette.secondary.main,
  },
  {
    id: 2,
    title: "Vacation Meeting",
    value: "5 Nov 2025",
    time: "09:10 AM - 10:50 PM",
    icon: (
      <Box position="relative" display="inline-flex">
        <AirportShuttleIcon sx={{ fontSize: 20 }} />
      </Box>
    ),
    color: theme.palette.info.main,
    bordercolor: ''
  },
];