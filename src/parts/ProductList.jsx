import React , {useState, useEffect} from 'react';
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import DemoCarousel from "../parts/BannerBar";
import Book from "../parts/cpoBook";
import Book1 from "../assets/images/book1.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import '../assets/css/productList.css'
import {  useLocation } from 'react-router-dom';
import { Pagination,Row, Col } from 'antd';
import 'antd/dist/reset.css';
import { FaArrowRight } from 'react-icons/fa';
import FilterSideBar from "../parts/filterSideBar"
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import {  Spin } from 'antd'
const ProductList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [books, setBooks] = useState([])
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const { search } = useLocation();
    const searchTerm = new URLSearchParams(search).get('search');
    const [searchKey, setIsSearchKey] =useState('')
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [categories,setCategories] = useState([])
  // Hàm chuyển trang
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
    //categories
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("http://localhost:3333/api/v1/categories");
          if (response.ok) {
            const data = await response.json();
            setCategories(data.data);
            console.log("data category",categories)
          } else {
            console.error('Error fetching  data:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching  data:', error);
        }
      };
  
      fetchData();
    }, []);
  //get all book
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setSpinning(true);
        const response = await fetch('http://localhost:3333/api/v1/books')
        if (response.ok) {
          const book = await response.json()
          setBooks(book.data)
          setFilteredBooks(book.data);
          //localStorage.setItem('bookData',JSON.stringify(book.data))
          console.log('Get data success', books)
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
  //   if(data){
  //     setBooks(data);
  //     setFilteredBooks(data)
  //   }
  // },[])
  useEffect(() => {
    setIsSearchKey(searchTerm || '')
    console.log('Search key:', searchTerm);
    // Tiếp tục xử lý logic tìm kiếm ở đây
  }, [searchTerm]);
  const currentProducts = searchKey ? filteredBooks : (books && books.slice(indexOfFirstItem, indexOfLastItem)) || [];
  //filter search
  useEffect(() => {
    // Filter books based on the search term
    const filtered = books.filter((book) =>
    book.title && searchKey && book.title.toLowerCase().includes(searchKey.toLowerCase())
  );
    console.log(filteredBooks)
    setFilteredBooks(filtered);
  }, [searchKey]);

  return (
    <div>
      <header>
        <Header />
      </header>
      <body>
        <div className='filter-container'>
            <p style={{marginBottom:"0"}}>
              <strong>Sắp xếp:</strong>
              <span className='sort-span'> Tên từ A <FaArrowRight /> Z </span>
              <span className='sort-span'> Tên từ Z <FaArrowRight /> A </span>
              <span className='sort-span'> Giá tăng dần  </span>
              <span className=' sort-span'> Giá giảm dần  </span>
              
            </p>
        </div>
        <div  style={{width:"90%"}}>
       <CRow>
            <CCol xs="3" className="mb-3">
              <FilterSideBar className=""/>
            </CCol>
              <CCol xs="6" className="mb-2 productlist-constainer">
                  {currentProducts.map((product, index) => (
                    (index % 10 === 0) && (
                      <Row key={index} gutter={[210, 50]}>
                        {currentProducts.slice(index, index + 10).map((product, subIndex) => (
                          <Col key={subIndex} xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Book
                              image={product.image}
                              title={product.title}
                              author={product.authors}
                              price={product.price}
                              _id={product._id}
                            />
                          </Col>
                        ))}
                      </Row>
                    )
                  ))}
                  
              </CCol>
          </CRow>
          
        </div>

        
        
        

        <div className='Pagination'>
        <Pagination
        current={currentPage}
        total={(filteredBooks && filteredBooks.length) || (books && books.length) || 0}
        pageSize={itemsPerPage}
        onChange={handleChangePage}
         />
        </div>
      </body>
      <footer>
        <Footer />
      </footer>
      <Spin spinning={spinning} fullscreen />

    </div>
  );
};

export default ProductList;