import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Payments as PaymentsIcon,
  Feedback as FeedbackIcon,
  MenuBook as MenuBookIcon,
  LibraryBooks as LibraryBooksIcon,
  Assignment as AssignmentIcon,
  Lock as LockIcon,
  SupportAgent as SupportAgentIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  ReportProblem as ReportProblemIcon,
} from '@mui/icons-material';

import type { JSX } from 'react';
import { getValue } from '../utils/localStorageUtil';

interface MenuItem {
  text: string;
  icon: string;
  routePath?: string;
  subItems: {
    text: string;
    routePath: string;
  }[];
}
const student_id = getValue("student_id")

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: 'Dashboard',
    subItems: [],
    routePath: '/dashboard'
  },
  {
    text: 'Students',
    icon: 'Students',
    subItems: [
      { text: 'Students List', routePath: '/students/list' },
    ],
    routePath: '',
  },
  {
    text: 'Programs',
    icon: 'Programs',
    subItems: [
      { text: 'Programs List', routePath: '/programs' },
    ],
    routePath: '',
  },
  {
    text: 'Faculty',
    icon: 'Faculty',
    subItems: [
      { text: 'Faculty List', routePath: '/faculty' },
    ],
    routePath: '',
  },
];
export const STUDENT_MENU_ITEMS: MenuItem[] = [
  // {
  //   text: 'Dashboard',
  //   icon: 'Dashboard',
  //   subItems: [],
  //   routePath: '/dashboard/student'
  // },
  {
    text: 'Profile',
    icon: 'Profile',
    subItems: [
    ],
    routePath: `/students/detail/${student_id}`
  },
  {
    text: 'Fees',
    icon: 'Fees',
    subItems: [
      { text: 'Fees Detail', routePath: `/fees/detail/${student_id}` },
    ],
    routePath: '',
  },
  {
    text: 'Grievances',
    icon: 'Grievances',
    subItems: [
      // { text: 'Grievance', routePath: '/grievances' },
      // { text: 'Offline Grievance', routePath: '/grievances/offline' },
    ],
    routePath: '/grievances',
  },
  {
    text: 'Examinations',
    icon: 'Examinations',
    subItems: [],
    routePath: '/comingsoon',
  },
  // {
  //   text: 'Feedback & Survey',
  //   icon: 'Feedback',
  //   subItems: [],
  //   routePath: '/student/feedback',
  // },
  {
    text: 'Student Counselling',
    icon: 'Counselling',
    subItems: [],
    routePath: '',
  },
  {
    text: 'Documents',
    icon: 'Documents',
    subItems: [],
    routePath: `/documents/${student_id}`,
  },
  // {
  //   text: 'Library',
  //   icon: 'Library',
  //   subItems: [],
  //   routePath: '/student/library',
  // },
  {
    text: 'Password Management',
    icon: 'Password',
    subItems: [],
    routePath: '',
  },
];


export const ICON_MAP: Record<string, JSX.Element> = {
  Dashboard: <DashboardIcon />,
  Students: <PeopleIcon />,
  Programs: <MenuBookIcon />,
  Faculty: <SchoolIcon />,
  Settings: <SettingsIcon />,
  Assignments: <AssignmentIcon />,
  Reports: <BarChartIcon />,

  // 🎓 Student Menu Icons
  Profile: <PersonIcon />,
  Fees: <PaymentsIcon />,
  Grievances: <ReportProblemIcon />,
  Examinations: <AssignmentIcon />,
  Feedback: <FeedbackIcon />,
  Counselling: <SupportAgentIcon />,
  Documents: <DescriptionIcon />,
  Library: <LibraryBooksIcon />,
  Password: <LockIcon />,
};
