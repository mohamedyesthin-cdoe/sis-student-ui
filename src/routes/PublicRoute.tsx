// const PublicRoute = ({ children }: { children: ReactNode }) => {
//   const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
//   return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
// };


import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getValue } from "../utils/localStorageUtil";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = getValue('ACCESS_TOKEN_KEY')

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;
