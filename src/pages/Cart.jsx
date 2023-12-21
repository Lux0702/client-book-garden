// Cart.js
import React, { useState ,useEffect } from 'react';
import '../assets/css/cart.css'; 
import CartItem from '../parts/CartItem';
import Header from '../parts/Header';
import Footer from '../parts/Footer';
import StickyFooter from 'react-sticky-footer';
import PaymentPage from './Order';
import { useNavigate } from 'react-router-dom';
const Cart = () => {
  // const [cartItems, setCartItems] = useState([
  //   {
  //     id: 1,
  //     title: 'Product 1',
  //     price: 19.99,
  //     quantity: 2,
  //     image: 'https://via.placeholder.com/150',
  //   },
  //   {
  //     id: 2,
  //     title: 'Product 2',
  //     price: 24.99,
  //     quantity: 1,
  //     image: 'https://via.placeholder.com/150',
  //   },
  //   {
  //     id: 1,
  //     title: 'Product 1',
  //     price: 19.99,
  //     quantity: 2,
  //     image: 'https://via.placeholder.com/150',
  //   },
  //   {
  //     id: 2,
  //     title: 'Product 2',
  //     price: 24.99,
  //     quantity: 1,
  //     image: 'https://via.placeholder.com/150',
  //   },
  //   {
  //     id: 1,
  //     title: 'Product 1',
  //     price: 19.99,
  //     quantity: 2,
  //     image: 'https://via.placeholder.com/150',
  //   },
  //   {
  //     id: 2,
  //     title: 'Product 2',
  //     price: 24.99,
  //     quantity: 1,
  //     image: 'https://via.placeholder.com/150',
  //   },
  //   {
  //     id: 1,
  //     title: 'Product 1',
  //     price: 19.99,
  //     quantity: 2,
  //     image: 'https://via.placeholder.com/150',
  //   },
  //   {
  //     id: 2,
  //     title: 'Product 2',
  //     price: 24.99,
  //     quantity: 1,
  //     image: 'https://via.placeholder.com/150',
  //   },
  //   // Add more items as needed
  // ]);
  const [cartItems, setCartItems] = useState([]); 
  const [redirectToPayment, setRedirectToPayment] = useState(false);
  const [books, setBooks] = useState([])
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0); // Thêm state để theo dõi tổng tiền

  const handleRedirectToPayment = () => {
    setRedirectToPayment(true);
    const order = cartItems.filter(item => selectedItems[item._id]);
    console.log("Đã checkbox là:",order)
    //navigate('/order', { state: { orderItems: order } });
    localStorage.setItem('tempOrder', JSON.stringify(order));
    navigate('/order');
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
  useEffect(() => {
    const fetchCartItems = async () => {
      const userInfoString = localStorage.getItem("userInfo");
      const userInfo = JSON.parse(userInfoString);
      const token = userInfo.accessToken;
      try {
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
          setCartItems(data.data.cartItems);
          console.log(cartItems) // Thay thế setCartItems với dữ liệu thực tế từ API
        } else {
          console.error('Error fetching cart items:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
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

  return (
    <div style={{backgroundColor:'#FFFAFA'}} >
        <Header/>
        <div className='cart-container'>
          <h3 className="title">Your Shopping Bag</h3>
              <div className='cart-item-header'>
                      <input type="checkbox"  />
                      <div className="cart-item-details">
                          <span className="cart-item-title">Sản phẩm</span>
                          <span className="cart-item-original-price">Đơn giá</span>
                          <span className="cart-item-quantity">Số lượng</span>
                          <span className="cart-item-price">Số tiền</span>
                      </div>

                  </div>    
                  {cartItems && cartItems.length > 0 && cartItems.map((item) => (
                    <div className="cart-item-container" key={item._id || item.id}>
                      <CartItem item={item} onQuantityChange={handleQuantityChange} updateTotal={updateTotal} onCheckboxChange={handleCheckboxChange}/>
                    </div>
                  ))}

          <div  >
          <StickyFooter
              bottomThreshold={400}
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
                <p style={{color:'red'}}> Thành tiền: {total.toFixed(2)}Đ</p>
                <button onClick={handleRedirectToPayment} >Mua hàng </button>
          </div>
          </StickyFooter>
         
          
        </div>
       
      </div>
     
        <Footer/>
        {redirectToPayment && <PaymentPage cartItems={cartItems} />}
    </div>
    
  );
};
export default Cart;
