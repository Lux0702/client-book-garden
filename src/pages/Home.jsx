import React , {useState, useEffect} from 'react';
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import DemoCarousel from "../parts/BannerBar";
import Book from "../parts/cpoBook";
import Book1 from "../assets/images/book1.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import '../assets/css/home.css'
import 'swiper/swiper-bundle.css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import {  Spin } from 'antd'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import wished from "../assets/icons/wished.png"
import wish from "../assets/icons/wish.svg"
import { API_BASE_URL } from "../context/Constant";
const HomePage = () => {
  const [books, setBooks] = useState([])
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [iconWish, setIsIconWish]= useState(false);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setSpinning(true)
        const response = await fetch('http://localhost:3333/api/v1/books')
        if (response.ok) {
          const book = await response.json()
          setBooks(book.data)
          //localStorage.setItem('bookData',JSON.stringify(book.data))
          //console.log('Get data success', books)
        } else {
          console.error('Error fetching books:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
      }finally {
        setSpinning(false);
      }
    }

    fetchBooks()
  }, [])
  // useEffect(()=>{
  //   const dataString = localStorage.getItem('bookData')
  //   const data = JSON.parse(dataString);
  //   if(data)
  //     setBooks(data)
  // },[])
//   const handleBookClick = (id) => {
//     // Redirect to the book detail page with the book's ID
//     navigate(`/book-detail/${id}`);
// };
const handleSeeMoreClick = () => {
  navigate('/book-list');
};
const handleWishChange = async (_id)=>{
  try {
    setSpinning(true);
    const userInfoString = localStorage.getItem("userInfo");
    if (!userInfoString) {
      toast.info("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }
    const userInfo = JSON.parse(userInfoString);
    const token=userInfo.accessToken;
    const response = await fetch(`${API_BASE_URL}/books/${_id}/addToWishList`, {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const updatedData = await response.json();
        console.log('Profile updated successfully:', updatedData);
        toast.success(updatedData.message)
        setIsIconWish(!wished)
    } else {
        const updatedData = await response.json();
        console.error('Lỗi upload profile:', response.statusText);
        toast.error(updatedData.message)
    
    }
    } catch (error) {
    toast.error('Lỗi kết nối:', error);
    }finally {
      setSpinning(false);
    }
}
  return (
    <div>
      <header>
        <Header />
      </header>
      <body>
        <div className="container">
          <DemoCarousel />
          <h2>Top sản phẩm</h2>
          <div className="swiper-container">
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
              {books.slice(0, 10).map((book, index) => (
                <SwiperSlide className='swiper-slide' key={book._id}>
                  <Book
                    image={book.image}
                    title={book.title}
                    author={book.authors}
                    price={book.price}
                    _id ={book._id}
                    onWishChange={() => handleWishChange(book._id)}
                    wish_icon ={iconWish}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
          <div className="header-row">
              <button  onClick={handleSeeMoreClick}>See More</button>
            </div>
          <div className='category-romatic'>
              <h2>Top đề cử</h2>
              <div className="swiper-container">
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
                  {books.slice(0, 10).map((book, index) => (
                    <SwiperSlide className='swiper-slide' key={index}>
                      <Book
                        image={book.image}
                        title={book.title}
                        author={book.author}
                        price={book.price}
                        _id ={book._id}
                        onWishChange={() => handleWishChange(book._id)}
                        wish_icon ={iconWish}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

              </div>
            
          </div>
          <div className="header-row">
                  <button  onClick={handleSeeMoreClick} >See More</button>
                </div>
        </div>
      </body>
      <footer>
        <Footer />
      </footer>
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
        <Spin spinning={spinning} fullscreen />
    </div>
  );
};

export default HomePage;