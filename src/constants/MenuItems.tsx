import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';

export const MENU_ITEMS = [
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
      { text: 'Students List', routePath: '/students' },
    ],
    routePath: '',
  },
  {
    text: 'Courses',
    icon: 'Courses',
    subItems: [
      { text: 'Courses List', routePath: '/courses' },
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

export const ICON_MAP = {
  Dashboard: <DashboardIcon />,
  School: <SchoolIcon />,
  Settings: <SettingsIcon />,
  Students: <PeopleIcon />,
  Faculty: <SchoolIcon />,     
  Courses: <MenuBookIcon />,    
  Assignments: <AssignmentIcon />,
  Reports: <BarChartIcon />,
};
