// Advertisement API utility functions
// This file contains all the API calls for advertisement management

export interface Advertisement {
  _id: string;
  title: string;
  link: string;
  description: string;
  advertisementName: string;
  contactEmail: string;
  validUpTo: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdvertisementData {
  title: string;
  link: string;
  description: string;
  advertisementName: string;
  contactEmail: string;
  validUpTo: string;
  image: File | null;
}

export interface UpdateAdvertisementData {
  title: string;
  image: File | null;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

/**
 * Create a new advertisement
 * POST /api/advertisement/createAdvertisement
 */
export const createAdvertisement = async (data: CreateAdvertisementData): Promise<Advertisement> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('link', data.link);
  formData.append('description', data.description);
  formData.append('advertisementName', data.advertisementName);
  formData.append('contactEmail', data.contactEmail);
  formData.append('validUpTo', data.validUpTo);
  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await fetch(`${BASE_URL}/api/advertisement/createAdvertisement`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create advertisement');
  }

  const result = await response.json();
  return result.data || result;
};

/**
 * Update an existing advertisement
 * PUT /api/advertisement/updateAdvertisement/:id
 */
export const updateAdvertisement = async (
  id: string, 
  data: UpdateAdvertisementData
): Promise<Advertisement> => {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await fetch(`${BASE_URL}/api/advertisement/updateAdvertisement/${id}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update advertisement');
  }

  const result = await response.json();
  return result.data || result;
};

/**
 * Delete an advertisement
 * DELETE /api/advertisement/deleteAdvertisement/:id
 */
export const deleteAdvertisement = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/advertisement/deleteAdvertisement/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete advertisement');
  }
};

/**
 * Fetch user's advertisements
 * GET /api/advertisement/getMyAdvertisements
 */
export const fetchMyAdvertisements = async (): Promise<Advertisement[]> => {
  const response = await fetch(`${BASE_URL}/api/advertisement/getMyAdvertisements`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch advertisements');
  }

  const result = await response.json();
  return result.data || [];
};

/**
 * Fetch a random advertisement for display
 * GET /api/advertisement/getRandomAdvertisement
 */
export const fetchRandomAdvertisement = async (): Promise<Advertisement> => {
  const response = await fetch(`${BASE_URL}/api/advertisement/getRandomAdvertisement`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch random advertisement');
  }

  const result = await response.json();
  return result.data || result;
};

/**
 * Toggle advertisement active status
 * PUT /api/advertisement/toggleStatus/:id
 */
export const toggleAdvertisementStatus = async (id: string): Promise<Advertisement> => {
  const response = await fetch(`${BASE_URL}/api/advertisement/toggleStatus/${id}`, {
    method: 'PUT',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to toggle advertisement status');
  }

  const result = await response.json();
  return result.data || result;
};

/**
 * Get advertisement analytics/statistics
 * GET /api/advertisement/getAnalytics/:id
 */
export const getAdvertisementAnalytics = async (id: string): Promise<object> => {
  const response = await fetch(`${BASE_URL}/api/advertisement/getAnalytics/${id}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch advertisement analytics');
  }

  const result = await response.json();
  return result.data || result;
};