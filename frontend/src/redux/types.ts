export interface RootState {
  auth: {
    user: any; // Replace with proper user type
  };
  gym: {
    gyms: any[]; // Replace with proper gym type
    loading: boolean;
    error: string | null;
  };
  // Add other slices as needed
}
