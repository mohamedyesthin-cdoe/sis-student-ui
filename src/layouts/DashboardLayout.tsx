import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/SideBar';
import Navbar from '../components/navbar/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardHome from '../features/dashboard/DashboardHome';

export default function DashboardLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();

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
    <div className="flex h-screen bg-gray-100">

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
        <div
          className={`transition-width duration-300 bg-white overflow-hidden ${sidebarVisible ? 'w-64' : 'w-15'}`}
        >
          <Sidebar
            isSidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col transition-all duration-300">

        <Navbar onHamburgerClick={handleHamburgerClick} />

        <main className="p-6 overflow-auto">
          {location.pathname === '/dashboard' ? (
            <DashboardHome />
          ) : (
            <Outlet />
          )}
        </main>

      </div>
    </div>
  );
}
