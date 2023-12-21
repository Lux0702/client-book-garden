// ProfilePage.jsx
import React from 'react';
import { Route, Routes ,Outlet} from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import ProfileInfo from '../parts/ProfileInfor';
import ProfileSidebar from '../parts/ProfileSideBar';
import '../assets/css/custome-sidebar.css';
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import AppRoutes from '../routers/Router';
const ProfilePage = () => {
  return (
    <div >
        <Header/>
        
        <div className="d-flex">
            <div className="custom-sidebar">
                <ProfileSidebar />
            </div>
            <div className="content-container">
                <Outlet />
            </div>
        </div>
        
    <Footer/>
    </div>
    
  );
};

export default ProfilePage;
