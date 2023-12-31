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
import { Divider,Slider,Tabs } from 'antd';
const ManagePost = () => {
  const [posts, setPosts] = useState([])
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };
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
  return (
   <div>
     <CRow>
     <Tabs
              defaultActiveKey="1"
              type="card"
              size={'large'}
              items={[
                {
                  label: 'Đã duyệt',
                  key: '1',
                  children: (
                    <CCard className="mb-2">
                        <CCardHeader>
                            <CAvatar src={avatar} />
                            <strong style={{marginLeft:"5px"}}>Nguyễn Thanh Sang <br/>
                        </strong>
                        <small> 
                            <CBadge color="success">Đã duyệt</CBadge>
                            </small>
                        
                        </CCardHeader>
                        <CCardBody>
                        <blockquote>
                            {showMore ? (
                                <>
                                <blockquote>Chào các bạn hôm nay mình sẽ review cho mọi người về cuốn sách Đắc nhân tâm nhé
                                Đắc nhân tâm, tên tiếng Anh là How to Win Friends and Influence People là một quyển sách nhằm tự giúp 
                                bản thân bán chạy nhất từ trước đến nay. Quyển sách này do Dale Carnegie viết và đã được xuất bản 
                                lần đầu vào năm 1936, nó đã được bán 15 triệu bản trên khắp thế giới
                                Trong khi đó, bản dịch của Nguyễn Hiến Lê vẫn được Công ty Thư Lâm do ông Nguyễn Quyết Thắng đại diện liên kết xuất bản. Vì vậy đã gây ra tranh cãi về vấn đề bản quyền tác phẩm này tại Việt Nam, tuy nhiên theo ông Thắng cho biết: "Theo công ước Bern, 50 năm kể từ ngày tác giả qua đời, thì mọi tác phẩm sẽ thuộc quyền sở hữu của công chúng. Tác giả Dale Carnegie đã mất năm 1955, tính đến nay là hơn 50 năm kể từ khi ông mất. Vì vậy, tác phẩm của ông đã thuộc về công chúng từ lâu" [4][5]. Năm 2018, ông Nguyễn Quyết Thắng đã chuyển giao bản quyền cho Công ty Cổ phần Sách MCBooks. Ông chia sẻ: "Học giả Nguyễn Hiến Lê là một người rất tôn trọng vấn đề bản quyền. Trước khi dịch bản Đắc nhân tâm và Quẳng gánh lo và vui sống, ông đều xin phép trực tiếp tác giả. (Dẫn chứng ở trang đầu phiên bản cũ từ những năm 1950 – 1952)[6]. Là người gìn giữ gia tài văn hoá của học giả quá cố, tôi vẫn luôn tâm nguyện tìm người đủ tầm và có tâm để phát triển tủ sách Nguyễn Hiến Lê đến độc giả cả nước. Ngày hôm nay 15.8.2018, tôi công bố chính thức chọn MCBooks là đơn vị được chuyển giao bản quyền của toàn bộ 120 đầu sách của học giả Nguyễn Hiến Lê".
                                </blockquote>
                                <CImage rounded thumbnail align="center" src="https://res.cloudinary.com/dfwwu6ft4/image/upload/c_scale,w_190/v1702683112/y9vmypzovbxmntpd9zu1.jpg" />

                                </>
                            ) : (
                                <>
                                Chào các bạn hôm nay mình sẽ review cho mọi người về cuốn sách Đắc nhân tâm nhé
                                Đắc nhân tâm, tên tiếng Anh là How to Win Friends and Influence People là một quyển sách nhằm tự giúp 
                                bản thân bán chạy nhất từ trước đến nay. Quyển sách này do Dale Carnegie viết và đã được xuất bản 
                                </>
                            )}
                            </blockquote>
                            <p  style={{marginLeft:"0",marginTop:"10px", fontStyle:"italic"}} align="center" size="lg"
                            onClick={handleShowMore}><strong>{showMore? `Ẩn`:`Xem thêm...`}</strong></p>
                        </CCardBody>
                        <CCardFooter>
                            <button className='button-footer' > <FaArrowRight /> Xem sản phẩm</button>
                            <button className='button-footer'  onClick={() => {
                                setIsUserModalOpen(true)
                                }} ><FaComment /> Bình luận</button>
                        </CCardFooter>
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
                            <CModalTitle><strong>Bình luận</strong></CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                            <CommentInput/>
                            </CModalBody>
                            <CModalFooter>
                            
                            </CModalFooter>
                            </CModal>
                    </CCard>
                  ),
                },
                {
                  label: 'Chưa duyệt',
                  key: '2',
                  children: (
                    <CCard className="mb-2">
                        <CCardHeader>
                            <CAvatar src={avatar} />
                            <strong style={{marginLeft:"5px"}}>Nguyễn Thanh Sang <br/>
                        </strong>
                        <small> 
                            <CBadge color="dark">Chưa duyệt</CBadge>
                            </small>
                        
                        </CCardHeader>
                            <CCardBody>
                            <blockquote>
                                {showMore ? (
                                    <>
                                    <blockquote>Chào các bạn hôm nay mình sẽ review cho mọi người về cuốn sách Đắc nhân tâm nhé
                                    Đắc nhân tâm, tên tiếng Anh là How to Win Friends and Influence People là một quyển sách nhằm tự giúp 
                                    bản thân bán chạy nhất từ trước đến nay. Quyển sách này do Dale Carnegie viết và đã được xuất bản 
                                    lần đầu vào năm 1936, nó đã được bán 15 triệu bản trên khắp thế giới
                                    Trong khi đó, bản dịch của Nguyễn Hiến Lê vẫn được Công ty Thư Lâm do ông Nguyễn Quyết Thắng đại diện liên kết xuất bản. Vì vậy đã gây ra tranh cãi về vấn đề bản quyền tác phẩm này tại Việt Nam, tuy nhiên theo ông Thắng cho biết: "Theo công ước Bern, 50 năm kể từ ngày tác giả qua đời, thì mọi tác phẩm sẽ thuộc quyền sở hữu của công chúng. Tác giả Dale Carnegie đã mất năm 1955, tính đến nay là hơn 50 năm kể từ khi ông mất. Vì vậy, tác phẩm của ông đã thuộc về công chúng từ lâu" [4][5]. Năm 2018, ông Nguyễn Quyết Thắng đã chuyển giao bản quyền cho Công ty Cổ phần Sách MCBooks. Ông chia sẻ: "Học giả Nguyễn Hiến Lê là một người rất tôn trọng vấn đề bản quyền. Trước khi dịch bản Đắc nhân tâm và Quẳng gánh lo và vui sống, ông đều xin phép trực tiếp tác giả. (Dẫn chứng ở trang đầu phiên bản cũ từ những năm 1950 – 1952)[6]. Là người gìn giữ gia tài văn hoá của học giả quá cố, tôi vẫn luôn tâm nguyện tìm người đủ tầm và có tâm để phát triển tủ sách Nguyễn Hiến Lê đến độc giả cả nước. Ngày hôm nay 15.8.2018, tôi công bố chính thức chọn MCBooks là đơn vị được chuyển giao bản quyền của toàn bộ 120 đầu sách của học giả Nguyễn Hiến Lê".
                                    </blockquote>
                                    <CImage rounded thumbnail align="center" src="https://res.cloudinary.com/dfwwu6ft4/image/upload/c_scale,w_190/v1702683112/y9vmypzovbxmntpd9zu1.jpg" />

                                    </>
                                ) : (
                                    <>
                                    Chào các bạn hôm nay mình sẽ review cho mọi người về cuốn sách Đắc nhân tâm nhé
                                    Đắc nhân tâm, tên tiếng Anh là How to Win Friends and Influence People là một quyển sách nhằm tự giúp 
                                    bản thân bán chạy nhất từ trước đến nay. Quyển sách này do Dale Carnegie viết và đã được xuất bản 
                                    </>
                                )}
                                </blockquote>
                                <p  style={{marginLeft:"0",marginTop:"10px", fontStyle:"italic"}} align="center" size="lg"
                                onClick={handleShowMore}><strong>{showMore? `Ẩn`:`Xem thêm...`}</strong></p>
                            </CCardBody>
                            <CCardFooter>
                                <button className='button-footer' > <FaArrowRight /> Xem sản phẩm</button>
                                <button className='button-footer'  onClick={() => {
                                    setIsUserModalOpen(true)
                                    }} ><FaComment /> Bình luận</button>
                            </CCardFooter>
                        </CCard>
                  ),
                },
                {
                  label: 'Từ chối',
                  key: '3',
                  children: (
                    <CCard className="mb-2">
                        <CCardHeader>
                            <CAvatar src={avatar} />
                            <strong style={{marginLeft:"5px"}}>Nguyễn Thanh Sang <br/>
                        </strong>
                        <small> 
                            <CBadge color="danger">Từ chối</CBadge>
                            </small>
                        
                        </CCardHeader>
                        <CCardBody>
                        <blockquote>
                            {showMore ? (
                                <>
                                <blockquote>Chào các bạn hôm nay mình sẽ review cho mọi người về cuốn sách Đắc nhân tâm nhé
                                Đắc nhân tâm, tên tiếng Anh là How to Win Friends and Influence People là một quyển sách nhằm tự giúp 
                                bản thân bán chạy nhất từ trước đến nay. Quyển sách này do Dale Carnegie viết và đã được xuất bản 
                                lần đầu vào năm 1936, nó đã được bán 15 triệu bản trên khắp thế giới
                                Trong khi đó, bản dịch của Nguyễn Hiến Lê vẫn được Công ty Thư Lâm do ông Nguyễn Quyết Thắng đại diện liên kết xuất bản. Vì vậy đã gây ra tranh cãi về vấn đề bản quyền tác phẩm này tại Việt Nam, tuy nhiên theo ông Thắng cho biết: "Theo công ước Bern, 50 năm kể từ ngày tác giả qua đời, thì mọi tác phẩm sẽ thuộc quyền sở hữu của công chúng. Tác giả Dale Carnegie đã mất năm 1955, tính đến nay là hơn 50 năm kể từ khi ông mất. Vì vậy, tác phẩm của ông đã thuộc về công chúng từ lâu" [4][5]. Năm 2018, ông Nguyễn Quyết Thắng đã chuyển giao bản quyền cho Công ty Cổ phần Sách MCBooks. Ông chia sẻ: "Học giả Nguyễn Hiến Lê là một người rất tôn trọng vấn đề bản quyền. Trước khi dịch bản Đắc nhân tâm và Quẳng gánh lo và vui sống, ông đều xin phép trực tiếp tác giả. (Dẫn chứng ở trang đầu phiên bản cũ từ những năm 1950 – 1952)[6]. Là người gìn giữ gia tài văn hoá của học giả quá cố, tôi vẫn luôn tâm nguyện tìm người đủ tầm và có tâm để phát triển tủ sách Nguyễn Hiến Lê đến độc giả cả nước. Ngày hôm nay 15.8.2018, tôi công bố chính thức chọn MCBooks là đơn vị được chuyển giao bản quyền của toàn bộ 120 đầu sách của học giả Nguyễn Hiến Lê".
                                </blockquote>
                                <CImage rounded thumbnail align="center" src="https://res.cloudinary.com/dfwwu6ft4/image/upload/c_scale,w_190/v1702683112/y9vmypzovbxmntpd9zu1.jpg" />

                                </>
                            ) : (
                                <>
                                Chào các bạn hôm nay mình sẽ review cho mọi người về cuốn sách Đắc nhân tâm nhé
                                Đắc nhân tâm, tên tiếng Anh là How to Win Friends and Influence People là một quyển sách nhằm tự giúp 
                                bản thân bán chạy nhất từ trước đến nay. Quyển sách này do Dale Carnegie viết và đã được xuất bản 
                                </>
                            )}
                            </blockquote>
                            <p  style={{marginLeft:"0",marginTop:"10px", fontStyle:"italic"}} align="center" size="lg"
                            onClick={handleShowMore}><strong>{showMore? `Ẩn`:`Xem thêm...`}</strong></p>
                        </CCardBody>
                        <CCardFooter>
                            <button className='button-footer' > <FaArrowRight /> Xem sản phẩm</button>
                            <button className='button-footer'  onClick={() => {
                                setIsUserModalOpen(true)
                                }} ><FaComment /> Bình luận</button>
                        </CCardFooter>
                                    {/* Thông tin chi tiết */}
                            
                            </CCard>
                        ),
                        },
                    ]}
                    />
    </CRow>
   </div>
    

  )
}

export default ManagePost
