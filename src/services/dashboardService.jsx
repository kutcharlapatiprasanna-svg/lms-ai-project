
import axiosInstance from "../api/axiosInstance";

export const dashboardService = {
  async getAllUsers() {
    const response = await axiosInstance.get(
      "/auth/get-all-user-dashboard"
    );

    return response.data;
  },
};
