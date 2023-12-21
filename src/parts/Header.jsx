import React, { useState, useEffect } from "react";
import { Link, useNavigate  } from 'react-router-dom';
import "../assets/css/header.css";
import Logo from "../assets/images/logo-home.png";
import iconSearch from "../assets/icons/search.svg";
import ic_account from "../assets/icons/account.svg";
import ic_cart from "../assets/icons/cart.svg";
import ic_wishlist from "../assets/icons/wishlist.svg";
import rectangle from "../assets/icons/Rectangle.svg";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userRole, setuserRole] = useState("");
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem có thông tin đăng nhập trong localStorage không
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      setIsLoggedIn(true);
      //setFullName(userInfo.userDTO.fullName);
      setFullName(userInfo.userDTO.fullName.split(" ").pop());
      setuserRole(userInfo.userDTO.role);
    }
  }, []);

  const handleLogout = () => {
    // Xử lý logic đăng xuất
    setIsLoggedIn(false);
    setFullName("");
    setuserRole("");
    localStorage.removeItem("userInfo");
    // Chuyển hướng về trang Home sau khi đăng xuất
    // navigate.push('/');
  };

  const toggleAccountDropdown = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };

  return (
    <header className="header-container">
      <div className="container">
        <div className="header-column">
          <Link to="/">
            <img className="img-home" src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className="header-column1">
          <div className="search-container">
            <input
              type="text"
              className="search-input col-12"
              placeholder="Search..."
            />
            <span className="search-icon">
              <img src={iconSearch} alt="search" />
            </span>
          </div>
        </div>
        <div className="header-column2">
          <div className="div-access-tab">
            {isLoggedIn ? (
              <div className="account-dropdown" role="button" onClick={toggleAccountDropdown}>
                <Link><img src={ic_account} alt="" /> {fullName}
                <img className="img-space" src={rectangle} alt="" /></Link>
                {showAccountDropdown && (
                  <div className="account-dropdown-content">
                    <Link to="/profile/account">Profile</Link>
                    {isLoggedIn && userRole  === "Admin" && (
                      <Link to="http://localhost:3001/#/dashboard">Dashboard</Link>
                    )}
                    <Link to="/" onClick={handleLogout}>Logout</Link>
                  </div>
                )}
               
              </div>
            ) : (
              <div>
                <Link to="/login"><img src={ic_account} alt="" />Login
                <img className="img-space" src={rectangle} alt="" /></Link>
              </div>
            )}

            <div>
              <Link to="/cart">
                <img src={ic_cart} alt="" />
                Cart
                <img className="img-space" src={rectangle} alt="" />
              </Link>
            </div>
            <div style={{ marginRight: "20px" }}>
              <Link to="/wishlist">
                <img src={ic_wishlist} alt="" />
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;