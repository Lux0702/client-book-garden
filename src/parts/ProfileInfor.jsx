import React, { useState, useEffect } from 'react';
import logo from '../assets/images/Book-logos_black.png';
import '../assets/css/profileInfor.css';
import {Popconfirm,  Spin } from 'antd'
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
  CImage,
  CRow,
  CCol,
  CFormLabel,
} from '@coreui/react';
import { API_BASE_URL } from "../context/Constant";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProfileInfo = () => {

  const userInfoString = localStorage.getItem("userInfo");
  const userInfo = JSON.parse(userInfoString);
  const token=userInfo.accessToken;
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [spinning, setSpinning] = useState(false);

    //info uploadUser
    const [formData, setFormData] = useState({
      fullName: '',
      phone: '',
      birthday: '',
      gender: '',
      email:'',
      avatar: null,
      linkAvatar:'',
    })
    useEffect(()=>{
      if(selectedUser){
        setFormData({
          fullName: selectedUser.fullName,
          phone: selectedUser.phone,
          birthday: selectedUser.birthday,
          gender: selectedGender?selectedGender.value:selectedUser.gender,
          email: selectedUser.email,
          avatar: selectedFile,
          linkAvatar: selectedUser.avatar,
        }
        )
      }
    }, [selectedUser])
    //upload edit/show image
    const handleImageChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        // Cập nhật state selectedFile
        setSelectedFile(file)
      }
      setFormData((prevState) => ({
        ...prevState,
        avatar: file,
      }))
    }
  const handleEditImage = () => {
    const fileInput = document.getElementById('image')
    fileInput.click()
  }
  //Get profile user
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
          setSelectedUser(data.data)
          console.log(selectedUser)
        } else {
          console.error('Error fetching profile data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);
  const handleUploadUser = async () => {
    const formDataToSend = new FormData()
    for (const key in formData) {
      if(key !== 'email' && key !== 'linkAvatar'){
        formDataToSend.append(key, formData[key])
      }
    }
    console.log("Before:",formData)
    try {
      setSpinning(true);
      // Gọi API để cập nhật thông tin từ server
      const response = await fetch(`${API_BASE_URL}/user/profile/updateProfile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body:formDataToSend,
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        console.log('Profile updated successfully:', updatedData);
        toast.success(updatedData.message, {
          onClose: () => {
            setIsUserModalOpen(false); 
          },
        })
      } else {
        const updatedData = await response.json();
        console.error('Lỗi upload profile:', response.statusText);
        toast.error(updatedData.message)
    
      }
    } catch (error) {
      toast.error('Lỗi kết nối:', error);
      
    }finally {
      setSpinning(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-CA')
  }
  const genderOptions = [
    { value: "Male", label: 'Nam' },
    { value: "Female", label: 'Nữ' },
    { value: "Other", label: 'Khác' },
    // Add more address options as needed
  ];
  const handleGenderChange = (selectedOption) => {
    setSelectedGender(selectedOption);
  };
  const handleInputChange = (fieldName, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: Array.isArray(prevState[fieldName]) ? prevState[fieldName] : value,
    }))
  }
  return (
    <div className="profileInfo">
      {/* <CImage rounded src={selectedUser.avatar} alt="Profile" className="img-profile" /> */}
      <CImage           
        rounded
        src={formData.linkAvatar}
        className="img-profile"
        width={200}
        height={200}
        style={{
          objectFit: 'cover',
          border: '1px solid rgba(0, 0, 0, 0.5)',
          borderRadius: '10px',
        }}
      />
      <div className="mb-3">
        <CInputGroup className="profile-input">
          <CInputGroupText>Tên tài khoản</CInputGroupText>
          <CFormInput aria-label="Tên tài khoản" disabled value={formData.fullName} />
        </CInputGroup>
        <CInputGroup className="profile-input">
          <CInputGroupText>Email</CInputGroupText>
          <CFormInput aria-label="Email" disabled value={formData.email} />
        </CInputGroup>
        <CInputGroup className="profile-input">
          <CInputGroupText>Số điện thoại</CInputGroupText>
          <CFormInput aria-label="Phone" disabled value={formData.phone} />
        </CInputGroup>
        <CInputGroup className="profile-input">
          <CInputGroupText>Ngày sinh</CInputGroupText>
          <CFormInput aria-label="Birthday" disabled value={formatDate(formData.birthday)} />
        </CInputGroup>
        <CInputGroup className="profile-input">
          <CInputGroupText>Giới tính</CInputGroupText>
          <CFormInput aria-label="Gender" disabled value={formData? formData.gender: ''} />
        </CInputGroup>
        <CButton color="primary" onClick={() => setIsUserModalOpen(true)} classID='button-edit'>
          Sửa thông tin
        </CButton>

        {/* Thông tin chi tiết */}
        <CModal
              size="lg"
              alignment="center"
              visible={isUserModalOpen}
              onClose={() => {
                setIsUserModalOpen(false)
              }}
            >
              <CModalHeader closeButton>
                <CModalTitle>Thông tin chi tiết</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {/* Render product details here */}
                {selectedUser && (
                  <div>
                                        <div className="mb-3">
                      <CFormInput
                        type="file"
                        id="image"
                        name="image"
                        accept=".png, .jpg, .jpeg"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                      />
                    </div>
                    <p>Ảnh sản phẩm</p>
                    <div className="text-center position-relative">
                      <CImage
                        rounded
                        src={
                          selectedFile ? URL.createObjectURL(selectedFile) : selectedUser.avatar
                        }
                        width={200}
                        height={200}
                        style={{
                          objectFit: 'cover',
                          border: '1px solid rgba(0, 0, 0, 0.5)',
                          borderRadius: '10px',
                        }}
                        onChange={handleImageChange}
                      />
                      <div
                        className="position-absolute bottom-0 start-50 translate-middle-x"
                        style={{ zIndex: 1 }}
                      >
                        <CButton
                          className="mb-0 text-white"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            border: 'none',
                            borderRadius: '0 0 10px 10px',
                            width: '200px',
                            fontSize: '20px',
                            marginLeft: '0',
                          }}
                          onClick={handleEditImage}
                        >
                          Sửa
                        </CButton>
                      </div>
                    </div>
                    <p>
                    <CFormLabel htmlFor="fullName">Tên người dùng:</CFormLabel>
                      <CFormInput
                        aria-label="Tựa đề"
                        id='fullName'
                        value={formData.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    </p>
                    <div className="mb-3">
                      <CRow>
                        <CCol xs="6" className="mb-3">
                          <CFormLabel htmlFor="email">Email:</CFormLabel>
                          <CFormInput
                            disabled
                            type="text"
                            id="email"
                            name="email"
                            value={selectedUser.email || ''}
                          />
                        </CCol>
                        <CCol xs="6" className="mb-3">
                          <CFormLabel htmlFor="role">Vai trò:</CFormLabel>
                          <CFormInput
                            disabled
                            type="text"
                            id="role"
                            name="role"
                            value={selectedUser.role || ''}
                          />
                        </CCol>
                      </CRow>
                    </div>
                    <div className="mb-3">
                      <CRow>
                        <CCol xs="6" className="mb-3">
                          <CFormLabel htmlFor="phone">Số điện thoại:</CFormLabel>
                          <CFormInput
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </CCol>
                        <CCol xs="6" className="mb-3">
                          <CFormLabel htmlFor="price">Ngày sinh:</CFormLabel>
                          <CFormInput
                            type="date"
                            id="birthday"
                            name="birthday"
                            value={formData.birthday? formatDate(formData.birthday):formatDate('2023-01-01') }
                            onChange={(e) => handleInputChange('birthday', e.target.value)}
                          />
                        </CCol>
                      </CRow>
                    </div>
                    <div className="mb-3">
                      <CRow>
                        <CCol xs="6" className="mb-3">
                          <CFormLabel htmlFor="pageNumbers">Giới tính:</CFormLabel>
                          <Select
                            isClearable
                            placeholder="Chọn giới tính..."
                            onChange={handleGenderChange}
                            options={genderOptions}
                            value={formData ? (selectedGender || formData.gender) : ''}
                            //styles={customStyles}
                          />
                        </CCol>
                        <CCol xs="6" className="mb-3">
                          <CFormLabel htmlFor="publisher">Điểm tích lũy:</CFormLabel>
                          <CFormInput
                            disabled
                            type="number"
                            id="points"
                            name="points"
                            value={selectedUser.points}
                          />
                        </CCol>
                      </CRow>
                    </div>
                  </div>
                )}
              </CModalBody>

              <CModalFooter>
                <CButton
                  color="danger"
                  onClick={() => {
                    handleUploadUser()
                  }}
                >
                  Lưu
                </CButton>
              </CModalFooter>
        </CModal>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />  
      <Spin spinning={spinning} fullscreen />

    </div>
  );
};

export default ProfileInfo;
