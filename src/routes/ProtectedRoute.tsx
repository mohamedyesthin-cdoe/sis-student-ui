import React, { type ReactNode } from "react";
// import { Navigate, useLocation } from "react-router-dom";
import { Navigate, } from "react-router-dom";
import { getValue } from "../utils/localStorageUtil";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // const location = useLocation();
  const token = getValue("ACCESS_TOKEN_KEY");
  // const rollid = Number(getValue("rollid"));

  // If user not logged in → send to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role-based redirections
  // if (rollid === 2 && location.pathname === "/dashboard") {
  //   // Student trying to access dashboard
  //   return <Navigate to={`/students/detail`} replace />;
  // }

  // if (rollid === 1 && location.pathname.startsWith("/students/detail")) {
  //   // Admin trying to access student detail directly
  //   return <Navigate to="/dashboard" replace />;
  // }

  // Otherwise, allow normal access
  return <>{children}</>;
};

export default ProtectedRoute;
