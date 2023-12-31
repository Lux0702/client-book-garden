import React, { useState, useEffect } from 'react'
import {
  CBreadcrumb,
  CBreadcrumbItem,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CLink,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CImage,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CButton,
  CInputGroupText,
  CInputGroup,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../assets/css/history.css'
const HistoryOrder = () => {
  const [books, setBooks] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedBook, setSelectedBook] = useState([])
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [orderDetail, setOrderDetail] = useState(null)
  const [selectedOrderItem, setSelectedOrderItem] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [statusOptions, setStatusOptions] = useState([
    { status: 'Đã xác nhận', color: 'blue' },
    { status: 'Đang giao', color: 'orange' },
    { status: 'Đã giao', color: 'green' },
    { status: 'Chờ xác nhận', color: 'gray' },
  ])
  const resetRow = () => {
    setSelectedRowId(null)
  }
  useEffect(() => {
    if (!isOrderModalOpen) {
      resetRow()
    }
  }, [isOrderModalOpen])

  //get all  book
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/v1/books')
        if (response.ok) {
          const book = await response.json()
          setBooks(book.data.data)
          console.log('Get data success', books)
        } else {
          console.error('Error fetching books:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    }
    fetchBooks()
  }, [])
  // //detail order
  // const handleShowOrderDetail = async (selectedItemId) => {
  
  //       const foundUser = users.find((user) => user._id === orderDetail.user)
  //       const foundBooks = orderDetail.orderItems.map((orderItem) => {
  //         return books.find((book) => book._id === orderItem.book)
  //       })
  //       console.log(orderDetail)
  //       setSelectedUser(foundUser)
  //       setSelectedBook(foundBooks)
  //       console.log(selectedBook)
  //       setIsOrderModalOpen(true)
       
  // }
  // const handleRowClick = (id) => {
  //   setSelectedRowId(id)
  //   console.log(id)
  //   //setIsPopupOpen(true)
  //   //handleShowProduct(selectedRowId)
  // }
  //Get all orders
  useEffect(() => {
    const fetchOrders = async () => {
      const userInfoString = localStorage.getItem('userInfo')
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const token = userInfo.accessToken;
      console.log("token:",token)
      try {
        const response = await fetch('http://localhost:3333/api/v1/customer/orders', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const order = await response.json()
          const sortedOrders = [...order.data].sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate),
          )
          setOrders(sortedOrders)
        } else {
          console.error('Error fetching orders:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
      
    }
    fetchOrders()
  }, [])
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-CA')
  }
  //custom dropdown
  const vars = {
    '--cui-dropdown-border': 'none',
    '--cui-dropdown-border-radius': '8px',
    '--cui-btn-hover-border-color': 'none',
  }
  const handleRowClick = (id,orderItems) => {
    setSelectedRowId(id)
    console.log(id)
    setSelectedOrderItem(orderItems);
    setIsOrderModalOpen(true)
    //handleShowOrderDetail(selectedRowId)
  }
  // const handleShowOrderDetail = (id) =>{
  //   setIsOrderModalOpen(true)
  // }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Danh sách đơn hàng</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tên người nhận</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Số điện thoại</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Địa chỉ nhận hàng</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Ngày đặt hàng</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tổng tiền</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{textAlign:'center',marginRight:"50px"}}>Trạng thái</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {console.log('Orders data:', orders)}
                {orders.map((order,index) => (
                  <CTableRow
                  key={index}
                  active={selectedRowId === order._id}
                  onClick={(e) => {
                    handleRowClick(order._id, order.orderItems)
                  }}
                > 
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{order.fullName}</CTableDataCell>
                  <CTableDataCell>{order.phone}</CTableDataCell>
                  <CTableDataCell>{order.address}</CTableDataCell>
                  <CTableDataCell>{formatDate(order.orderDate)}</CTableDataCell>
                  <CTableDataCell>{order.totalAmount}</CTableDataCell>
                  <CTableDataCell>
                    <CDropdown variant="btn-group" style={{ borderRadius: '12px' }}>
                      <CDropdownToggle
                        disabled
                        style={{
                          backgroundColor: statusOptions.find(
                            (opt) => opt.status === order.status,
                          )?.color,
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          marginLeft: '0'
                        }}
                      >
                        {order.status}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ borderRadius: '12px' }}>
                        {statusOptions.map((option, index) => (
                          <CDropdownItem
                            style={{ borderRadius: '12px' }}
                            key={index}
                          >
                            {option.status}
                          </CDropdownItem>
                        ))}
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                   </CTableRow>
                  
                  
                ))}
              </CTableBody>
            </CTable>
            {/* Modal xem chi tiết */}
            <CModal
              size="lg"
              alignment="center"
              visible={isOrderModalOpen}
              onClose={() => {
                setIsOrderModalOpen(false)
              }}
            >
              <CModalHeader closeButton>
                <CModalTitle>Chi tiết đơn hàng</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {/* Render product details here */}              
                    <div>
                      <CAccordion flush>
                        {selectedOrderItem  &&
                          selectedOrderItem &&
                          selectedOrderItem.map((item, index) => (
                            <CAccordionItem key={index}>
                              <CAccordionHeader>
                                {index + 1}. {item.book.title}
                              </CAccordionHeader>
                              <CAccordionBody>
                                <p>
                                  <strong>Mã sản phẩm:</strong> {item.book._id}
                                </p>
                                <p>
                                  <strong>Số lượng:</strong> {item.quantity}
                                </p>
                                <p>
                                  <strong>Giá tiền:</strong> {item.book.price}
                                </p>
                                <p>
                                  <strong>Thành tiền:</strong> {item.book.price * item.quantity}
                                </p>
                              </CAccordionBody>
                            </CAccordionItem>
                          ))}
                      </CAccordion>
                    </div>
              </CModalBody>
              {/* <CModalFooter>
              </CModalFooter> */}
            </CModal>
          </CCardBody>
        </CCard>
      </CCol>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </CRow>
  )
}

export default HistoryOrder;
