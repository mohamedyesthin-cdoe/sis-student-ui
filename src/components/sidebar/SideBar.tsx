import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  Tooltip,
  useTheme,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import logo from '../../assets/logo.png';
import logo2 from '../../assets/logo2.png';
import { useNavigate, useLocation } from 'react-router-dom';

const ICON_MAP = {
  Dashboard: <DashboardIcon />,
  School: <SchoolIcon />,
  Settings: <SettingsIcon />,
  Students: <PeopleIcon />,
  Assignments: <AssignmentIcon />,
  Reports: <BarChartIcon />,
};

const STATIC_MENU_ITEMS = [
  { text: 'Dashboard', icon: 'Dashboard', subItems: [], routePath: '/dashboard' },
  {
    text: 'Students',
    icon: 'Students',
    subItems: [
      { text: 'Student List', routePath: '/students' },
      { text: 'Courses', routePath: '/courses' },
    ],
    routePath: '',
  },
];

export default function Sidebar({
  isDrawer = false,
  open = false,
  onClose,
  isSidebarVisible = true,
  setSidebarVisible,
}) {
  const [openItems, setOpenItems] = useState({});
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const [selectedParent, setSelectedParent] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme()

  // Sync selected item and parent based on current route
  useEffect(() => {
    const path = location.pathname;

    if (path === '/dashboard') {
      setSelectedItem('Dashboard');
      setSelectedParent('');
      setOpenItems({});
    } else if (path === '/students') {
      setSelectedItem('Student List');
      setSelectedParent('Students');
      setOpenItems((prev) => ({ ...prev, Students: true }));
    } else if (path === '/courses') {
      setSelectedItem('Courses');
      setSelectedParent('Students');
      setOpenItems((prev) => ({ ...prev, Students: true }));
    }
  }, [location.pathname]);

  const handleSelect = (itemText:any, routePath:any, hasChildren:any, parentText = '') => {
    if (routePath) {
      navigate(routePath);
      setSelectedItem(itemText);
      setSelectedParent(parentText);

      if (parentText) {
        setOpenItems((prev) => ({ ...prev, [parentText]: true }));
      }

      if (isDrawer && onClose) {
        onClose();
      }
    } else if (hasChildren) {
      // If in compact mode, expand the sidebar when clicking parent item
      if (!isSidebarVisible) {
        setSidebarVisible(true);
      }

      setOpenItems((prev) => ({
        ...prev,
        [itemText]: !prev[itemText],
      }));
    }
  };



  const drawerContent = (
    <Box
      className={`h-full bg-white flex flex-col border-r border-gray-200 transition-all duration-300 ${isSidebarVisible ? 'w-64' : 'w-16'
        }`}
    >
      <Box className={`text-center border-b border-gray-200 ${isSidebarVisible ? 'p-3' : 'p-1'}`}>
        {isSidebarVisible ? (
          <img src={logo} alt="Logo" className="mx-auto object-contain h-12" />
        ) : (
          <img src={logo2} alt="Logo Small" className="mx-auto object-contain h-12" />
        )}
      </Box>

      <List component="nav" className="flex-1 px-2 py-3">
        {STATIC_MENU_ITEMS.map((item) => {
          const hasChildren = item.subItems.length > 0;
          const isOpen = openItems[item.text] || false;
          const isActive = selectedItem === item.text || selectedParent === item.text;

          return (
            <Box key={item.text}>
              {!isSidebarVisible ? (
                <Tooltip title={item.text} placement="right" arrow>
                  <ListItem
                    component={Box}
                    onClick={() => handleSelect(item.text, item.routePath, hasChildren)}
                    sx={{
                      bgcolor: isActive ? theme.palette.secondary.main : 'transparent',
                      color: isActive ? 'white' : theme.palette.text.secondary,
                      fontSize: '1rem',
                      fontWeight: 500,
                      borderRadius: '8px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: 0,
                      paddingRight: 0,
                      height: '48px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                      },
                      '&:hover .MuiListItemIcon-root': { color: 'white' },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        color: isActive ? 'white' : theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {ICON_MAP[item.icon]}
                    </ListItemIcon>
                  </ListItem>
                </Tooltip>
              ) : (
                <ListItem
                  component={Box}
                  onClick={() => handleSelect(item.text, item.routePath, hasChildren)}
                  sx={{
                    bgcolor: isActive ? theme.palette.secondary.main : 'transparent',
                    color: isActive ? 'white' : theme.palette.text.secondary,
                    fontSize: '1rem',
                    fontWeight: 500,
                    borderRadius: '8px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    height: '48px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                    },
                    '&:hover .MuiListItemIcon-root': { color: 'white' },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      color: isActive ? 'white' : theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {ICON_MAP[item.icon]}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    sx={{ pl: 2, opacity: 1 }}
                  />

                  {hasChildren && (
                    <Box style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                      {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  )}
                </ListItem>
              )}

              {hasChildren && (
                <Collapse in={isOpen && isSidebarVisible} timeout="auto" unmountOnExit>
                  <List component={Box} disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem
                        key={subItem.text}
                        component={Box}
                        onClick={() =>
                          handleSelect(subItem.text, subItem.routePath, false, item.text)
                        }
                        sx={{
                          fontSize: '0.875rem',
                          color: selectedItem === subItem.text
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                          justifyContent: 'flex-end',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                          },
                        }}
                      >
                        <ListItemText
                          primary={subItem.text}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: selectedItem === subItem.text ? 'bold' : 'normal',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>

          );
        })}
      </List>
    </Box>
  );

  if (isDrawer) {
    return (
      <Drawer anchor="left" open={open} onClose={onClose}>
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Box
      className={`hidden md:flex transition-all duration-300 ease-in-out ${isSidebarVisible ? 'translate-x-0' : 'translate-x-0'
        }`}
    >
      {drawerContent}
    </Box>
  );
}
