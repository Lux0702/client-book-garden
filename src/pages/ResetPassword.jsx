import React, { useRef, useState } from 'react';
import Footer from "../parts/Footer";
import '../assets/css/forgotPassword.css'
import Logo from "../assets/images/logo-home.png"
import arrow from "../assets/icons/arrow.svg"

const ForgotPassword = () =>{
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handleResetPassword = () => {
      // Xử lý logic đăng nhập ở đây
     
    };
    return(
        <div>
            <div className='forgotPass-header'>
                <img className="img-home" src={Logo} alt="Logo"/>
                <h2>Đặt lại mật khẩu</h2>
            </div>
            <div className='forgotPass'>
            <div className="forgotPass-container">
                <h1 style={{textAlign:'center'}}>Đặt lại mật khẩu</h1>
                <form>
                <label>
                    Mật khẩu:
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <label>
                    Nhập lại mật khẩu:
                    <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                <br/>
                <button type="button" onClick={handleResetPassword}> Xác nhận</button>
                </form>
            </div>
            </div>
            <Footer/>

        </div>
    );
}
export default ForgotPassword;