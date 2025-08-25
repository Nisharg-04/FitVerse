import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
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


const queryClient = new QueryClient();

const App: React.FC = () => {
  const [selectedPosition, setSelectedPosition] =
    useState<LatLngExpression | null>(null);

  return(<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
 
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
              <Route path="/gymdashboard" element={<GymDashboard />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/add-new-gym" element={<AddNewGym />} />
            <Route path="/admin/gym-approvals" element={<GymApprovals />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/gym/:gymId" element={<GymDetails />} />
            <Route path="/gyms" element={ <SelectLocation
        height={30}
        width={70}
        setSelectedPosition={setSelectedPosition}
        selectedPosition={selectedPosition}
      />} />
              
              {/* Auth routes will be handled separately */}
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
  </GoogleOAuthProvider>)
}

export default App;
