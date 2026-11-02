
import axiosInstance from "../api/axiosInstance";

const getLayout = async (type) => {
  const response = await axiosInstance.get(
    "/layout/get-layout",
    {
      params: { type },
    }
  );

  return response.data;
};

const createLayout = async (layoutData) => {
  const response = await axiosInstance.post(
    "/layout/create-layout",
    layoutData
  );

  return response.data;
};

const updateLayout = async (layoutData) => {
  const response = await axiosInstance.put(
    "/layout/update-layout",
    layoutData
  );

  return response.data;
};

export {
  getLayout,
  createLayout,
  updateLayout,
};
