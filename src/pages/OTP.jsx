import React from 'react';
import Footer from "../parts/Footer";
import Header from '../parts/Header';
import '../routers/router.css'
const OTP = () => {

  return (
    <div>
      <Header/>
      <div className='otp-page'>
            <p >OTP đã được gửi. Vui lòng kiểm tra Email
              <br/>
              <a href="/" >Trở về trang chủ</a>
            </p>
      </div>
      <Footer/>
    </div>
  );
}

export default OTP;
