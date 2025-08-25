import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface AuthState {
  user: {
    role: string;
    [key: string]: unknown;
  } | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface RootState {
  auth: AuthState;
}

const PublicOnlyRoute = () => {
  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  // If authenticated, redirect based on user role or to the page they came from
  if (isAuthenticated && user) {
    // If there's a specific route the user was trying to access, redirect there
    if (location.state?.from?.pathname) {
      return <Navigate to={location.state.from.pathname} replace />;
    }

    // Otherwise redirect based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "owner") {
      return <Navigate to="/gymdashboard" replace />;
    } else {
      // Default for regular users
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
