import React, { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link ,useNavigate } from 'react-router-dom';
import '../assets/css/custome-sidebar.css';
import { FaBook, FaUser, FaLock, FaShoppingBag } from 'react-icons/fa';
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
  CModalTitle,CFormLabel,CFormInput,CFormTextarea
} from '@coreui/react'
import { FaHome } from 'react-icons/fa';
import Select from 'react-select';
import 'react-comments-section/dist/index.css';
import {  Spin } from 'antd'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import { TextareaCodeEditor } from '@uiw/react-textarea-code-editor';
const PostSidebar = () => {
  const [ispostsNewModal, setPostsNewModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null)
  const [books, setBooks]=useState([])
  const [spinning, setSpinning] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    content: '',
  });
  const navigate = useNavigate();
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption)
  };
  const handleInputChange = (e) => {
    // Handle changes in the input fields
    const { name, value } = e.target;
    setPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (!ispostsNewModal) {
      setSelectedOption(null);
    }
  }, [ispostsNewModal]);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setSpinning(true)
        const response = await fetch('http://localhost:3333/api/v1/books')
        if (response.ok) {
          const books = await response.json()
          setBooks(
            books.data.map((book) => ({
              value: book.title,
              label: book.title,
            })),
          )
          //localStorage.setItem('bookData',JSON.stringify(book.data))
          console.log('Get data success', books)
  } else {
          console.error('Error fetching books:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
      }finally {
        setSpinning(false);
      }
    }

    fetchBooks()
  }, [])

  const [customCommentData, setCustomCommentData] = useState([]);

  const handleCommentSubmit = (data) => {
    // Customize or format the comment data before submitting
    const formattedData = {
      ...data,
      // Add custom properties if needed
      customProperty: 'customValue',
    };

    // Perform any additional logic here before submitting
    console.log('Customized Comment Data:', formattedData);

    // Update the comment data state
    setCustomCommentData((prevData) => [...prevData, formattedData]);
  };
  const handleSubmit = async () => {
    const userInfoString = localStorage.getItem('userInfo')
    const userInfo = JSON.parse(userInfoString)
    const token = userInfo.accessToken
    // Loop through selectedItems and send DELETE requests
    console.log('Current postData:', postData);
    try {
      setSpinning(true)
      const response = await fetch("http://localhost:3333/api/v1/posts/create", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Add Content-Type header
        },
        body: JSON.stringify(postData),
      });
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message, {
          onClose: () => {
            setPostsNewModal(false)
          },
        })
      } else {
        const data = await response.json()
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Error create Post with ID ", error)
    }finally{
      setSpinning(false)
    }
  };
  const handlePostNew = () => {
    const userLogin = localStorage.getItem('userInfo');
    if (userLogin) {
      setPostsNewModal(true);
    } else {
      toast.info("Vui lòng đăng nhập", {
        onClose: () => {
          setPostsNewModal(false);
          navigate("/post/login");
        }
      });
    }
  };
  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '400px',width:'300px',borderRadius:"8px" }}>
      <Sidebar
        width="300px"
        style={{
            borderRadius:"8px"
        }}
      >
        <Menu style={{
            borderRadius:"8px"
        }}>
            <button className='post-button-discuss'  onClick={handlePostNew}>Thảo luận mới</button>
          <MenuItem>
            <Link
              to="/post/my-post"  
              className={`link-sideBar `}
            
            >
              <FaHome style={{ marginRight: '8px', marginBottom: '6px' }} />
              Trang chủ
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/post/account"
              className={`link-sideBar `}
            
            >
              <FaUser style={{ marginRight: '8px', marginBottom: '6px' }} />
              Thông tin tài khoản
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/post/manager-post"
              className={`link-sideBar `}
            >
              <FaBook style={{ marginRight: '8px', marginBottom: '6px' }} />
              Bài viết của tôi
            </Link>
          </MenuItem>
          {/* <MenuItem>
            <Link
              to="/post/manager-post"
              className={`link-sideBar `}
            >
              <FaLock style={{ marginRight: '8px', marginBottom: '6px' }} />
              Quản lí bài viết
            </Link>
          </MenuItem> */}
        </Menu>
      </Sidebar>
      <CModal
                size="lg"
                alignment="center"
                visible={ispostsNewModal}
                onClose={() => {
                    setPostsNewModal(false)
                }}
                >
                <CModalHeader closeButton>
                    <CModalTitle>Tạo bài viết</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                      <CCol>
                      <CFormLabel htmlFor="title">Tiêu đề:</CFormLabel>
                          <CFormInput
                            type="text"
                            id="title"
                            name="title"
                            onChange={handleInputChange}
                          />
                          <div className="mb-3">
                            <CFormLabel htmlFor="categories">Chọn sách review</CFormLabel>
                            <Select
                              isClearable
                              options={books}
                              onChange={handleChange}
                              value={selectedOption? selectedOption : null}
                              placeholder="Chọn sách"
                            />
                          </div>
                          <span className="p-float-label">
                          <CFormTextarea
                              rows={5}
                              type="text"
                              id="content"
                              name="content"
                              placeholder="Mô tả sách"
                              onChange={handleInputChange}
                            />
                          </span>
                          {/* <TextareaCodeEditor
                              placeholder="Type your code here..."
                              style={{ height: '300px' }} // Adjust the height as needed
                            /> */}
                      </CCol>

                    </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton color="primary" type="submit" onClick={handleSubmit} >
                    Đăng
                  </CButton>
                </CModalFooter>
      </CModal>
      <Spin spinning={spinning} fullscreen />
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
    </div>
  );
};

export default PostSidebar;
