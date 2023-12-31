import React, { useState, useEffect } from 'react'
import {
  CBreadcrumb,
  CBreadcrumbItem,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CLink,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CImage,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CButton,
  CInputGroupText,
  CInputGroup,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../assets/css/history.css'
import { API_BASE_URL } from "../context/Constant";
const ListAddress = () => {
  const [books, setBooks] = useState([])
  const [orders, setOrders] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [Addresses , setAddress] = useState([])
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [isAddressModalOpen,setIsAddressModalOpen] =useState(false)
  const [isAddNew,setIsAddNew] =useState(false)
  const [newAddress, setNewAddress] = useState('');
  const [updateKey, setUpdateKey] = useState(0);

  const resetRow = () => {
    setSelectedRowId(null)
  }
  useEffect(() => {
    if (!isAddressModalOpen) {
      resetRow()
    }
 }, [isAddressModalOpen])
 useEffect(() => {
    if (!isAddNew) {
        setNewAddress('');
    }},[isAddNew, newAddress])

  const handleRowClick = (id) => {
    setSelectedRowId(id)
    console.log("id row:",id)
    //handleShowOrderDetail(selectedRowId)
  }
    //Get profile user
    useEffect(() => {
        const userInfoString = localStorage.getItem("userInfo");
        const userInfo = JSON.parse(userInfoString);
        const token=userInfo.accessToken;
        // Gọi API để lấy thông tin từ server
        const fetchProfileData = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/user/profile`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, 
              },
            });
    
            if (response.ok) {
              const data = await response.json();
              setAddress(data.data.addresses)
              console.log(data.data.addresses)
            } else {
              console.error('Error fetching profile data:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching profile data:', error);
          }
        };
    
        fetchProfileData();
    }, [selectedAddress, newAddress, updateKey]);
    const triggerUpdate = () => {
    setUpdateKey((prevKey) => prevKey + 1);
    };
    useEffect(()=>{
        const address = Addresses.find((address) => address._id === selectedRowId)
        setSelectedAddress(address)
        console.log("ID cần get:",address)
    },[selectedRowId])
    //update address
    const handleUpdateAddress = async () =>{
        if (!selectedAddress && !newAddress) {
            return;
        }
        console.log("Địa chỉ thêm vào: ",newAddress);
        const updatedAddresses = [...Addresses];
        if(selectedAddress)
        {
            const indexToUpdate = updatedAddresses.findIndex(
                (address) => address._id === selectedAddress._id
                );
                if (indexToUpdate !== -1) {
                updatedAddresses[indexToUpdate] = {
                    ...updatedAddresses[indexToUpdate],
                    address: selectedAddress.address,
                };
        }
        }
        let update = updatedAddresses.map((address) => address.address);
        console.log("Địa chỉ cũ: ",update);
        console.log("Địa chỉ thêm vào: ",newAddress);
        if(newAddress){
            update =[...update, newAddress];
        }
        console.log("Địa chỉ mới: ",update);

        try {
            const userInfoString = localStorage.getItem("userInfo");
            const userInfo = JSON.parse(userInfoString);
            const token=userInfo.accessToken;
            const response = await fetch(`${API_BASE_URL}/user/profile/updateAddresses`, {
                method: 'PUT',
                headers: {
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                addresses: update}),
            });
        
            if (response.ok) {
                const updatedData = await response.json();
                console.log('Profile updated successfully:', updatedData);
                toast.success(updatedData.message, {
                onClose: () => {
                    setIsAddressModalOpen(false);
                    setIsAddNew(false);
                    triggerUpdate();
                },
                })
            } else {
                const updatedData = await response.json();
                console.error('Lỗi upload profile:', response.statusText);
                toast.error(updatedData.message)
            
            }
        } catch (error) {
        toast.error('Lỗi kết nối:', error);
        }
    } 
    
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader style={{display:'flex', flexDirection:'column'}}>
            <strong>Danh sách địa chỉ</strong>
            <CButton  style={{display:'flex', justifyContent:'flex-end',marginLeft:'0',marginTop:'10px'}}
             onClick={()=> {
                console.log("Button clicked");
                setIsAddNew(true)
                }} >Thêm địa chỉ</CButton>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Địa chỉ nhận hàng</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{display:'flex', justifyContent:'flex-end'}}>Thao tác</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {console.log('Address data:', Addresses)}
                {Addresses.map((address,index) => (
                  <CTableRow
                  key={index}
                  active={selectedRowId === address._id}
                  onClick={(e) => {
                    handleRowClick(address._id)
                  }}
                > 
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{address.address}</CTableDataCell>
                  <CTableDataCell style={{display:'flex', justifyContent:'flex-end'}}>
                    <CButton onClick={()=> {setIsAddressModalOpen(true)}} >Sửa</CButton>  
                  </CTableDataCell>
                   </CTableRow>
                  
                ))}
              </CTableBody>
            </CTable>
            {/* Modal xem chi tiết */}
            <CModal
              size="lg"
              alignment="center"
              visible={isAddressModalOpen}
              onClose={() => {
                setIsAddressModalOpen(false)
              }}
            >
              <CModalHeader closeButton>
                <CModalTitle>Thay đổi địa chỉ</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {/* Render product details here */}              
                    <div>
                      <CFormLabel><strong>Địa chỉ</strong></CFormLabel>
                      <CFormInput aria-label="address" value={selectedAddress? selectedAddress.address : ''}
                        onChange={(e) =>
                            setSelectedAddress({
                            ...selectedAddress,
                            address: e.target.value,
                            })
                      }/>
                    </div>
              </CModalBody>
              <CModalFooter>
                <CButton color="success" onClick={handleUpdateAddress}>Lưu</CButton>
              </CModalFooter>
            </CModal>
            {/* Thêm mới */}
            <CModal
              size="lg"
              alignment="center"
              visible={isAddNew}
              onClose={() => {
                setIsAddNew(false)
              }}
            >
              <CModalHeader closeButton>
                <CModalTitle>Thay đổi địa chỉ</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {/* Render product details here */}              
                    <div>
                      <CFormLabel><strong>Địa chỉ mới</strong></CFormLabel>
                      <CFormInput aria-label="address" 
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                      />
                    </div>
              </CModalBody>
              <CModalFooter>
                <CButton color="success" onClick={handleUpdateAddress}>Lưu</CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      </CCol>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </CRow>
  )
}


export default ListAddress;
