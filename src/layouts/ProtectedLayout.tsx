import { Outlet } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

export default ProtectedLayout;
