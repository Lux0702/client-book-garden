// AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from '../pages/Register'
import ProductDetail from '../pages/ProductDetail'
import Order from '../pages/Order'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Cart from "../pages/Cart";
import OTPInput from "../pages/SendOTP"
import DashboardPage from "../Admin/dashboard"
import ProfilePage from "../pages/Profile"
import ProfileInfor from "../parts/ProfileInfor"
import PrivateRoute from "./PrivateRouter"; 
import Product from "../pages/Product"
import OTP from "../pages/OTP";
import Changepassword from "../pages/ChangePassword";
import HistoryOrder from "../parts/HistoryOrder";
const AppRouter = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/book-detail/:id" element={<ProductDetail />} />
      <Route path="/book" element={<Product />} />
      <Route path="/email/verify" element={<OTPInputWrapper />} />
      {/* Use PrivateRoute with the "element" prop */}
      <Route path="order"  element={ <PrivateRoute><Order /></PrivateRoute>}  />
      <Route path="cart"  element={ <PrivateRoute><Cart /></PrivateRoute>}  />
      <Route path="reset-password"  element={ <PrivateRoute><ResetPassword /></PrivateRoute>}  />
      <Route path="dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>}>
        <Route path="account" element={<ProfileInfor />} />
        <Route path="address" element={<div>Thông tin địa chỉ</div>} />
        <Route path="changepassword" element={<Changepassword/>} />
        <Route path="history" element={<HistoryOrder/>} />
      </Route>
      <Route path="*" element={<p>There's nothing here: 404!</p>} />
      <Route path="/otp" element={<OTP/>} />
    </Routes>
  </Router>
  );
};

const OTPInputWrapper = () => {
  const { email } = useParams();

  return <OTPInput email={email} />;
};

export default AppRouter;
