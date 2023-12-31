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
import { Outlet,Link } from 'react-router-dom';
import avatar from "../assets/images/avatar.png"
import { API_BASE_URL } from "../context/Constant";
import HeaderPost from '../parts/headerPost';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const { Search } = Input;
const Post = ()=>{
    const [ispostsNewModal, setPostsNewModal] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [fullName, setFullName] = useState("");
    const[avatarUser, setAvatar]= useState("");
    const [userRole, setuserRole] = useState("");
    const [open, setOpen] = useState(false);
    const [userProfile, setUserProfile] = useState("");
    const hide = () => {
      setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
      setOpen(newOpen);
    };    <AudioOutlined
    style={{
        fontSize: 16,
        color: '#1677ff',
    }}
    />
    // const handleLogout = () => {
    //     // Xử lý logic đăng xuất
    //     setIsLoggedIn(false);
    //     setFullName("");
    //     setuserRole("");
    //     localStorage.removeItem("userInfo");
    //     localStorage.removeItem("user");
    //     // Chuyển hướng về trang Home sau khi đăng xuất
    //     // navigate.push('/');
    //     };
    const onSearch = (value, _e, info) => console.log(info?.source, value);
    // const items = [
    //     {
    //         key: '1',
    //         label: (
    //         <Link to="/post/account" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: 'larger',margin:"auto" }} >
    //             Tài khoản
    //         </Link>
    //         ),
    //     },
    //     {
    //         key: '2',
    //         label: (
    //             <Link to="/post/my-post" onClick={handleLogout} style={{ textDecoration: 'none', fontSize: 'larger',margin:"auto" }}>Logout</Link>
    //         ),
    //     },
        
    //     ];
      //get user profile
  useEffect(() => {
    // Gọi API để lấy thông tin từ server
    
    const fetchProfileData = async () => {
      try {
        const userString=localStorage.getItem('userInfo');
        const user = JSON.parse(userString);
        const token=user.accessToken;
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
        //   setUserProfile(user.data)
        //   console.log(userProfile)
        } else {
          console.error('Error fetching profile data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);  
  // useEffect(() => {
  //   // Kiểm tra xem có thông tin đăng nhập trong localStorage không
  //   const userInfoString = localStorage.getItem("user");
  //   if (userInfoString) {
  //     const userInfo = JSON.parse(userInfoString);
  //     setIsLoggedIn(true);
  //     setFullName(userInfo.fullName);
  //     setuserRole(userInfo.role);
  //     setAvatar(userInfo.avatar)
  //   }
  // }, []);  
    return(
        <body className='post-body' >
            <HeaderPost/>
            <div className='body-postist'>
                {/* <Card title={<button className='post-button-discuss'>Thảo luận mới</button>} bordered={false} style={{ width: 300 }}>
                    <p>Trang cá nhân</p>
                    <p>Quản lí bài viết</p>
                </Card> */}
                 
                <CRow>
                    <PostSidebar style={{
                            borderRadius:"8px"
                        }}/>
                    <CCol xs={8} style={{marginLeft:"50px"}}>
                        <CCard className="mb-4">
                        {/* <CCardHeader>
                            <strong>Trang thảo luận</strong>
                        </CCardHeader> */}
                        <CCardBody>
                            <Outlet />
                        </CCardBody>
                        </CCard>
                    </CCol>
                    </CRow>
            </div>
            <footer style={{marginBottom:"0"}}>
            <Footer/>
            </footer>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
        </body>
        
    )
}

export default Post