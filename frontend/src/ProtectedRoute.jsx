import React from "react";
import { useAuth } from "./context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      <Outlet />
    </>
  );
}

export default ProtectedRoute;
