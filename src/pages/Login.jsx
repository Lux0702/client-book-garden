import React, { useRef, useState, useEffect } from 'react';
import '../assets/css/login.css';
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import logo from "../assets/images/logo-home.png"
import facebook from "../assets/icons/bi_facebook.svg"
import google from "../assets/icons/flat-color-icons_google.svg"
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../context/Constant";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkToken, refreshToken } from '../utils/auth';
import {  Spin } from 'antd'
function LoginPage() {
  const [username, setUsername] = useState('');
  const [passWord, setPassword] = useState('');
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const token = checkToken();

    // Nếu có token và không cần refresh, chuyển hướng đến trang chính
    if (token) {
      navigate('/');
      console.log('Token còn hạn')
    } 
  }, [navigate]);

  const handleLogin = async () => {
    try {
      setSpinning(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, passWord }),
      });

      if (response.ok) {
        // Đăng nhập thành công, xử lý logic tiếp theo
        const Data = await response.json();
        const successMessage = Data.message || "Đăng nhập thành công.";
        console.log('Đăng nhập thành công');
        localStorage.setItem("userInfo", JSON.stringify(Data.data));
        console.log(localStorage.getItem("userInfo"));
        toast.success(successMessage);
        setTimeout(() => {
          navigate('/');
        }, 1000);
        
      } else {
        // Xử lý lỗi đăng nhập
        const Data = await response.json();
        const errorMessage = Data.message || "Đăng nhập thất bại.";
        console.log('Đăng nhập thất bại');
        toast.error(errorMessage);
        
      }
    } catch (error) {
      // Xử lý lỗi kết nối hoặc lỗi server
      console.error('Lỗi:', error);
      toast.error("Lỗi kết nối");
    }finally {
      setSpinning(false);
    }
  };
  const handleForgotPassword = async () => {
    navigate('/forgot-password')
  };
  const handleRegister = async () => {
    navigate('/register')
  };
  return (
    <div>
      <Header />
      <div className='login'>
        <img className="login-img" src={logo} alt='logo' />
        <div className="login-container">

          <h2>Login</h2>
          <form>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={passWord}
                onChange={(e) => setPassword(e.target.value)}
              /> 
            </label>
            <a href='#'  onClick={handleForgotPassword}>
              Forgot Password ?<br />
            </a>
            <a href='#'  onClick={handleRegister}>
              Do you have a account? Register now !!!<br />
            </a>
            
            <button type="button" onClick={handleLogin}>
              Login
            </button>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#798995' }}> or continue with</div>
            <div className='login-more'>
              <div className='icon-container'>
                <img src={google} alt="" />
              </div>
              <div className='icon-container'>
                <img src={facebook} alt="" />
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer/>
      <Footer />
      <Spin spinning={spinning} fullscreen />

    </div>

  );
}

export default LoginPage;