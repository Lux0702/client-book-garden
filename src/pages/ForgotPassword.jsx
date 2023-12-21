import React, { useState, useRef, useEffect } from 'react';
import Footer from "../parts/Footer";
import '../assets/css/forgotPassword.css'
import logo_home from "../assets/images/brand.png"
import arrow from "../assets/icons/arrow.svg"
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../context/Constant";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const sendOTPUrl = `${API_BASE_URL}/auth/send-forgot-password-otp`;
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      // Gọi API để gửi lại mã OTP
      const response = await fetch(sendOTPUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Truyền giá trị email từ state vào đây
        }),
      });

      if (response.ok) {
        toast.success("OTP resent successfully.");
        setTimeout(() => {
            navigate('/otp');
          }, 1000);
      } else {
        // Xử lý khi gửi lại mã OTP thất bại
        const errorData = await response.json();
        console.error("Error during resending OTP:", errorData);
        const errorMessage = errorData.message || "An error occurred while resending OTP. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error during resending OTP:", error);
      toast.error("An error occurred while resending OTP. Please try again.");
    }
  };

  const handleReturn = () => {
    navigate('/login');
  };

  // Xử lý sự kiện thay đổi giá trị của trường email
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div>
      <div className='forgotPass-header'>
        <img className="img-home-reset" src={logo_home} alt="Logo"/>
        <h2>Quên mật khẩu</h2>
      </div>
      <div className='forgotPass'>
        <div className="forgotPass-container">
          <h2>
            <img className="img-arrow" src={arrow} alt="arrow" onClick={handleReturn}/>
            Quên mật khẩu
          </h2>
          <form>
            <input type="text" placeholder='Nhập địa chỉ Email' value={email} onChange={handleEmailChange} required />
            <br/><br/>
            <button type="button" onClick={handleForgotPassword}> Continue</button>
          </form>
        </div>
      </div>
      <Footer/>
      <ToastContainer/>
    </div>
  );
}

export default ForgotPassword;
