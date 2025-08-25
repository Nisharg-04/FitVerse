import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CompleteProfile from "./pages/auth/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import GymDashboard from "./pages/GymDashboard";
import AddNewGym from "./pages/AddNewGym";
import SelectLocation from "./pages/SelectLocation";
import GymApprovals from "./pages/admin/GymApprovals";
import AdminPanel from "./pages/admin/AdminPanel";
import GymDetails from "./pages/admin/GymDetails";
import { useState } from "react";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";
import Unauthorized from "./pages/Unauthorized";
import { LatLngExpression } from "leaflet";
import { useDispatch } from "react-redux";
import { getUser } from "./redux/slices/authSlice";
import { useEffect } from "react";

const App: React.FC = () => {
  const [selectedPosition, setSelectedPosition] =
    useState<LatLngExpression | null>(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              {/* Auth Routes (Only accessible when not logged in) */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
              </Route>

              {/* Protected Routes (Require Authentication) */}

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
                    <CompleteProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gyms"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
                    <SelectLocation
                      height={30}
                      width={70}
                      setSelectedPosition={setSelectedPosition}
                      selectedPosition={selectedPosition}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gym/:gymId"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
                    <GymDetails />
                  </ProtectedRoute>
                }
              />

              {/* Gym Owner Routes */}

              <Route
                path="/gymdashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin", "owner"]}>
                    <GymDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-new-gym"
                element={
                  <ProtectedRoute allowedRoles={["admin", "owner"]}>
                    <AddNewGym />
                  </ProtectedRoute>
                }
              />
              {/* Admin Only Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/gym-approvals"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <GymApprovals />
                  </ProtectedRoute>
                }
              />

              {/* Error Pages */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
