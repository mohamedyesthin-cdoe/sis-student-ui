import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../components/notfound/NotFoundPage";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicRoute from "./PublicRoute";
import { getValue } from "../utils/localStorageUtil";
import StudentList from "../features/student/StudentList";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../features/dashboard/DashboardHome";
import StudentDetail from "../features/student/StudentDetail";

const AppRoutes = () => {
  const isAuthenticated = getValue('ACCESS_TOKEN_KEY');

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />    {/* DashboardHome page */}
          <Route path="/students" element={<StudentList />} />       {/* Students List page */}
          <Route path="/studentsdetail/:id" element={<StudentDetail />} /> {/* Students Details page */}
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>

  );
};

export default AppRoutes;
