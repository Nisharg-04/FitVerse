import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface FitnessStats {
    workoutStreak: number;
    caloriesBurned: number;
    workoutsCompleted: number;
    achievementsEarned: number;
    monthlyGoalProgress: number;
    fitnessLevel: string;
    preferredWorkoutTime: string;
    currentGoals: string[];
    memberSince: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin';
    isEmailVerified: boolean;
    isProfileComplete: boolean;
    username?: string;
    bio?: string;
    fitnessStats?: FitnessStats;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    token: string | null;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create async thunks
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/user/current-user`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Failed to get user');
        }
    }
);
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/user/login`, credentials, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/user/register`, userData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateAvatar = createAsyncThunk(
    'auth/updateAvatar',
    async (formData, thunkAPI) => {
        try {
            const response = await axios.patch(
                `${API_URL}/user/update-avatar`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateFitnessProfile = createAsyncThunk(
    'auth/updateFitnessProfile',
    async (fitnessData: Partial<FitnessStats>, thunkAPI) => {
        try {
            const response = await axios.patch(
                `${API_URL}/user/update-fitness-profile`,
                fitnessData,
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getFitnessProfile = createAsyncThunk(
    'auth/getFitnessProfile',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(
                `${API_URL}/user/fitness-profile`,
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const completeProfile = createAsyncThunk(
    'auth/completeProfile',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.patch(
                `${API_URL}/user/complete-profile`,
                userData,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const refreshAccessToken = async () => {
    try {
        const res = await axios.get(`${API_URL}/user/refresh-token`, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getUser = createAsyncThunk(
    'auth/getUser',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/user/current-user`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await refreshAccessToken();
                    const retryResponse = await axios.get(`${API_URL}/user/current-user`, {
                        withCredentials: true,
                    });
                    return retryResponse.data;
                } catch (refreshError) {
                    thunkAPI.dispatch(logout());
                    return thunkAPI.rejectWithValue("Session expired. Please log in again.");
                }
            }
            return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, thunkAPI) => {
        try {
            const response = await axios.post(
                `${API_URL}/user/forgot-password`,
                email,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/user/logout`, {}, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/user/reset-password/${token}`, {
                password
            }, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        token: null,
    } as AuthState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
            state.loading = false;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Signup
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Avatar
            .addCase(updateAvatar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Complete Profile
            .addCase(completeProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(completeProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
            })
            .addCase(completeProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Current User
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
