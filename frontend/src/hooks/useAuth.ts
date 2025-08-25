import { useEffect, useCallback, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setUser, logoutUser } from '../redux/slices/authSlice';

import { useToast } from './use-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  const login = (userData) => {
        dispatch(setUser(userData));
    };
  const handleLogout = async () => {
        await dispatch(logoutUser());
        await dispatch(resetCart());

        toast.success("Logged out successfully");
        dispatch(setUser(null));
    };
  // Check auth status only once on mount using cookie-based auth

  return {
    isAuthenticated,
    user,
    logout: handleLogout,
  loading
  };
};
