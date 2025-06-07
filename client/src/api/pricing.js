import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'; // You can also use .env for this

export const calculatePrice = async ({ distance, time, waitingTime, day }) => {
  const requestData = {
    distanceKms: distance,
    rideMinutes: Math.round(time * 60),
    waitingMinutes: waitingTime,
    rideDay: day.slice(0, 3).toLowerCase(), // "Tuesday" → "tue"
  };

  const response = await axios.post(`${BASE_URL}/api/calculate`, requestData);
  return response.data;
};