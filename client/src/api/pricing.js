import { axiosInstance } from "./index";

export const calculatePrice = async (formData) => {
  // const requestData = {
  //   distanceKms: distance,
  //   rideMinutes: time,
  //   waitingMinutes: waitingTime,
  //   rideDay: day.slice(0, 3).toLowerCase(), // "Tuesday" → "tue"
  // };
  try {
    const response = await axiosInstance.post(`api/calculate`, formData);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
