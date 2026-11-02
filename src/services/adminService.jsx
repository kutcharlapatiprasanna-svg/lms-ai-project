import axiosInstance from "../api/axiosInstance";

export const fetchAllUsers = async () => {
  const response = await axiosInstance.get(
    "/auth/get-all-user-dashboard"
  );
  return response.data;
};

export const updateRole = async (payload) => {
  const response = await axiosInstance.put(
    "/auth/update-user-roles",
    payload
  );
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(
    `/auth/delete-user/${id}`
  );
  return response.data;
};