import React, { useState, useEffect } from 'react';
import BookDetail from '../parts/cpoBookDetail';
import Header from '../parts/Header';
import Footer from '../parts/Footer';
import '../assets/css/detail.css';
import { useParams } from 'react-router-dom';
import wish from "../assets/icons/wish.svg"
import Book from "../parts/cpoBook";
import { Swiper, SwiperSlide } from 'swiper/react';
import '../assets/css/home.css'
import 'swiper/swiper-bundle.css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import {  Spin  } from 'antd'
import { FreeMode, Pagination } from 'swiper/modules';
const ProductDetail = () => {
  const [productData, setProductData] = useState(null);
  const [productRelate, setProductRelate] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    // Bất kỳ xử lý nào khác khi số lượng thay đổi ở đây
  };
  //detail book
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`http://localhost:3333/api/v1/books/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProductData(data.data);
          console.log("data book detail",productData)
        } else {
          console.error('Error fetching product data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [id]);
  //get relate Book
  useEffect(() => {
    const fetchProductRelate = async () => {
      try {
        const response = await fetch(`http://localhost:3333/api/v1/books/${id}/related`);
        if (response.ok) {
          const data = await response.json();
          setProductRelate(data.data);
          console.log(setProductRelate)
        } else {
          console.error('Error fetching product data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductRelate();
  }, [id]); 
  if (!productData || ! productRelate) {
    return   <Spin spinning={true} fullscreen />;

    //<p>Loading...</p>;
  } 
  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };
  return (
    <div>
      <Header />
      <div className='book-detail-container'>
        <h1 className='book-h2'>Chi tiết sản phẩm</h1>
        <BookDetail product={productData} onQuantityChange={handleQuantityChange} />
        <div className="book-Relate" >
            <p><strong>SẢN PHẨM LIÊN QUAN</strong></p>
            <br/>
            <Swiper
              slidesPerView={5}
              spaceBetween={60}
              freeMode={true}
              pagination={{
                clickable: true,
              }}
              modules={[FreeMode, Pagination]}
              className="swiper"
            >
              {productRelate.slice(0, 10).map((book, index) => (
                <SwiperSlide className='swiper-slide' key={book._id}>
                  <Book
                    image={book.image}
                    title={book.title}
                    author={book.authors}
                    price={book.price}
                    _id ={book._id}
                  />
                </SwiperSlide>
              ))}
            </Swiper>      
        </div>
        <div className='book-detail'>
          <h2>Thông tin sản phẩm</h2>
          <div className="book-info">
            <img src={productData.image} alt=""  className='product-detail' style={{width:'200px',height:'200px'}}/>
            <div className="info-row">
              <span className="info-label">Mã hàng:</span>
              <span className="tabbed-text">{productData.isbn}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Thể loại:</span>
              <span className="tabbed-text">
                {productData.categories?.map((category, index) => (
                  <span key={index}>{index > 0 && ', '}{category.categoryName}</span>
                )) || <span>Không có thể loại</span>}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Tác giả:</span>
              <span className="tabbed-text">
              {productData.authors?.map((author, index) => (
                  <span key={index}>{index > 0 && ', '}{author.authorName}</span>
                )) || <span>Không có tác giả</span>}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">NXB:</span>
              <span className="tabbed-text">{productData.publisher}</span>
            </div>
            <div className="divider-line"></div>
            <span className="info-label-tilte">{productData.title}</span>
            <span className={`hide-description ${isContentVisible ? 'visible' : 'hidden'}`}>{productData.description}</span>
            <button onClick={toggleContent} style={{width:"100px", borderRadius:"8px",margin:"auto"}}>
              {isContentVisible ? `Rút gọn` : `Xem thêm`}
            </button>    
          </div>
         
        </div>
        {/* <div className='review-book'>
          <div className='info-label-title'>
            <span className='info-label-review'>Đánh giá sản phẩm</span>
            {productData.reviews?.map((review, index) => (
              <div key={index} className='user-review'>
                <div className='user-review-item'>
                  <span className='username'>{review.user.username}</span>
                  <span className='content-review'>{review.content}</span>
                </div>
                {index < productData.reviews.length - 1 && (
                  <div className="divider-line"></div>
                )}
              </div>
            ))}
          </div>
        </div> */}
        
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
