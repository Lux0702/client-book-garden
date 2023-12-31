import React, { useState } from 'react';
import '../assets/css/register.css';
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import logo from "../assets/images/logo-home.png"
import facebook from "../assets/icons/bi_facebook.svg"
import google from "../assets/icons/flat-color-icons_google.svg"
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from "../context/Constant";

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [passWord, setPassword] = useState("");
  const [confirmPassWord, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({}); // State để lưu thông báo lỗi
  const navigate = useNavigate();

  const registerUrl =`${API_BASE_URL}/auth/register`;
  const validateForm = () => {
    // Kiểm tra các trường dữ liệu và cập nhật thông báo lỗi
    const newErrors = {};
  
    if (!fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }
  
    if (!phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    }
  
    if (!email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
  
    if (!passWord.trim()) {
      newErrors.password = "Please enter your password.";
    }
  
    if (!confirmPassWord.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (passWord.trim() !== confirmPassWord.trim()) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
  
    setErrors(newErrors);
  
    // Kiểm tra xem có lỗi hay không
    return Object.keys(newErrors).length === 0;
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify({
      fullName,
      phone,
      email,
      passWord,
      confirmPassWord
    }))
    // Kiểm tra và validate trước khi chuyển hướng
    if (validateForm()) {
      try {
        const response = await fetch(registerUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
         
          body: JSON.stringify({
            fullName,
            email,
            phone,
            passWord,
            confirmPassWord,
          }),
        });

        if (response.ok) {
          // Đăng ký thành công
          const Data = await response.json();
          const successMessage = Data.message || "Registration failed. Please try again.";
          console.error("Registration success:", Data);
          toast.success(successMessage); // Hiển thị thông báo thành công
          setTimeout(() => {
            navigate('/email/verify');
          }, 1000); // Chuyển hướng đến trang OTP
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.message || "Registration failed. Please try again.";
          console.error("Registration failed:", errorData);
          toast.error(errorMessage); // Hiển thị thông báo lỗi từ API
        }
      } catch (error) {
        console.error("Error during registration:", error);
        toast.error(error); // Hiển thị thông báo lỗi
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="register-container">
        <div className="row-container">
          <form className="input-container" onSubmit={handleRegister}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <p className="error-message">{errors.fullName}</p>}

            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={passWord}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassWord}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

            <button style={{ borderRadius: '10px', width: '100px' }} type="submit">Register</button>
          </form>
          
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default RegisterPage;
