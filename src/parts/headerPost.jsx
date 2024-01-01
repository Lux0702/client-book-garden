import React , {useState, useEffect,useMemo} from 'react';
import '../assets/css/post.css'
import logobrand from "../assets/images/brand.png";
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space,Dropdown  } from 'antd';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CButtonGroup,
    CAvatar,
    CImage,
    CCardFooter,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
  } from '@coreui/react'
import Footer from '../parts/Footer';
import {  Popover  } from 'antd';
import { Avatar } from 'antd';
import PostSidebar from '../parts/postSideBar';
import { Outlet,Link, useNavigate } from 'react-router-dom';
import avatar from "../assets/images/avatar.png"
import { API_BASE_URL } from "../context/Constant";

const { Search } = Input;
const HeaderPost = ()=>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [fullName, setFullName] = useState("");
    const[avatarUser, setAvatar]= useState("");
    const [userRole, setuserRole] = useState("");
    const [userProfile, setUserProfile] = useState("");
    const navigate = useNavigate();
   <AudioOutlined
    style={{
        fontSize: 16,
        color: '#1677ff',
    }}
    />
    const handleLogout = () => {
        // Xử lý logic đăng xuất
        setIsLoggedIn(false);
        setFullName("");
        setuserRole("");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("user");
        // Chuyển hướng về trang Home sau khi đăng xuất
         navigate('/post/my-post');
        };
    const onSearch = (value, _e, info) => console.log(info?.source, value);
    const items = [
        {
            key: '1',
            label: (
            <Link to="/post/account" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: 'larger',margin:"auto" }} >
                Tài khoản
            </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link to="/post/my-post" onClick={handleLogout} style={{ textDecoration: 'none', fontSize: 'larger',margin:"auto" }}>Logout</Link>
            ),
        },
        
        ];
      //get user profile
  useEffect(() => {
    // Gọi API để lấy thông tin từ server
    const userString=localStorage.getItem('userInfo');
    const userinfor = JSON.parse(localStorage.getItem("user"));
    const user = JSON.parse(userString);
    if(user){
        const token=user.accessToken;
        setIsLoggedIn(true)
        setFullName(userinfor.fullName?userinfor.fullName: " ");
        setuserRole(userinfor.role);
        setAvatar(userinfor.avatar)
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
          setUserProfile(user.data)
          headerhandle()
        } else {
          console.error('Error fetching profile data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
    }

    
  }, []); 
  const headerhandle =() =>{
    const userInfoString = localStorage.getItem("user");
  if (userProfile ) {
    const userInfo = JSON.parse(userInfoString);
    setIsLoggedIn(true);
    setFullName(userProfile.fullName || userInfo.fullName);
    setuserRole(userProfile.role || userInfo.role);
    setAvatar(userProfile.avatar || userInfo.avatar)
  }
  } 
  useEffect(() => {
    // Kiểm tra xem có thông tin đăng nhập trong localStorage không
    headerhandle()
  }, [userProfile]);  
    return(
        <body className='post-body' >
            <div className='post-header'>
                <img src={logobrand} alt=" "/>
                <div className='header-control'>
                    <Space direction="vertical">
                        <Search
                        placeholder="Tìm kiếm ..."
                        onSearch={onSearch}
                        style={{
                            width: 200,
                        }}
                        />
                    </Space>
                    {isLoggedIn ?(
                             <Dropdown
                               menu={{
                                 items,
                               }}
                               placement="bottom"
                               arrow={{
                                 pointAtCenter: true,
                               }}
                             >
                                <button className='post-button-login' >
                                    <Space wrap size={16}><Avatar  size="large" src={avatarUser} /></Space>    
                                    {fullName}
                                </button>
                             </Dropdown>
                    ): <button className='post-button-login'>
                        <Avatar size="large" src={avatar} />
                    
                    <Link to="/post/login">Login/Register</Link>
                </button>}
                     
                </div>
            </div>
        </body>
        
    )
}

export default HeaderPost