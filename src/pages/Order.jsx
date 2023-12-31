import React, { useState, useEffect  } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CInputGroupText,
  CRow,
  CInputGroup,
} from '@coreui/react'
import Header from '../parts/Header';
import Footer from '../parts/Footer';
import '../assets/css/payment.css'
import '../assets/css/cart.css'
import icon_address from '../assets/icons/address.svg'
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import OrderItem from '../parts/orderItem';
import { API_BASE_URL } from "../context/Constant";
import { useLocation } from 'react-router-dom';
import { Toast } from '@coreui/coreui';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useNavigate} from 'react-router-dom';
import {  Spin } from 'antd'

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: '0.5em', // Đặt giá trị này sao cho phù hợp với thiết kế của bạn
    border: state.isFocused ? '2px solid #555' : '2px solid #ced4da',
    //boxShadow: state.isFocused ? '0 0 0 0.1em rgba(0, 123, 255, 0.25)' : null,
  }),
};


const Order = () => {
  //lưu ở state
  // const location = useLocation();
  // const { state } = location;
  // const { orderItems } = state || {};
  //local storage
  const [orderItems, setOrderItems] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0); // Thêm state để theo dõi tổng tiền
  useEffect(() => {
    const tempOrder = localStorage.getItem('tempOrder');
    if (tempOrder) {
      const parsedOrder = JSON.parse(tempOrder);
      setOrderItems(parsedOrder);
    }
    //localStorage.removeItem('tempOrder');
  }, []);
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo = JSON.parse(userInfoString);
  const token=userInfo.accessToken;
  const [addressOptions,setaddressData] =useState([]);
  //get addresses
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
          const address = await response.json();
          setaddressData(
            address.data.addresses.map((addresses) => ({
              value: addresses.address,
              label: addresses.address,
            })),
          )
          console.log("Get address success",addressOptions)
        } else {
          console.error('Error fetching profile data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const updateTotal = () => {
    const newTotal = orderItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const handleDeliveryChange = (selectedOption) => {
    setSelectedDelivery(selectedOption);
  };
  const handleAddressChange = (selectedOption) => {
    setSelectedAddress(selectedOption);
  };
  const handlePaymentMethodChange = (selectedOption) => {
    setSelectedPaymentMethod(selectedOption);
  };

  const deliveryMethod = [
    { value: 40000, label: 'Hỏa tốc' },
    { value: 10000, label: 'Giao hàng tiết kiệm' },
    { value: 30000, label: 'Giao hàng nhanh' },
    // Add more address options as needed
  ];
  const paymethodMethod = [
    { value:'ON_DELIVERY', label: 'Thanh toán khi nhận hàng' },
    { value:'ONLINE', label: 'Thanh toán trực tuyến' },
    // Add more address options as needed
  ];
  useEffect(() => {
    updateTotal();
  }, [orderItems]);
  //Create order
  const handlePlaceOrder = async () => {
    // Kiểm tra xem đã chọn địa chỉ và phương thức vận chuyển chưa
    if (!selectedAddress || !selectedDelivery) {
      toast.error('Vui lòng chọn địa chỉ và phương thức vận chuyển.');
      return;
    }
  
    // Tạo object chứa các giá trị cần truyền
    const orderData = {
      cartItems: orderItems.map((item) => item._id),
      fullName: fullName,
      phone: phone, 
      address: selectedAddress.value,
      totalAmount: (total + selectedDelivery.value).toFixed(2), 
      paymentMethod:paymethodMethod.value,
    };
    console.log("Giá trị order:",orderData)
    if(!orderData.fullName ){
      toast.info("Vui lòng điền tên người nhận")
      return
    } else if(!orderData.phone){
      toast.info("Vui lòng điền số điện thoại")
      return
    }
    try {
      setSpinning(true);
      const response = await fetch('http://localhost:3333/api/v1/customer/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Thêm token nếu API yêu cầu xác thực
        },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        const data = await response.json();
        toast.success("Đặt hàng thành công", {
          onClose: () => {
            localStorage.removeItem('tempOrder');
            navigate('/cart')
          },
        })
        console.log('Đơn hàng đã được đặt:', data);
      } else {
        const errorData = await response.json();
        toast.error('Lỗi khi đặt đơn hàng:', errorData.message);
      }
    } catch (error) {
      toast.error('Lỗi kết nối:', error);
    }finally {
      setSpinning(false);
    }
  };
  const formatCurrency = (value) => {
    const formattedValue = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0, // Để loại bỏ phần thập phân
      maximumFractionDigits: 0, // Để loại bỏ phần thập phân
    }).format(value);
  
    return formattedValue;
  };
  return (
    <div style={{ backgroundColor: '#FFFAFA' }}>
      <Header />
      <div className="payment-container">
        <h3 className="title">Payment Information</h3>
        <div className='payment-address'>
            <p>
                <img src={icon_address} alt='address'/>
                Địa chỉ giao hàng
                <br/>
            </p>
            <p >
              <CreatableSelect
                  isClearable
                  onChange={handleAddressChange}
                  options={addressOptions}
                  value={selectedAddress}
                  styles={customStyles}
                />
            </p>
            <div className="mb-3">
                      <CRow>
                        <CCol xs="6" className="mb-3">
                        <CInputGroup >
                          <CInputGroupText style={{ width: '150px' }}>Tên người nhận</CInputGroupText>
                          <CFormInput aria-label="fullName" onChange={handleFullNameChange} required />
                        </CInputGroup>
                        </CCol>
                        <CCol xs="6" className="mb-3">
                        <CInputGroup >
                          <CInputGroupText>Số điện thoại</CInputGroupText>
                          <CFormInput aria-label="Phone"  onChange={handlePhoneChange} required/>
                        </CInputGroup>
                        </CCol>
                      </CRow>
            </div>
        </div>
        {orderItems  && orderItems.length > 0 && orderItems.map((item) => (
                <div className="cart-item-container" key={item._id}>
                  <OrderItem item={item} />
                </div>
              ))}
        <div className='payment-address'>
        <div className="mb-3">
                      <CRow>
                        <CCol xs="6" className="mb-3">
                          <p>Phương thức thanh toán</p>
                          <Select
                            isClearable
                            onChange={handlePaymentMethodChange}
                            options={paymethodMethod}
                            value={selectedPaymentMethod ? selectedPaymentMethod : null}
                            styles={customStyles}
                          />
                          <p>Phương thức vận chuyển</p>
                        <Select
                            isClearable
                            onChange={handleDeliveryChange}
                            options={deliveryMethod}
                            value={selectedDelivery ? selectedDelivery : null}
                            styles={customStyles}
                          />
                        </CCol>
                        <CCol xs="6" className="mb-3">
                        <p>Thành tiền</p>
                        <div>
                          <div className='custome-total-payment'>
                            <p style={{color: 'black'}}>
                              <strong>Tổng tiền hàng:</strong>
                            </p>
                            <p style={{color: 'black'}}>{formatCurrency(total || 0)}</p>
                          </div>
                          <div className='custome-total-payment'>
                            <p style={{color: 'black'}}>
                              <strong>Phí vận chuyển:</strong>
                            </p>
                            <p style={{color: 'black'}}> {selectedDelivery ? formatCurrency(selectedDelivery.value||0) : 0}</p>
                          </div>
                          <div className='custome-total-payment'>
                            <p style={{color: 'black'}} >
                              <strong>Tổng thanh toán:</strong>
                            </p>
                            <p style={{fontSize:'30px'}}>{formatCurrency(total + (selectedDelivery ? selectedDelivery.value : 0) || 0)}</p>
                          </div>
                        </div>
                        <CButton style={{ display:'flex',marginLeft: 'auto',alignItems: 'flex-end'}}onClick={handlePlaceOrder} >Đặt hàng</CButton>

                        </CCol>
                      </CRow>
            </div>
        </div>
      </div>
      <Footer />
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

export default Order;
