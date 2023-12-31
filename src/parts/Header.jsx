import React, { useState, useEffect } from "react";
import { Link, useNavigate  } from 'react-router-dom';
import "../assets/css/header.css";
import Logo from "../assets/images/logo-home.png";
import iconSearch from "../assets/icons/search.svg";
import ic_account from "../assets/icons/account.svg";
import ic_cart from "../assets/icons/cart.svg";
import ic_wishlist from "../assets/icons/wishlist.svg";
import rectangle from "../assets/icons/Rectangle.svg";
import { API_BASE_URL, DASHBOARD } from "../context/Constant";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userRole, setuserRole] = useState("");
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState("");
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo = JSON.parse(userInfoString);
  const token=userInfo?userInfo.accessToken:"";
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const currentPath = window.location.pathname;

    // Xác định trang và điều hướng đến trang tương ứng
    let targetPath;
    if (currentPath === '/wishlist') {
      targetPath = `/wishlist?search=${searchTerm}`;
    } else {
      targetPath = `/book-list?search=${searchTerm}`;
    }
  
    // Chuyển hướng đến trang
    navigate(targetPath);
  };
  useEffect(() => {
    // Kiểm tra xem có thông tin đăng nhập trong localStorage không
    if (userInfo) {
      setIsLoggedIn(true);
      //setFullName(userInfo.userDTO.fullName);
      // setFullName(userProfile.fullName.split(" ").pop());
      const userString =localStorage.getItem('user')
      const user = JSON.parse(userString)
      console.log(user)
      setUserProfile(user)
    }
  }, []);

  const handleLogout = () => {
    // Xử lý logic đăng xuất
    setIsLoggedIn(false);
    setFullName("");
    setuserRole("");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("user");
    // Chuyển hướng về trang Home sau khi đăng xuất
    // navigate.push('/');
  };

  const toggleAccountDropdown = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };
  //get user profile
  useEffect(() => {
    // Gọi API để lấy thông tin từ server
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });

        if (response.ok) {
          const user = await response.json();
          localStorage.setItem('user', JSON.stringify(user.data));
          console.log(userProfile)
        } else {
          console.error('Error fetching profile data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);
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
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleInputChange}
            />
            <span className="search-icon" onClick={handleSearchSubmit}>
              <img src={iconSearch} alt="search"  />
            </span>
          </div>
        </div>
        <div className="header-column2">
          <div className="div-access-tab">
            {isLoggedIn ? (
              <div className="account-dropdown" role="button" onClick={toggleAccountDropdown}>
                <Link><img src={ic_account} alt="" /> {userProfile.fullName.split(" ").pop()}
                {console.log(userProfile.fullName)}
                <img className="img-space" src={rectangle} alt="" /></Link>
                {showAccountDropdown && (
                  <div className="account-dropdown-content">
                    <Link to="/post/my-post">Forum</Link>
                    <Link to="/profile/account">Profile</Link>
                    {isLoggedIn && userProfile.role  === "Admin" && (
                      <Link to={`${DASHBOARD}/login`}>Dashboard</Link>
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