import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../redux/Store"; 
import { getValue } from "../utils/localStorageUtil";
 // Make sure this points to your store's root type

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // const isAuthenticated = useSelector(
  //   (state: RootState) => state.auth.isAuthenticated
  // );
  const isAuthenticated = getValue('ACCESS_TOKEN_KEY')

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
