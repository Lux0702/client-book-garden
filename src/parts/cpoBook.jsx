import React ,{useState, useEffect}from 'react';
import "../assets/css/cpoBook.css"
import wish from "../assets/icons/wish.svg"
import { useNavigate } from 'react-router-dom';
import wished from "../assets/icons/wished.png"
import { API_BASE_URL } from "../context/Constant";
import {  Spin } from 'antd'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import icon_buy from "../assets/icons/Icon_buy.svg"
import icon_buy1 from "../assets/icons/Icon_buy1.svg"

const Book = (props) => {
    const { image, title, author, price,_id,onWishChange,wish_icon } = props;
    const navigate = useNavigate();
    const [isWished, setIsWished] = useState(false);
    const [iconWish, setIsIconWish]= useState(wish);
    const handleBookClick = () => {
        // Pass the book's ID to the book detail page
        navigate(`/book-detail/${_id}`);
    };

    const handleWishChange = async () => {
        setIsWished(!isWished);
        onWishChange(_id);
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
        <div>
            <div className="container-book" onClick={handleBookClick} >
                <div className="image-container" style={{backgroundImage:`url(${image})` ,backgroundPosition:'center', backgroundSize:'cover ', backgroundRepeat:'no-repeat', marginRight:'15px'}}>
                    {/* <img src={image} alt={title} /> */}
                </div>
                <div className='container-content'>
                    <div className='container-text'>
                        <h6>{title}</h6>
                        <div className='container-text-icon'>
                            <div>
                            <p>{author && author.length > 0 ? author[0].authorName: ''}</p>
                            <p1>{formatCurrency(price || 0)}</p1>
                            </div>
                            <img className="wishlist"  src={wish_icon?wish_icon:wish} alt=''/>
                        </div>
                        
                    </div>
                </div>
           
                {/* <div className='background-container'>
                <button className='show-access-button-1'>
                    <img src={icon_buy} alt='buy'/> 
                    <strong style={{marginLeft:"25px"}} onClick={handleBookClick}>Chi tiết</strong></button>
                <button className='show-access-button'>
                    <img src={icon_buy1} alt='buy'/> 
                    <strong style={{marginLeft:"15px"}}>Mua hàng</strong>
                </button>
                <img className="wishlist" style={{width:"40px",height:"40px",marginTop:"10px"}} 
                id={`wishlist-icon-${_id}`} src={iconWish?wished:wish} alt='' onClick={handleWishChange}/>
                </div> */}
            </div>
            
        </div>
        
        
    );
};

export default Book;