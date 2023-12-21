// BookDetail.js
import React, { useState,useEffect } from 'react';
import '../assets/css/productDetail.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from "../context/Constant";
import { useParams } from 'react-router-dom';
//popup hiện error
const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="error-popup">
      <p>{message}</p>
      <button onClick={onClose}>Đóng</button>
    </div>
  );
};

const BookDetail = ({ product, onQuantityChange }) => {
  const { id } = useParams();
  console.log(id);
  const [quantity, setQuantity] = useState(1);
  const bookDTO= JSON.stringify(product.bookDTO)
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
  
    if (newQuantity > product.stock) {
      // Nếu số lượng vượt quá stock, hiển thị popup và không thay đổi state
      setShowErrorPopup(true);
  } else if (newQuantity > 0) {
    // Nếu số lượng hợp lệ (lớn hơn 0), ẩn popup và cập nhật state
    setShowErrorPopup(false);
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  }
  };
const closeErrorPopup = () => {
  setShowErrorPopup(false);
  // Đặt lại giá trị quantity nếu nó vượt quá giới hạn
  const newQuantity = Math.min(product.stock, quantity);
  setQuantity(newQuantity);
  onQuantityChange(newQuantity);
};
const addToCart = async () => {
  
  try {
    console.log(quantity, bookDTO._id); // Fix the typo here
    const userInfoString = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(userInfoString);
    const token = userInfo.accessToken;
    // Thêm thông tin xác thực vào yêu cầu
    const response = await fetch(`${API_BASE_URL}/books/${id}/addToCart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({
        bookID: id,
        quantity: quantity,
      }),
    });

    const responseData = await response.json(); // Thêm dòng này để parse JSON từ phản hồi

    if (responseData.success) {
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
      // Thực hiện các xử lý khác nếu cần
    } else {
      toast.error(responseData.message);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error(error);
  }
};


  return (
    <div className="product-detail">
      <img src={product.image} alt={product.bookDTO.title} />  
      <div className="product-info">
        <h2>{product.bookDTO.title}</h2>
        <p className=''>
            <span className="info-label">
            Mô tả: <span className="bold-info-description">{product.description}</span>
            </span>
        </p>
        <p className="authors-publisher">
          <span className="info-label">
            Tác giả: <span className="bold-info">
            {product.bookDTO.authors ? (
                    product.bookDTO.authors.map((authors, index) => (
                      <span key={index}>
                        {index > 0 && ", "} 
                        {authors.authorName}
                      </span>
                    ))
                  ) : (
                    <span>Không có tác giả</span>
                  )}
            </span>
           </span>
          <span className='info-label'>
            Nhà xuất bản: <span className="bold-info">{product.publisher}</span>
          </span>
        </p>
        <p className="category-quantity">
          <span className="info-label">
            Thể loại: <span className="bold-info">
            {product.bookDTO.categories ? (
                    product.bookDTO.categories.map((category, index) => (
                      <span key={index}>
                        {index > 0 && ", "} 
                        {category.categoryName}
                      </span>
                    ))
                  ) : (
                    <span>Không có thể loại</span>
                  )}
            </span>
          </span>
          <span className="info-label">
            Đã bán: <span className="bold-info">{product.bookDTO.soldQuantity}</span>
          </span>
        </p>
        <p>
            <br/>
            <span className="bold-info-price">{product.bookDTO.price.toFixed(2)}</span>
          
        </p>
        <div className="product-quantity-controls">
          <button onClick={() => handleQuantityChange(-1)}>-</button>
          <span className="product-item-quantity">{quantity}</span>
          <button onClick={() => handleQuantityChange(1)}>+</button>
        </div>
          {showErrorPopup && (
          <ErrorPopup
            message={`Số lượng không được vượt quá số lượng tồn kho`}
            onClose={closeErrorPopup}
          />
        )}
        <button className="buy-button" >Mua ngay</button>
        <button className="add-to-cart-button" onClick={addToCart} >Thêm giỏ hàng</button>
      </div>
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
      theme="light"/>
    </div>
  );
};

export default BookDetail;
