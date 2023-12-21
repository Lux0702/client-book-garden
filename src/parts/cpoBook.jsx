import React from 'react';
import "../assets/css/cpoBook.css"
import wish from "../assets/icons/wish.svg"
import { useNavigate } from 'react-router-dom';
const Book = (props) => {
    const { image, title, author, price,_id } = props;
    const navigate = useNavigate();

    const handleBookClick = () => {
        // Pass the book's ID to the book detail page
        navigate(`/book-detail/${_id}`);
    };
    return (
        <div className="container-book" onClick={handleBookClick}>
            <div className="image-container" style={{backgroundImage:`url(${image})` ,backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}>
                {/* <img src={image} alt={title} /> */}
            </div>
            <div className='container-content'>
                <div className='container-text'>
                    <h6>{title}</h6>
                    <div className='container-text-icon'>
                        <div>
                        <p>{author}</p>
                        <p1>{price} Đ</p1>
                        </div>
                        <img src={wish} alt=''/>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Book;