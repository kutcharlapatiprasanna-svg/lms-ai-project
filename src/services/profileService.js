
import axiosInstance from "../api/axiosInstance";

// Replace this endpoint with your actual backend endpoint.

export const updateMyProfile = async (formData) => {
  const response = await axiosInstance.put(
    "/auth/update-user-info",
    formData
  );

  return response.data;
};
