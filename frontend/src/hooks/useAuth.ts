import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setUser, logout as logoutAction, loginUser, getCurrentUser } from '@/redux/slices/authSlice.ts';
import { useToast } from './use-toast';
import axios from '@/lib/axios';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);



  const handleLogout = useCallback(async () => {
    try {
    //   await axios.post('/user/logout', {}, { withCredentials: true });
      await dispatch(logoutAction());
      
      toast({
        title: "Logged out successfully",
        description: "See you again!",
        variant: "default"
      });

      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "Something went wrong.",
        variant: "destructive"
      });
      
      // Force logout on frontend even if API call fails
      dispatch(logoutAction());
    }
  }, [dispatch, navigate, toast]);

  // Check auth status on mount using cookie-based auth
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // The cookie will be automatically sent with the request
        const result = await dispatch(getCurrentUser());
        console.log("result", result.payload.data);
        if (result.payload.data) {
          dispatch(setUser(result.payload.data));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        dispatch(logoutAction());
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    loading,

    logout: handleLogout
  };
};
