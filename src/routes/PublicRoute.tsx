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

  if (!token) return <>{children}</>;

  // ✅ Role-based redirect
  if (rollid === 1) return <Navigate to="/dashboard" />;
  if (rollid === 2) return <Navigate to={`/students/detail/${student_id}`} />;

  return <Navigate to="/unauthorized" />;
};

export default PublicRoute;
