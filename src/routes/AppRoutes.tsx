import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../components/notfound/NotFoundPage";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicRoute from "./PublicRoute";
import { getValue } from "../utils/localStorageUtil";
import DashboardLayout from "../layouts/DashboardLayout";
import { routesConfig } from "../constants/Routeconfig";

const renderRoutes = (routes: any[]) =>
  routes.map(({ path, element, children }) =>
    children ? (
      <Route key={path} path={path} element={element}>
        {renderRoutes(children)}
      </Route>
    ) : (
      <Route key={path} path={path} element={element} />
    )
  );

const AppRoutes = () => {
  const token = getValue("ACCESS_TOKEN_KEY");
  const rollid = Number(getValue("rollid"));
  const student_id = Number(getValue("student_id"));

  // ✅ Compute default redirect based on authentication + role
  const getDefaultRoute = () => {
    if (!token) return "/login";
    if (rollid === 1) return "/dashboard";
    if (rollid === 2) return `/students/detail${student_id}"`;
    return "/unauthorized";
  };

  return (
    <Routes>
      {/* Root Redirect */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} />} />

      {/* Public Route (Login) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route element={<DashboardLayout />}>
          {renderRoutes(routesConfig)}
        </Route>
      </Route>

      {/* Catch-All 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
