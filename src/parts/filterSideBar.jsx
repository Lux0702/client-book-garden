import React, { useState ,useEffect } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { FaBook, FaUser, FaLock, FaShoppingBag } from 'react-icons/fa';
import logo from '../assets/images/Book-logos_black.png';
import { Divider,Slider } from 'antd';
import "../assets/css/productList.css"
import Select from 'react-select';
import CheckboxList from '../components/TransferComponent';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CFormInput,
} from '@coreui/react'
import { Panel } from 'primereact/panel';
const FilterSideBar = () => {
  //const { focusedItem } = useSidebar();
  const [sliderValue, setSliderValue] = useState([0, 5000000]);
  const [categories,setCategories] = useState([])
  const [authors,setAuthors] = useState([])
  const [publishers,setPublishers] = useState([])

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  //categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3333/api/v1/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(
            data.data.map((category) => ({
              value: category.categoryName,
              label: category.categoryName,
            })),
          );
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
  //author
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3333/api/v1/authors");
        if (response.ok) {
          const data = await response.json();
          setAuthors(
            data.data.map((author) => ({
              value: author.authorName,
              label: author.authorName,
            })),
          );
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
    <div className='filter-sort-container'>
      <CAccordion flush>       
        <CAccordionItem >
          <CAccordionHeader><strong>Giá tiền</strong></CAccordionHeader>
          <CAccordionBody>
          <div>
            <CRow>
              <CCol xs="6" className="mb-3">
                <CFormInput disabled type="text" id="startNumber" name="status" value={formatCurrency(sliderValue[0] || 0)} />
              </CCol>
              <CCol xs="6" className="mb-3">
                <CFormInput disabled type="text" id="endNumber" name="status" value={formatCurrency(sliderValue[1] || 0)} />
              </CCol>
            </CRow>
          </div>
          <Slider range defaultValue={[0, 2000000]} max={2000000} onChange={handleSliderChange} />
          </CAccordionBody>
        </CAccordionItem>             
      </CAccordion>
      <Divider orientation style={{margin:"0"}}></Divider>
      <CAccordion flush>       
        <CAccordionItem >
          <CAccordionHeader><strong>Nhà xuất bản</strong></CAccordionHeader>
          <CAccordionBody>
            <Select
                isMulti
                name="colors"
                options={publishers}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Chọn các mục..."
                styles={{overflow:"hide"}}
              />
          </CAccordionBody>
        </CAccordionItem>             
      </CAccordion>
      <Divider orientation style={{margin:"0"}}></Divider>
      <CAccordion flush>       
        <CAccordionItem >
          <CAccordionHeader><strong>Tác giả</strong></CAccordionHeader>
          <CAccordionBody className='category-fill'>
            <Select
              isMulti
              name="colors"
              options={authors}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Chọn các mục..."
              styles={{overflow:"hide"}}
            />
          </CAccordionBody>
        </CAccordionItem>             
      </CAccordion>
      <Divider orientation style={{margin:"0"}}></Divider>
      <CAccordion flush>       
        <CAccordionItem >
          <CAccordionHeader><strong>Thể loại</strong></CAccordionHeader>
          <CAccordionBody className='category-fill'>
            <Select
              isMulti
              name="colors"
              options={categories}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Chọn các mục..."
              styles={{overflow:"hide"}}
            />
          </CAccordionBody>
        </CAccordionItem>             
      </CAccordion>
    </div>
  );
};

export default FilterSideBar;
