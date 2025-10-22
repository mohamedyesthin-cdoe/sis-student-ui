import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../components/notfound/NotFoundPage";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicRoute from "./PublicRoute";
import { routesConfig } from "../constants/Routeconfig";
import DashboardLayout from "../layouts/DashboardLayout";

// Utility function to render nested routes
export const renderRoutes = (routes: any[]) =>
  routes.map(({ path, element, children }) =>
    children ? (
      <Route key={path} path={path} element={element}>
        {renderRoutes(children)} {/* Recursively render child routes */}
      </Route>
    ) : (
      <Route key={path} path={path} element={element} />
    )
  );


const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

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

      {/* Catch-All for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
