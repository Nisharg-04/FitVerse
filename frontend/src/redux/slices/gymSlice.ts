import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL;


export interface Gym {
  _id: string;
  name: string;
  addressLine: string;
  city: string;
  state: string;
  contactNumber: string;
  contactEmail: string;
  perHourPrice: number;
  features: string;
  latitude: number;
  longitude: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface GymState {
  gyms: Gym[];
  currentGym: Gym | null;
  loading: boolean;
  error: string | null;
}

const initialState: GymState = {
  gyms: [],
  currentGym: null,
  loading: false,
  error: null,
};

export const addGym = createAsyncThunk(
  "gym/addGym",
  async (formData: FormData) => {
  const response = await axios.post(`${API_URL}/gym/add-gym`, formData, {
                withCredentials: true
            });
            return response.data;
  }
);

export const fetchGyms = createAsyncThunk(
  "gym/fetchGyms",
  async () => {
    const response = await axios.get("/api/v1/gyms");
    return response.data.data;
  }
);

const gymSlice = createSlice({
  name: "gym",
  initialState,
  reducers: {
    setCurrentGym: (state, action) => {
      state.currentGym = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addGym.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGym.fulfilled, (state, action) => {
        state.loading = false;
        state.gyms.push(action.payload);
      })
      .addCase(addGym.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add gym";
      })
      .addCase(fetchGyms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGyms.fulfilled, (state, action) => {
        state.loading = false;
        state.gyms = action.payload;
      })
      .addCase(fetchGyms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch gyms";
      });
  },
});

export const { setCurrentGym } = gymSlice.actions;
export default gymSlice.reducer;
