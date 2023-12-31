// Cart.js
import React, { useState ,useEffect } from 'react';
import '../assets/css/cart.css'; 
import CartItem from '../parts/CartItem';
import Header from '../parts/Header';
import Footer from '../parts/Footer';
import StickyFooter from 'react-sticky-footer';
import PaymentPage from './Order';
import { useNavigate } from 'react-router-dom';
import {Spin } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Empty_cart from "../assets/images/cart_empty_icon.png"
import { useLocation } from 'react-router-dom';

const Cart = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]); 
  const [redirectToPayment, setRedirectToPayment] = useState(false);
  const [books, setBooks] = useState([])
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0); // Thêm state để theo dõi tổng tiền
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [bookToCartItemMap, setBookToCartItemMap] = useState({});

  useEffect(() => {
    const storedSelectedItems = localStorage.getItem('selectedItems');
    const parsedSelectedItems = JSON.parse(storedSelectedItems);
    console.log("id lưu:",parsedSelectedItems?parsedSelectedItems._id:"Rỗng")
    if (parsedSelectedItems && cartItems.length > 0) {
      // Tìm ID của cartItem dựa trên book_id và parsedSelectedItems.key
      const cartItemId = cartItems.find((cartItem) => {
        console.log("cartItem.book._id:", cartItem.book._id);
        return cartItem.book._id === parsedSelectedItems._id;
      })?._id;
  
      console.log("đã lấy:", cartItemId);
  
      if (cartItemId) {
        // Đặt trạng thái cho checkbox
        setSelectedItems((prevSelectedItems) => ({
          ...prevSelectedItems,
          [cartItemId]: true,
        }));
      }
    }
  
    localStorage.removeItem('selectedItems');
  }, [cartItems]);
  
  const handleRedirectToPayment = () => {
    const isAnyItemSelected = Object.values(selectedItems).some((isChecked) => isChecked);
    if (isAnyItemSelected) {
      setRedirectToPayment(true);
      const order = cartItems.filter((item) => selectedItems[item._id]);
      localStorage.setItem('tempOrder', JSON.stringify(order));
      navigate('/order');
    } else {
      // Hiển thị thông báo hoặc thực hiện các hành động khác khi không có mục nào được chọn
      toast.info('Vui lòng chọn ít nhất một sản phẩm để mua hàng.');
    }
  };
  const handleCheckboxChange = (itemId, isChecked) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [itemId]: isChecked,
    }));
    console.log('Get data id:', itemId)

  };
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item._id === itemId
            ? { ...item, quantity: newQuantity } // Cập nhật chỉ cho item cần thay đổi
            : item
        )
      );
      updateTotal();
    }
  };
  //get all  book
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/v1/books')
        if (response.ok) {
          const book = await response.json()
          setBooks(book.data.data)
          //console.log('Get data success', books)
        } else {
          console.error('Error fetching books:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    }
    fetchBooks()
  }, [])
  //get all cartitem
  useEffect(() => {
    const fetchCartItems = async () => {
      const userInfoString = localStorage.getItem("userInfo");
      const userInfo = JSON.parse(userInfoString);
      const token = userInfo.accessToken;
      try {
        setSpinning(true);
        // Thực hiện gọi API để lấy danh sách giỏ hàng từ server
        const response = await fetch('http://localhost:3333/api/v1/customer/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          // Cập nhật state cartItems với dữ liệu từ server
          setCartItems(data.data.items);
          setCartItems(prevCartItems => prevCartItems.sort((a, b) => {
            // Chuyển _id về kiểu số để so sánh
            const idA = parseInt(a._id, 16);
            const idB = parseInt(b._id, 16);
          
            // Sắp xếp từ dưới lên
            return idB - idA;
          }));
          console.log(cartItems) // Thay thế setCartItems với dữ liệu thực tế từ API
        } else {
          console.error('Error fetching cart items:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }finally {
        setSpinning(false);
      }
    };
  
    fetchCartItems();
  }, []);
  const updateTotal = () => {
    const newTotal = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
    setTotal(newTotal);
  };
  useEffect(() => {
    updateTotal();
  }, [cartItems]);
  const handleCheckboxAllChange = (event) => {
    const isChecked = event.target.checked;
    setIsAllChecked(isChecked);
  
    // Cập nhật trạng thái của tất cả các checkbox con
    const updatedSelectedItems = {};
    for (const itemId of cartItems.map((item) => item._id)) {
      updatedSelectedItems[itemId] = isChecked;
    }
    setSelectedItems(updatedSelectedItems);
  };
  const handleBuyNow=()=>{
    navigate('/book-list')
  }
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
    <div style={{backgroundColor:'#FFFAFA'}} >
        <Header/>
        <div className='cart-container'>
          <h3 className="title">Your Shopping Bag</h3>
              <div className='cart-item-header'>
                      <input type="checkbox" checked={isAllChecked} onChange={handleCheckboxAllChange}  />
                      <div className="cart-item-details">
                          <span className="cart-item-title">Sản phẩm</span>
                          <span className="cart-item-original-price">Đơn giá</span>
                          <span className="cart-item-quantity">Số lượng</span>
                          <span className="cart-item-price">Số tiền</span>
                      </div>

                  </div>    
                  {cartItems && cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div className="cart-item-container" key={item._id || item.id}>
                          <CartItem item={item} 
                          onQuantityChange={handleQuantityChange} 
                          updateTotal={updateTotal} 
                          onCheckboxChange={handleCheckboxChange}  
                          isChecked={selectedItems[item._id] || false}/>
                        </div>
                      ))
                    ) : (
                      <div style={{ margin: "auto" }}>
                        <p className="empty-cart" style={{ backgroundImage: `url('${Empty_cart}')`, width: "200px", height: "200px" }}></p>
                        <p><strong style={{ marginLeft: "-60px" }}>Chưa có sản phẩm trong giỏ hàng của bạn.</strong></p>
                        <button style={{ borderRadius: "8px", marginBottom: "20px", marginLeft: "35px" }} onClick={handleBuyNow}>Mua hàng ngay </button>
                      </div>
                    )}


          <div  >
          <StickyFooter
              bottomThreshold={200}
              normalStyles={{
                backgroundColor: "#FFF",
                padding: "1rem",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                width: "100%",
              }}
              stickyStyles={{
                backgroundColor: "rgba(255,255,255,.8)",
                padding: "1rem",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" ,
                height: "80px",
                width: "1365.600px",
              }}
            >
              <div className='cart-total'>
                <input type="checkbox"  />
                <p style={{color:'red'}}> Thành tiền: {formatCurrency(total||0)}</p>
                <button onClick={handleRedirectToPayment}  style={{marginRight:'0', borderRadius:"8px"}}>Mua hàng </button>
          </div>
          </StickyFooter>
         
          
        </div>
       
      </div>
     
        <Footer/>
        {redirectToPayment && <PaymentPage cartItems={cartItems} />}
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
export default Cart;
