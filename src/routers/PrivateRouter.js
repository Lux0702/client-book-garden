// PrivateRoute.js
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({ children }) => {
  const token = window.localStorage.getItem("userInfo");

  if (!token) {
    setTimeout(() => {
      toast.info("Vui lòng đăng nhập");
    }, 2000);

    
    // Redirect to the login page or any other page you prefer
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
