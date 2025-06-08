import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: 'https://farelogic.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});