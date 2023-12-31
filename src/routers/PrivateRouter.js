// PrivateRoute.js
import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("userInfo");
  console.log("private là:",user)
  const navigate = useNavigate();
  const token =JSON.parse(user);
  if (!token) {
    setTimeout(() => {
      alert("Vui lòng đăng nhập");
    }, 1000);
  const currentPath = window.location.pathname;
    
    // Redirect to the login page or any other page you prefer
    const redirectPath = currentPath.startsWith("/post") ? "/post/login" : "/login";

    // Redirect to the login page or any other page you prefer
    return <Navigate to={redirectPath} />;
  }
  return children;
};

export default PrivateRoute;
