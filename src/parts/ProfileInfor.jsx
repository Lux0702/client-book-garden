import React, { useState, useEffect } from 'react';
import logo from '../assets/images/Book-logos_black.png';
import '../assets/css/profileInfor.css';
import {
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';
import { API_BASE_URL } from "../context/Constant";

const ProfileInfo = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatar:'',
    birthday: '',
    gender: '',
  });
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo = JSON.parse(userInfoString);
  const token=userInfo.accessToken;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
          const data = await response.json();
          setProfileData({
            fullName: data.data.fullName,
            email: data.data.email,
            phone: data.data.phone,
            avatar: data.data.avatar,
            birthday: data.data.birthday,
            gender: data.data.gender,
          });
        } else {
          console.error('Error fetching profile data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []); // Dependency array là rỗng để đảm bảo useEffect chỉ chạy một lần sau khi component được mount
  const handleSaveChanges = async () => {
    try {
      // Gọi API để cập nhật thông tin từ server
      const response = await fetch(`${API_BASE_URL}/user/profile/updateProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          fullName: profileData.fullName, // Dữ liệu mới cần cập nhật
          email: profileData.email,
          phone: profileData.phone,
          birthday: profileData.birthday,
          gender: profileData.gender,
          // Thêm các trường khác tương tự
        }),
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        console.log('Profile updated successfully:', updatedData);
  
        // Thực hiện các bước cần thiết nếu cập nhật thành công
        // Ví dụ: hiển thị thông báo, đóng modal, làm mới dữ liệu, vv.
        
        setIsEditModalOpen(false); // Đóng modal sau khi cập nhật thành công
      } else {
        console.error('Error updating profile:', response.statusText);
        // Xử lý khi có lỗi từ API
        // Ví dụ: hiển thị thông báo lỗi
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Xử lý khi có lỗi từ fetch hoặc lỗi không xác định
      // Ví dụ: hiển thị thông báo lỗi
    }
  };
  return (
    <div className="profileInfo">
      <img src={profileData.avatar} alt="Profile" className="img-profile" />
      <div className="mb-3">
        <CInputGroup className="profile-input">
          <CInputGroupText>Tên tài khoản</CInputGroupText>
          <CFormInput aria-label="Tên tài khoản" disabled value={profileData.fullName} />
        </CInputGroup>
        <CInputGroup className="profile-input">
          <CInputGroupText>Email</CInputGroupText>
          <CFormInput aria-label="Email" disabled value={profileData.email} />
        </CInputGroup>
        <CInputGroup className="profile-input">
          <CInputGroupText>Số điện thoại</CInputGroupText>
          <CFormInput aria-label="Phone" disabled value={profileData.phone} />
        </CInputGroup>
        <CInputGroup className="profile-input">
          <CInputGroupText>Ngày sinh</CInputGroupText>
          <CFormInput aria-label="Birthday" disabled value={profileData.birthday} />
        </CInputGroup>
        <CInputGroup className="profile-input">
          <CInputGroupText>Giới tính</CInputGroupText>
          <CFormInput aria-label="Gender" disabled value={profileData.gender} />
        </CInputGroup>
        <CButton color="primary" onClick={() => setIsEditModalOpen(true)} classID='button-edit'>
          Sửa thông tin
        </CButton>

        <CModal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <CModalHeader closeButton>
            <CModalTitle>Sửa thông tin</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {/* Nơi để nhập thông tin mới */}
            {/* Ví dụ: */}
            <CInputGroup className="profile-input">
              <CInputGroupText>Tên tài khoản</CInputGroupText>
              <CFormInput aria-label="Tên tài khoản" value={profileData.fullName} />
            </CInputGroup>
            {/* Tương tự cho các trường khác */}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setIsEditModalOpen(false)}>
              Đóng
            </CButton>
            <CButton color="primary" onClick={() => handleSaveChanges()}>
              Lưu thay đổi
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    </div>
  );
};

export default ProfileInfo;
