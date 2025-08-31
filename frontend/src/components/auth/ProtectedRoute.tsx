import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    toast("Please log in to access this page");
    return <Navigate to="/login" replace />;
  }
  console.log("User role:", user.role);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast("You do not have permission to access this page");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
