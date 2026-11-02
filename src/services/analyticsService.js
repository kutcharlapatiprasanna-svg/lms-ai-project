import axios from 'axios';
import React from 'react';
import axiosInstance from '../api/axiosInstance';

const  getUsersAnalytics = async () => {
    const response = await axiosInstance.get(
        "analytics/get-users-analytics"
    );

   return response.data;
}
   //course
   const getCourseAnalytics = async ()=>{

    const response = await axiosInstance.get(
        "/analytics/get-course-analytics"
    );

    return response.data
   } 
   
  

const getOrderAnalytics = async () => {
  const response = await axiosInstance.get(
    "/analytics/get-order-analytics"
  );

  return response.data;
}


export {
    getUsersAnalytics,
    getCourseAnalytics,
    getOrderAnalytics,
};
