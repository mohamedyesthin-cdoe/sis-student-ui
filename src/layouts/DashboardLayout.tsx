import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/SideBar";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Breadcrumb from "../constants/Breadcrumb";
import { useGlobalError } from "../context/ErrorContext";
import CardComponent from "../components/card/Card";
import { ConnectionLostUI } from "../components/card/errorUi/connectionlost";

export default function DashboardLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { error, clearError } = useGlobalError();
  console.log('error.type', error.type);


  // ✅ Clear stale error when layout loads
  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleHamburgerClick = () => {
    if (isMobile) {
      setSidebarDrawerOpen(true);
    } else {
      setSidebarVisible((prev) => !prev);
    }
  };

  return (
    <Box className="flex h-screen bg-[#FBFBFD]">
      {/* Sidebar */}
      {isMobile ? (
        <Sidebar
          isDrawer
          open={sidebarDrawerOpen}
          onClose={() => setSidebarDrawerOpen(false)}
          isSidebarVisible
          setSidebarVisible={setSidebarVisible}
        />
      ) : (
        <Box
          className={`transition-width duration-300 bg-white overflow-hidden ${sidebarVisible ? "w-64" : "w-15"
            }`}
        >
          <Sidebar
            isSidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
            onClose={() => setSidebarVisible(false)}
          />
        </Box>
      )}

      {/* Main Content */}
      <Box className="flex-1 flex flex-col transition-all duration-300">
        <Navbar onHamburgerClick={handleHamburgerClick} />
        <Breadcrumb />

        <main className="px-2 lg:px-6 xl:mx-6 py-2 overflow-auto">
          {/* 🚨 Replace page UI when connection lost */}
          {error.type === "CONNECTION_LOST" ? (
            <CardComponent
              sx={{
                width: "100%",
                maxWidth: { xs: "350px", sm: "900px", md: "1300px" },
                mx: "auto",
                p: 3,
                mt: 3,
              }}
            >
              <ConnectionLostUI />
            </CardComponent>
          ) : error.type === "SERVER_ERROR" ? (
            <Outlet />
          ) : (
            <Outlet />
          )}

        </main>
      </Box>
    </Box>
  );
}
