import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../main";

const ProtectedRoute = ({ allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const verifyAuth = async () => {
      if (!role || !allowedRoles.includes(role)) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await api.get(`/api/${role}s/profile`);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
      }
    };

    verifyAuth();
  }, [role, allowedRoles]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
