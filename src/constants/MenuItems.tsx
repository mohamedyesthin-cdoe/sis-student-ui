import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import type { JSX } from 'react';

interface MenuItem {
  text: string;
  icon: string;
  routePath?: string;
  subItems: {
    text: string;
    routePath: string;
  }[];
}

export const MENU_ITEMS: MenuItem[] = [
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

export const ICON_MAP: Record<string, JSX.Element> = {
  Dashboard: <DashboardIcon />,
  School: <SchoolIcon />,
  Settings: <SettingsIcon />,
  Students: <PeopleIcon />,
  Faculty: <SchoolIcon />,     
  Programs: <MenuBookIcon />,    
  Assignments: <AssignmentIcon />,
  Reports: <BarChartIcon />,
};
