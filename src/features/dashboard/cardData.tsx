import studentIcon from "/assets/images/student.svg";
import teacherIcon from "/assets/images/teacher.svg";
import staffIcon from "/assets/images/staff.svg";
import subjectIcon from "/assets/images/subject.svg";
import ChatIcon from '@mui/icons-material/Chat';
import theme from "../../styles/theme";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { Box } from "@mui/material";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NoteIcon from '@mui/icons-material/Note';
import TimerIcon from '@mui/icons-material/Timer';
import ClassIcon from '@mui/icons-material/Class';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArticleIcon from '@mui/icons-material/Article';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import DescriptionIcon from '@mui/icons-material/Description';
import MarkunreadIcon from '@mui/icons-material/Markunread';
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
export const FaclitiesData = [
  {
    id: 1,
    title: "Aaron",
    subject: "Chemistry",
    action1: "Email",
    action2: "Chat",
    percentage: "1.2%",
    icon: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-06.jpg',
    icon1: (
      <Box>
        <ChatIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
    icon2: (
      <Box>
        <MarkunreadIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
  },
  {
    id: 2,
    title: "Hellana",
    subject: "English",
    action1: "Email",
    action2: "Chat",
    percentage: "1.2%",
    icon: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-03.jpg',
    icon1: (
      <Box>
        <ChatIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
    icon2: (
      <Box>
        <MarkunreadIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
  },
  {
    id: 3,
    title: "Morgan",
    subject: "Physics",
    action1: "Email",
    action2: "Chat",
    percentage: "1.2%",
    icon: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-05.jpg',
    icon1: (
      <Box>
        <ChatIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
    icon2: (
      <Box>
        <MarkunreadIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
  },
  {
    id: 4,
    title: "Daniel Josuva",
    subject: "Spanish",
    action1: "Email",
    action2: "Chat",
    percentage: "1.2%",
    icon: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-02.jpg',
    icon1: (
      <Box>
        <ChatIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
    icon2: (
      <Box>
        <MarkunreadIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
  },
  {
    id: 5,
    title: "Teresa",
    subject: "Maths",
    action1: "Email",
    action2: "Chat",
    percentage: "1.2%",
    icon: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-01.jpg',
    icon1: (
      <Box>
        <ChatIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
    icon2: (
      <Box>
        <MarkunreadIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
  },
  {
    id: 6,
    title: "Teresa",
    subject: "Maths",
    action1: "Email",
    action2: "Chat",
    percentage: "1.2%",
    icon: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-01.jpg',
    icon1: (
      <Box>
        <ChatIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
    icon2: (
      <Box>
        <MarkunreadIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
  },
  {
    id: 7,
    title: "Teresa",
    subject: "Maths",
    action1: "Email",
    action2: "Chat",
    percentage: "1.2%",
    icon: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-01.jpg',
    icon1: (
      <Box>
        <ChatIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
    icon2: (
      <Box>
        <MarkunreadIcon sx={{ fontSize: 15 }} />
      </Box>
    ),
  }
];
export const FeesData = [
  {
    id: 1,
    title: "Transport Fees",
    value: "$2500",
    date: "25 May 2024",
    icon: (
      <Box position="relative" display="inline-flex"
        sx={{ color: "white", p: 1, borderRadius: 5,backgroundColor:theme.palette.primary.light }}>
        <LibraryBooksIcon sx={{ fontSize: 20 }} />
      </Box>
    ),
    color: theme.palette.secondary.main,
    backgroundcolor: `4px solid ${theme.palette.secondary.main}`,
  },
  {
    id: 2,
    title: "Transport Fees",
    value: "$2500",
    date: "25 May 2024",
    icon: (
      <Box position="relative" display="inline-flex"
        sx={{ color: "white", p: 1, borderRadius: 5,backgroundColor:theme.palette.primary.light }}>
        <LibraryBooksIcon sx={{ fontSize: 20 }} />
      </Box>
    ),
    color: theme.palette.secondary.main,
    backgroundcolor: `4px solid ${theme.palette.secondary.main}`,
  },
  {
    id: 3,
    title: "Transport Fees",
    value: "$2500",
    date: "25 May 2024",
    icon: (
     <Box position="relative" display="inline-flex"
        sx={{ color: "white", p: 1, borderRadius: 5,backgroundColor:theme.palette.primary.light }}>
        <LibraryBooksIcon sx={{ fontSize: 20 }} />
      </Box>
    ),
    color: theme.palette.secondary.main,
    backgroundcolor: `4px solid ${theme.palette.secondary.main}`,
  },
  {
    id: 4,
    title: "Transport Fees",
    value: "$2500",
    date: "25 May 2024",
    icon: (
     <Box position="relative" display="inline-flex"
        sx={{ color: "white", p: 1, borderRadius: 5,backgroundColor:theme.palette.primary.light }}>
        <LibraryBooksIcon sx={{ fontSize: 20 }} />
      </Box>
    ),
    color: theme.palette.secondary.main,
    backgroundcolor: `4px solid ${theme.palette.secondary.main}`,
  }
];
export const EventData = [
  {
    id: 1,
    title: "Parents, Teachers Meet",
    value: "15 Oct 2025",
    time: "09:10 AM - 10:50 PM",
    icon: <Box position="relative" display="inline-flex"
      sx={{ backgroundColor: theme.palette.background.default, p: 1, borderRadius: 2 }}>
      <PersonIcon sx={{ fontSize: 20 }} />
      <EditIcon
        sx={{
          fontSize: 14,
          position: "absolute",
          bottom: 0,
          right: 0,
          bgcolor: "white",
          borderRadius: "50%",
        }}
      />
    </Box>,
    color: theme.palette.secondary.main,
    bordercolor: `4px solid ${theme.palette.secondary.main}`,
    timeicon: <AvTimerIcon sx={{ fontSize: 20 }} />

  },
  {
    id: 2,
    title: "Vacation Meeting",
    value: "5 Nov 2025",
    time: "09:10 AM - 10:50 PM",
    icon: (
      <Box position="relative" display="inline-flex"
        sx={{ backgroundColor: theme.palette.background.default, p: 1, borderRadius: 2 }}>
        <AirportShuttleIcon sx={{ fontSize: 20 }} />
      </Box>
    ),
    color: theme.palette.info.main,
    bordercolor: `4px solid ${theme.palette.info.main}`,
    timeicon: <AvTimerIcon sx={{ fontSize: 20 }} />
  },
  {
    id: 3,
    title: "Vacation Meeting",
    value: "5 Nov 2025",
    time: "09:10 AM - 10:50 PM",
    icon: (
      <Box position="relative" display="inline-flex"
        sx={{ backgroundColor: theme.palette.background.default, p: 1, borderRadius: 2 }}>
        <AirportShuttleIcon sx={{ fontSize: 20 }} />
      </Box>
    ),
    color: theme.palette.info.main,
    bordercolor: `4px solid ${theme.palette.info.main}`,
    timeicon: <AvTimerIcon sx={{ fontSize: 20 }} />
  },
];
export const StudentEventData = [
  {
    id: 1,
    title: "1st Quarterly",
    titleday:'19 Days More',
    subtitle:'Mathematics',
    time: "09:10 AM - 10:50 PM",
    subtitleday:'06 May 2024',
    roomno:'15',
    calendaricon: <CalendarMonthIcon sx={{ fontSize: 20 }} />,
    color: theme.palette.secondary.main,
    timeicon: <AvTimerIcon sx={{ fontSize: 20 }} />
  },
  {
    id: 2,
    title: "2nd Quarterly",
    titleday:'19 Days More',
    subtitle:'Physics',
    time: "09:10 AM - 10:50 PM",
    subtitleday:'06 May 2024',
    roomno:'15',
    calendaricon: <CalendarMonthIcon sx={{ fontSize: 20 }} />,
    color: theme.palette.secondary.main,
    timeicon: <AvTimerIcon sx={{ fontSize: 20 }} />
  },
];
export const NoticePeriodData = [
  {
    id: 1,
    title: "New Syllabus Instructions",
    days: '5 days',
    time: "Added on : 11 Oct 2025",
    icon: (
      <Box position="relative" display="inline-flex"
        sx={{ color: theme.palette.primary.main, p: 1, borderRadius: 2 }}>
        <LibraryBooksIcon sx={{ fontSize: 20 }} />
      </Box>
    ),
    color: theme.palette.secondary.main,
    timeicon: ''

  },
  {
    id: 2,
    title: "World Environment Day Program",
    days: '7 days',
    time: "Added on : 21 Oct 2025",
    icon: (
      <Box position="relative" display="inline-flex"
        sx={{ color: theme.palette.info.main, p: 1, borderRadius: 2 }}>
        <NoteIcon sx={{ fontSize: 20 }} />
      </Box>
    ),
    color: theme.palette.info.main,
  },
  {
    id: 3,
    title: "Exam Preparation Notification",
    days: '15 days',
    time: "Added on : 13 Oct 2025",
    icon: (
      <Box position="relative" display="inline-flex"
        sx={{ color: theme.palette.warning.main, p: 1, borderRadius: 2 }}>
        <TimerIcon sx={{ fontSize: 24 }} />
      </Box>
    ),
    color: theme.palette.info.main,
  },
  {
    id: 4,
    title: "Online Classes Preparation",
    days: '20 days',
    time: "Added on : 24 Nov 2025",
    icon: (
      <Box position="relative" display="inline-flex"
        sx={{ color: theme.palette.error.main, p: 1, borderRadius: 2 }}>
        <ClassIcon sx={{ fontSize: 24 }} />
      </Box>
    ),
    color: theme.palette.info.main,
  },
];

export const QuickLinksData = [
  {
    id: 1,
    title: "Pay Fees",
    icon: <CalendarMonthIcon sx={{ fontSize: 20 }} />,
    color: theme.palette.secondary.main,
    backgroundcolor: ''
  },
  {
    id: 2,
    title: "Exam Result",
    icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
    color: theme.palette.info.main,
    backgroundcolor: ''
  },
  {
    id: 3,
    title: "Calendar",
    icon: <ArticleIcon sx={{ fontSize: 20 }} />,
    color: theme.palette.warning.main,
    backgroundcolor: ''
  },
  {
    id: 4,
    title: "Attendance",
    icon: <LocalAtmIcon sx={{ fontSize: 20 }} />,
    color: theme.palette.error.main,
    backgroundcolor: ''
  }
];
