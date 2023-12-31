import React, { useState, useEffect } from 'react';
import '../assets/css/cartItem.css';

const OrderItem = ({ item }) => {
  const [amount, setAmount] = useState(item.amount);
  const [isOrdered, setIsOrdered] = useState(false);
  const [books, setBooks] = useState([])
  const [selectedBook,setSelectedBook] = useState(null)

  useEffect(() => {
    setAmount(item.amount);
  }, [item.amount]);
   //get all  book
   useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/v1/books')
        if (response.ok) {
          const bookData  = await response.json()
          setBooks(bookData.data.data)
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
  // useEffect(() => {
  //   setSelectedBook(books.find((book) => book._id === item.book._id));
  // }, [books, item.book._id]);
  //console.log('Get data success', selectedBook)
  return (
    <div className={`order-item ${isOrdered ? 'carted' : ''}`}>
        <div className="cart-item-details">
            <span className="cart-item-title" style={{textAlign : 'left',marginLeft:"160px"}}>Sản phẩm</span>
            <span className="cart-item-original-price">Đơn giá</span>
            <span className="cart-item-quantity">Số lượng</span>
            <span className="cart-item-price" style={{textAlign : 'right',marginRight:"20px"}}>Số tiền</span>
        </div>
        <div className="item-details">
            <img src={item.book? item.book.image : ''} alt={item.book.title}  style={{width:"190px",height:"200px",padding:"10px"}}/>
            <div className="cart-item-title"  style={{textAlign : 'left',paddingLeft:'20px'}}>{item.book.title}</div>
            <div className="cart-item-original-price" style={{flexBasis : '8%'}} >{item.book.price.toFixed(2)}VNĐ</div>
            <div className="cart-item-quantity" style={{flexBasis : '33%'}}>{item.quantity}</div>
            <div className="cart-item-price">{(item.book.price * item.quantity).toFixed(2)}VNĐ</div>
        </div>
        
    </div>
  );
};

export default OrderItem;
