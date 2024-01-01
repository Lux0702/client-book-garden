import React, { useState, useEffect } from 'react'
import {
  CAlert,
  CAlertHeading,
  CAlertLink,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
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
  CAvatar,
  CImage,
  CButton,
  CCardFooter,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import avatar from '../assets/images/avatar.png'
import "../assets/css/yourpost.css"
import { Card } from 'antd';
import { FaArrowRight, FaComment } from 'react-icons/fa';
import CommentInput from '../parts/comment'
import { Divider,Slider, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../context/Constant";
const YourPost = () => {
  const [posts, setPosts] = useState([])
  const [commentPost,setCommentPost]= useState(null)
  const [selectedPost,setSelectedPost]= useState(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [showMore, setShowMore] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const navigate =useNavigate()
  const [spinning, setSpinning] = useState(false);


  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  //get all post
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/v1/posts', {
          method: 'GET',
        })
        if (response.ok) {
          const order = await response.json()
          const sortedOrders = [...order.data].sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate),
          )
          setPosts(sortedOrders)
          console.log(sortedOrders)
        } else {
          console.error('Error fetching orders:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
    fetchOrders()
  }, [])
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-CA')
  }
  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };
  //get comment by id
  const handleCommentPost= async (id)=>{
    try {
      setSpinning(true);
      const userString=localStorage.getItem('userInfo');
      const user = JSON.parse(userString);
      const token=user.accessToken;
      const response = await fetch(`http://localhost:3333/api/v1/posts/${id}/comment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCommentPost((prevCommentPost) => ({
          ...prevCommentPost,
          [id]: data.data,
        }));
        setIsUserModalOpen(true);
        console.log("data comment detail",data.data)
      } else {
        console.error('Error fetching product data:', response.statusText);
      }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }finally {
        setSpinning(false);
      }
  }
  return (
   <div>
     <CRow>
     {posts.map((post, index) => (
          <><CCard key={index} className="mb-2">
         <CCardHeader>
           <CAvatar style={{maxWidth:'32px', maxHeight:'32px',height:'32px'}} src={post.postedBy.avatar}  />
           <strong style={{ marginLeft: "5px" }}>{post.postedBy.fullname}<br /></strong>
           <small>
             <CBadge color="success"><em>{post.status}</em></CBadge>
           </small>
           <strong><em>{'  '}Tựa đề: {post.title}</em></strong>
         </CCardHeader>
         <CCardBody>
           <blockquote className={`hide-post ${isContentVisible ? 'visible' : 'hidden-post'}`}>
             <>
               <blockquote>{post.content}</blockquote>
               <CImage rounded thumbnail align="center" src="https://res.cloudinary.com/dfwwu6ft4/image/upload/c_scale,w_190/v1702683112/y9vmypzovbxmntpd9zu1.jpg" />
             </>
           </blockquote>
           <p style={{ marginLeft: "0", marginTop: "10px", fontStyle: "italic" }} align="center" size="lg" onClick={toggleContent}><strong>{isContentVisible ? `Rút gọn` : `Xem thêm`}</strong></p>
         </CCardBody>
         <CCardFooter>
           <button className='button-footer' 
            onClick={() => navigate(`/book-detail/${post.book.id}`)}
            > 
           <FaArrowRight /> Xem sản phẩm</button>
           <button className='button-footer' onClick={() => { 
              //setSelectedPost(post.id)
              console.log("id post:",post.id)
              setCommentPost(posts.find((item) => item.id === post.id))
              console.log("selectedPost:",selectedPost)
              setIsUserModalOpen(true);
            } }><FaComment /> Bình luận</button>
         </CCardFooter>
       </CCard><Divider orientation style={{ marginTop: "10px", marginBottom: "15px" }}></Divider></>

        ))}
    </CRow>
    {/* Bình luận post */}
    <CModal
      size="lg"
      alignment="center"
      visible={isUserModalOpen}
      onClose={() => {
      setIsUserModalOpen(false)
      }}
  >
      <CModalHeader closeButton>
      <CModalTitle><strong>Bình luận</strong></CModalTitle>
      </CModalHeader>
      <CModalBody>
        {console.log("comment là :",commentPost)}
        {console.log("Type of commentPost:", typeof commentPost)}
      <CommentInput data={JSON.stringify(commentPost)}/>
      </CModalBody>
      <CModalFooter>
      
      </CModalFooter>
      </CModal>
    <Spin spinning={spinning} fullscreen />
   </div>
    

  )
}

export default YourPost
