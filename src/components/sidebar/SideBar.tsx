import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  Tooltip,
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

  const handleSelect = (itemText, routePath, hasChildren, parentText = '') => {
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
    <div
      className={`h-full bg-white flex flex-col border-r border-gray-200 transition-all duration-300 ${isSidebarVisible ? 'w-64' : 'w-16'
        }`}
    >
      <div className={`text-center border-b border-gray-200 ${isSidebarVisible ? 'p-3' : 'p-1'}`}>
        {isSidebarVisible ? (
          <img src={logo} alt="Logo" className="mx-auto object-contain h-12" />
        ) : (
          <img src={logo2} alt="Logo Small" className="mx-auto object-contain h-12" />
        )}
      </div>

      <List component="nav" className="flex-1 px-2 py-3">
        {STATIC_MENU_ITEMS.map((item) => {
          const hasChildren = item.subItems.length > 0;
          const isOpen = openItems[item.text] || false;
          const isActive = selectedItem === item.text || selectedParent === item.text;

          return (
            <div key={item.text}>
              {!isSidebarVisible ? (
                <Tooltip title={item.text} placement="right" arrow>
                  <ListItem
                    component="div"
                    onClick={() => handleSelect(item.text, item.routePath, hasChildren)}
                    sx={{
                      bgcolor: isActive ? '#105c8e' : 'transparent',
                      color: isActive ? 'white' : 'gray',
                      '&:hover': {
                        backgroundColor: '#BF2728',
                        color: 'white',
                        cursor: 'pointer',
                      },
                      fontSize: '1rem',
                      fontWeight: '500',
                      borderRadius: '8px',
                      '&:hover .MuiListItemIcon-root': { color: 'white' },
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: '0',
                      paddingRight: '0',
                      height: '48px',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        color: isActive ? 'white' : 'gray',
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
                  component="div"
                  onClick={() => handleSelect(item.text, item.routePath, hasChildren)}
                  sx={{
                    bgcolor: isActive ? '#105c8e' : 'transparent',
                    color: isActive ? 'white' : 'gray',
                    '&:hover': {
                      backgroundColor: '#BF2728',
                      color: 'white',
                      cursor: 'pointer',
                    },
                    fontSize: '1rem',
                    fontWeight: '500',
                    borderRadius: '8px',
                    '&:hover .MuiListItemIcon-root': { color: 'white' },
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    height: '48px',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      color: isActive ? 'white' : 'gray',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {ICON_MAP[item.icon]}
                  </ListItemIcon>

                  <ListItemText primary={item.text} className="pl-2" sx={{ opacity: 1 }} />

                  {hasChildren && (
                    <div className="ml-auto flex items-center">
                      {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </div>
                  )}
                </ListItem>
              )}

              {hasChildren && (
                <Collapse in={isOpen && isSidebarVisible} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem
                        key={subItem.text}
                        component="div"
                        onClick={() =>
                          handleSelect(subItem.text, subItem.routePath, false, item.text)
                        }
                        className="pl-12"
                        sx={{
                          fontSize: '0.875rem',
                          color: selectedItem === subItem.text ? '#105c8e' : '#6b7280',
                          justifyContent: 'flex-end',
                          '&:hover': {
                            backgroundColor: '#105c8e',
                            color: 'white',
                            cursor: 'pointer',
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
            </div>
          );
        })}
      </List>
    </div>
  );

  if (isDrawer) {
    return (
      <Drawer anchor="left" open={open} onClose={onClose}>
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <div
      className={`hidden md:flex transition-all duration-300 ease-in-out ${isSidebarVisible ? 'translate-x-0' : 'translate-x-0'
        }`}
    >
      {drawerContent}
    </div>
  );
}
