import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import '../assets/css/sendOTP.css'
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../context/Constant";
const OTPInput = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [resendOTPStatus, setResendOTPStatus] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailParam = searchParams.get("email");
  const navigate = useNavigate();

  const sendOTPUrl = `${API_BASE_URL}/auth/send-register-otp`;
  const verifyOTPUrl =`${API_BASE_URL}/auth/verify-OTP`;
  const handleInputChange = (index, value) => {
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });
  };

  const focusNextInput = (index) => {
    requestAnimationFrame(() => {
      const nextInput = document.querySelector(`#otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    });
  };
  //gửi lại OTP
  const handleResendOTP = async () => {
    try {
      // Gọi API để gửi lại mã OTP
      const response = await fetch(sendOTPUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
  
      if (response.ok) {
        // Cập nhật trạng thái của nút "Gửi lại mã OTP"
        setResendOTPStatus(true);
        // Đặt lại giá trị của các input về rỗng
        setOtp(['', '', '', '', '', '']);
        // Hiển thị thông báo thành công
        toast.success("OTP resent successfully.");
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

  const handleConfirm = async () => {
    console.log(JSON.stringify({
      otp,
      email
    }))
    const otpCode = otp.join('');
    try {
      const response = await fetch(verifyOTPUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otpCode,
          email: email,
        }),
      });

      if (response.ok) {
        const errorSuccess = await response.json();
        const successMessage = errorSuccess.message || "Xác nhận mã OTP thành công.";
        console.error("OTP success:", errorSuccess);
        toast.error(successMessage);
        navigate('/register');
      } else {
        const errorData = await response.json();
        console.error("Xác nhận mã OTP thất bại:", errorData);
        const errorMessage = errorData.message || "Xác nhận mã OTP thất bại. Vi lòng nhập lại.";
        console.error("OTP thất bại:", errorData);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Lỗi trong quá trình xác nhận:", error);
      toast.error(error);
      //setVerificationStatus("An error occurred during OTP verification.");
    }
  };

  useEffect(() => {
    // Cập nhật giá trị email từ tham số đường dẫn
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Lấy email từ local storage khi component được mount
      const storedEmail = localStorage.getItem("registeredEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [emailParam]);

  return (
    <div>
      <Header />
      <div className="otp-container">
        <h1>Enter OTP</h1>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index + 1}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyUp={() => focusNextInput(index)}
            />
          ))}
        </div>
        <button onClick={handleConfirm}>Confirm</button>
        {verificationStatus && <p>{verificationStatus}</p>}
        <a  style={{marginTop:'10px'}} href="#" onClick={handleResendOTP}>
          Gửi lại mã OTP
        </a>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default OTPInput;