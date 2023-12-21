import React, { useState, useEffect } from 'react';
import BookDetail from '../parts/cpoBookDetail';
import Header from '../parts/Header';
import Footer from '../parts/Footer';
import '../assets/css/detail.css';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const [productData, setProductData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    // Bất kỳ xử lý nào khác khi số lượng thay đổi ở đây
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`http://localhost:3333/api/v1/books/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProductData(data.data.data);
        } else {
          console.error('Error fetching product data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [id]);

  if (!productData) {
    return <p>Loading...</p>;
  }

  const { bookDTO, pageNumbers, publisher, language, isbn, publishedDate, description, image } = productData;

  return (
    <div>
      <Header />
      <div className='book-detail-container'>
        <h1 className='book-h2'>Chi tiết sản phẩm</h1>
        <BookDetail product={productData} onQuantityChange={handleQuantityChange} />
        <div className='book-detail'>
          <h2>Thông tin sản phẩm</h2>
          <div className="book-info">
            <img src={image} alt=""  className='product-detail' style={{width:'200px',height:'200px'}}/>
            <div className="info-row">
              <span className="info-label">Mã hàng:</span>
              <span className="tabbed-text">{isbn}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Thể loại:</span>
              <span className="tabbed-text">
                {bookDTO.categories?.map((category, index) => (
                  <span key={index}>{index > 0 && ', '}{category.categoryName}</span>
                )) || <span>Không có thể loại</span>}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Tác giả:</span>
              <span className="tabbed-text">
              {bookDTO.authors?.map((author, index) => (
                  <span key={index}>{index > 0 && ', '}{author.authorName}</span>
                )) || <span>Không có tác giả</span>}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">NXB:</span>
              <span className="tabbed-text">{publisher}</span>
            </div>
            <div className="divider-line"></div>
            <span className="info-label-tilte">{bookDTO.title}</span>
            <span>{description}</span>
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
