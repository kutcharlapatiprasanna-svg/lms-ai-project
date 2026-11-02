
//import axiosInstance from "../api/axiosInstance";

import axiosInstance from "../api/axiosInstance";

export const createOrder = async (payload) => {
  const { data } = await axiosInstance.post(
    "/order/create-order",
    payload
  );

  return data;
};

export const getAllOrders = async () => {
  const { data } = await axiosInstance.get(
    "/order/get-all-order-dashboard"
  );

  return data;
};
