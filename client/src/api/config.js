import { axiosInstance } from "./index";

// Get all pricing configurations
export const getAllConfigs = async () => {
  try {
    const response = await axiosInstance.get('api/configs/existing-configs');
    return response.data;
  } catch (error) {
    console.error('Error fetching configs:', error);
    throw error;
  }
};

// Get single pricing configuration by ID
export const getConfigById = async (id) => {
  try {
    const response = await axiosInstance.get(`api/configs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
};

// Create new pricing configuration
export const createConfig = async (configData) => {
  try {
    const response = await axiosInstance.post('api/configs/new-config', configData);
    return response.data;
  } catch (error) {
    console.error('Error creating config:', error);
    throw error;
  }
};

// Update existing pricing configuration
export const updateConfig = async (id, configData) => {
  try {
    const response = await axiosInstance.put(`api/configs/update-config/${id}`, configData);
    return response.data;
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
};

// Delete pricing configuration
export const deleteConfig = async (id) => {
  try {
    const response = await axiosInstance.delete(`api/configs/delete-config/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting config:', error);
    throw error;
  }
};

// Toggle active status of configuration
export const toggleActiveConfig = async (id) => {
  try {
    const response = await axiosInstance.patch(`api/configs/${id}/toggle-active`);
    return response.data;
  } catch (error) {
    console.error('Error toggling active status:', error);
    throw error;
  }
};