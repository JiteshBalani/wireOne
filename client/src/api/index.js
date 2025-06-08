import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: 'https://farelofic.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});