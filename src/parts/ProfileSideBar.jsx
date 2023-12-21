import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import '../assets/css/custome-sidebar.css';
import { FaBook, FaUser, FaLock, FaShoppingBag } from 'react-icons/fa';
import logo from '../assets/images/Book-logos_black.png';
//import { useSidebar } from '../context/SidebarContext';
const ProfileSidebar = () => {
  //const { focusedItem } = useSidebar();


  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '400px',width:'300px' }}>
      <Sidebar
        width="300px"
      >
        <Menu>
          <img src={logo} alt="logo" className='img-bar' />
          <MenuItem>
            <Link
              to="/profile/account"
              className={`link-sideBar `}
            
            >
              <FaUser style={{ marginRight: '8px', marginBottom: '6px' }} />
              Thông tin tài khoản
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/profile/address"
              className={`link-sideBar `}
            >
              <FaBook style={{ marginRight: '8px', marginBottom: '6px' }} />
              Sổ địa chỉ
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/profile/changepassword"
              className={`link-sideBar `}
            >
              <FaLock style={{ marginRight: '8px', marginBottom: '6px' }} />
              Đổi mật khẩu
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/profile/history"
              className={`link-sideBar `}
            >
              <FaShoppingBag style={{ marginRight: '8px', marginBottom: '6px' }} />
              Đơn hàng
            </Link>
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default ProfileSidebar;
