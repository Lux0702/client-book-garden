// CartItem.js
import React, { useState, useEffect } from 'react';
import '../assets/css/cartItem.css'; // Import file CSS nếu có
import { FaTrash } from 'react-icons/fa';
import { json } from 'react-router-dom';
import { wait } from '@testing-library/user-event/dist/utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Spin } from 'antd'
const CartItem = ({ item, onQuantityChange, updateTotal, onCheckboxChange,isSelected, isChecked   }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  //const [isChecked, setIsChecked] = useState(false);
  const [spinning, setSpinning] = useState(false);
  // const [books, setBooks] = useState([])
  // const [selectedBook,setSelectedBook] = useState(null)
  //  //get all  book
  //  useEffect(() => {
  //   const fetchBooks = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3333/api/v1/books')
  //       if (response.ok) {
  //         const bookData  = await response.json()
  //         setBooks(bookData.data.data)
  //         //console.log('Get data success', books)
  //       } else {
  //         console.error('Error fetching books:', response.statusText)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching books:', error)
  //     }
  //   }
  //   fetchBooks()
  // }, [])
  // useEffect(() => {
  //   setSelectedBook(books.find((book) => book._id === item.book._id));
  // }, [books, item.book._id]);
  //console.log(selectedBook)

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      onQuantityChange(item._id, newQuantity);
      updateCartItemQuantity(item.book._id, newQuantity);
      return newQuantity;
    });
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => {
        const newQuantity = prevQuantity - 1;
        onQuantityChange(item._id, newQuantity);
        updateCartItemQuantity(item.book._id, newQuantity);
        return newQuantity;
      });
    }
  };

  // const handleCheckboxChange = () => {
  //   const newCheckedState = !isChecked;
  //   setIsChecked(newCheckedState);
  //   onCheckboxChange(item._id, newCheckedState);
  //   console.log('Get data id cartItem:', item._id)

  // };
  useEffect(() => {
    updateTotal();
  }, [quantity]);
  const updateCartItemQuantity = async (itemId, newQuantity) => {
    console.log(itemId)
    console.log(newQuantity)
    try {
      const userInfoString = localStorage.getItem("userInfo");
      const userInfo = JSON.parse(userInfoString);
      const token = userInfo.accessToken;
  
      const response = await fetch('http://localhost:3333/api/v1/customer/cart/updateCartItem', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookID: itemId,
          quantity: newQuantity,
        }),
      });
  
      if (response.ok) {
        // Cập nhật tổng tiền sau khi cập nhật thành công
        updateTotal();
      } else {
        const data= await response.json()
        console.log("lỗi:",data.message)
        console.error('Error updating cart item quantity:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };  
  const handleDeleteCartItem = async () =>{
      const userString=localStorage.getItem('userInfo')
      const user = JSON.parse(userString)
      const token=user.accessToken
      try {
        setSpinning(true);
        const response = await fetch("http://localhost:3333/api/v1/customer/cart/removeCartItem", {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
           body: JSON.stringify({
            cartItemID:item._id
           })
        });
    
        if (response.ok) {
          const data = await response.json()
          toast.success(data.message, {
            onClose: () => {
               window.location.reload();
            },
          })
        } else {
          console.error('Đã xảy ra lỗi khi xóa sản phẩm:', response.status);
          const data = await response.json()
          toast.error(data.message)
        }
      } catch (error) {
        toast.error('Đã xảy ra lỗi khi gửi yêu cầu DELETE:', error);
      } finally {
        setSpinning(false);
      }
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
    <div className={`cart-item ${isSelected ? 'selected' : ''}`}>
      <input type="checkbox" checked={isChecked} onChange={() => onCheckboxChange(item._id, !isChecked)} />
      <img src={item.book? item.book.image : ''} alt={item.book.title}  style={{marginTop: "15px"}}/>
      <div className="item-details">
        <div className="item-title">{item.book.title}</div>
        <div className="item-original-price">{item.book.price ? formatCurrency(item.book.price|| 0): 'N/A'}</div>
        <div className="quantity-controls">
          <button onClick={handleDecrease}>-</button>
          <span className="item-quantity">{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
        <div className="item-price">{formatCurrency(item.book.price * quantity || 0)}</div>
        <FaTrash className='delete-cart' onClick={handleDeleteCartItem} />
      </div>
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

export default CartItem;
