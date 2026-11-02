
import axiosInstance from "../api/axiosInstance";

const getAllNotifications = async () => {
  const response = await axiosInstance.get(
    "/notifications/get-all-notification"//GET request pampisthundi.
  );

  return response.data;
};

const markNotificationAsRead = async (id) => {
  const response = await axiosInstance.put(
    `/notifications/update-notification-status/${id}`//PUT request pampisthundi.
  );

  return response.data;
};

export {
  getAllNotifications,
  markNotificationAsRead,
};
