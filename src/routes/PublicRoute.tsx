import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getValue } from "../utils/localStorageUtil";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = getValue("ACCESS_TOKEN_KEY");
  const rollid = Number(getValue("rollid"));
  const student_id = Number(getValue("student_id"));

  // If the user is logged in, redirect based on their role
  if (token) {
    if (rollid === 1) {
      return <Navigate to="/students/list" />;
    }
    if (rollid === 2 && student_id) {
      return <Navigate to={`/students/detail`} />;
    }
    return <Navigate to="/unauthorized" />;
  }

  // If no token, render children (public routes like login)
  return <>{children}</>;
};

export default PublicRoute;
