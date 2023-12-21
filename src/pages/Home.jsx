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

const HomePage = () => {
  // const books = [
  //   {
  //     image: Book1,
  //     title: "Sample Book like me !!!",
  //     author: "Sample Author 1",
  //     price: "19.99",
  //   },
  //   {
  //     image: Book1,
  //     title: "Sample Book 2......",
  //     author: "Sample Author 2",
  //     price: "24.99",
  //   },
  //   {
  //     image: Book1,
  //     title: "Sample Book 3",
  //     author: "Sample Author 3",
  //     price: "29.99",
  //   },
  //   {
  //     image: Book1,
  //     title: "Sample Book 3",
  //     author: "Sample Author 3",
  //     price: "29.99",
  //   },
  //   {
  //     image: Book1,
  //     title: "Gau gau gau !!!",
  //     author: "Sample Author 1",
  //     price: "19.99",
  //   },
  //   {
  //     image: Book1,
  //     title: "Sample Book 2......",
  //     author: "Sample Author 2",
  //     price: "24.99",
  //   },
  //   {
  //     image: Book1,
  //     title: "Sample Book 3",
  //     author: "Sample Author 3",
  //     price: "29.99",
  //   },
  //   {
  //     image: Book1,
  //     title: "Sample Book 3",
  //     author: "Sample Author 3",
  //     price: "29.99",
  //   },
  //   {
  //     image: Book1,
  //     title: "Sample Book 3",
  //     author: "Sample Author 3",
  //     price: "29.99",
  //   },
  //   {
  //     image: Book1,
  //     title: "Gau gau gau !!!",
  //     author: "Sample Author 1",
  //     price: "19.99",
  //   },
   
  // ];
  const [books, setBooks] = useState([])
  const navigate = useNavigate();

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
  const handleBookClick = (id) => {
    // Redirect to the book detail page with the book's ID
    navigate(`/book-detail/${id}`);
};
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
              {books.map((book, index) => (
                <SwiperSlide className='swiper-slide' key={book._id}>
                  <Book
                    image={book.image}
                    title={book.title}
                    author={book.author}
                    price={book.price}
                    _id ={book._id}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
          <div className="header-row">
              <button >See More</button>
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
                  {books.map((book, index) => (
                    <SwiperSlide className='swiper-slide' key={index}>
                      <Book
                        image={book.image}
                        title={book.title}
                        author={book.author}
                        price={book.price}
                        onClick={() => handleBookClick(book._id)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

              </div>
            
          </div>
          <div className="header-row">
                  <button >See More</button>
                </div>
        </div>
      </body>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default HomePage;