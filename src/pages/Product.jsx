import React, { useState } from 'react';
import Book from '../parts/cpoBook';


const Product = () => {
    // State để lưu trữ giá trị bộ lọc và danh sách sản phẩm
    const [priceFilter, setPriceFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [authorFilter, setAuthorFilter] = useState('');
  
    // Danh sách các sản phẩm (giả sử đã lấy từ API hoặc cơ sở dữ liệu)
    const products = [
        {
          id: 1,
          title: 'Sách 1',
          category: 'fiction',
          price: 25.99,
          authors: 'John Doe',
          image: 'https://via.placeholder.com/150',
        },
        {
          id: 2,
          title: 'Sách 2',
          category: 'non-fiction',
          price: 15.99,
          author: 'Jane Doe',
          image: 'https://via.placeholder.com/150',
        },
        // Add more products as needed
      ];
      
  
    // Hàm lọc danh sách sản phẩm dựa trên bộ lọc
    const filteredProducts = products.filter(product => {
      // Kiểm tra các bộ lọc và áp dụng tiêu chí tương ứng
      if (priceFilter && product.price !== priceFilter) {
        return false;
      }
  
      if (categoryFilter && !product.categories.some(category => category.categoryName === categoryFilter)) {
        return false;
      }
  
      if (authorFilter && !product.authors.some(author => author.authorName === authorFilter)) {
        return false;
      }
  
      return true;
    });
  
    return (
      <div className="container">
        {/* Hiển thị các bộ lọc */}
        <div className="filters">
          {/* Bộ lọc giá */}
          <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
            <option value="">Tất cả giá</option>
            {/* Các tùy chọn giá */}
          </select>
  
          {/* Bộ lọc danh mục */}
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">Tất cả danh mục</option>
            {/* Các tùy chọn danh mục */}
          </select>
  
          {/* Bộ lọc tác giả */}
          <select value={authorFilter} onChange={e => setAuthorFilter(e.target.value)}>
            <option value="">Tất cả tác giả</option>
            {/* Các tùy chọn tác giả */}
          </select>
        </div>
  
        {/* Hiển thị danh sách sản phẩm */}
        <div className="product-list">
          {filteredProducts.map(product => (
            <Book
              key={product._id}
              image={product.image}
              title={product.title}
              author={product.authors[0].authorName}
              price={product.price}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default Product;