import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/SideBar';
import Navbar from '../components/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Breadcrumb from '../constants/Breadcrumb';

export default function DashboardLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHamburgerClick = () => {
    if (isMobile) {
      setSidebarDrawerOpen(true);
    } else {
      setSidebarVisible((prev) => !prev);
    }
  };

  return (
    <Box className="flex h-screen bg-gray-100">

      {isMobile && (
        <Sidebar
          isDrawer={true}
          open={sidebarDrawerOpen}
          onClose={() => setSidebarDrawerOpen(false)}
          isSidebarVisible={true}
          setSidebarVisible={setSidebarVisible}
        />
      )}

      {!isMobile && (
        <Box
          className={`transition-width duration-300 bg-white overflow-hidden ${sidebarVisible ? 'w-64' : 'w-15'}`}
        >
          <Sidebar
            isSidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
          />
        </Box>
      )}

      <Box className="flex-1 flex flex-col transition-all duration-300">

        <Navbar onHamburgerClick={handleHamburgerClick} />
        <Breadcrumb></Breadcrumb>
        <main className="px-6 py-2 overflow-auto">
          <Outlet />
        </main>

      </Box>
    </Box>
  );
}
