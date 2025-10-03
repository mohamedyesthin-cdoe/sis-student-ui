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
  const isAuthenticated = getValue('ACCESS_TOKEN_KEY');

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
      <Route
        path="/login"
        element={<PublicRoute><LoginPage /></PublicRoute>}
      />

      <Route element={<ProtectedLayout />}>
        <Route element={<DashboardLayout />}>
          {renderRoutes(routesConfig)}
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
