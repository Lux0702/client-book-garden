import React, { useState } from "react";
import "../assets/css/changepassword.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
} from "@coreui/react";
import { API_BASE_URL } from "../context/Constant";
const Changepassword = () => {
  const [oldPassWord, setoldPassWord] = useState("");
  const [passWord, setpassWord] = useState("");
  const [confirmPassWord, setconfirmPassWord] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo = JSON.parse(userInfoString);
  const token=userInfo.accessToken;
  const handleSubmit = async (e) => {
    console.log(token)
    e.preventDefault();

    // Kiểm tra xác nhận mật khẩu
    if (passWord !== confirmPassWord) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    // Gọi API để cập nhật mật khẩu
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassWord: oldPassWord,
          passWord: passWord,
          confirmPassWord: confirmPassWord,
        }),
      });

      if (response.ok) {
        // Xử lý khi cập nhật mật khẩu thành công
        toast.success("Cập nhật mật khẩu thành công!");
        // Đặt trạng thái đã cập nhật mật khẩu
        setPasswordUpdated(true);
        // Đặt lại giá trị của state về giá trị mặc định
        setoldPassWord("");
        setpassWord("");
        setconfirmPassWord("");
      } else {
        // Xử lý khi có lỗi từ API
        const errorData = await response.json();
        console.error("Error during password change:", errorData);
        const errorMessage =
          errorData.message || "Có lỗi xảy ra khi cập nhật mật khẩu.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error during password change:", error);
      toast.error("Có lỗi xảy ra khi cập nhật mật khẩu.");
    }
  };

  return (
    <div className="changePassword">
      <CForm onSubmit={handleSubmit}>
        <CFormLabel htmlFor="oldPassWord" className="label-change">Mật khẩu cũ</CFormLabel>
        <CFormInput
          className="input-change"
          type="password"
          id="oldPassWord"
          name="oldPassWord"
          placeholder="Nhập mật khẩu cũ"
          value={oldPassWord}
          onChange={(e) => setoldPassWord(e.target.value)}
        />

        <CFormLabel htmlFor="passWord" className="label-change">Mật khẩu mới</CFormLabel>
        <CFormInput
          className="input-change"
          type="password"
          id="passWord"
          name="passWord"
          placeholder="Nhập mật khẩu mới"
          value={passWord}
          onChange={(e) => setpassWord(e.target.value)}
        />

        <CFormLabel htmlFor="confirmPassWord" className="label-change">Xác nhận mật khẩu</CFormLabel>
        <CFormInput
          className="input-change"
          type="password"
          id="confirmPassWord"
          name="confirmPassWord"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassWord}
          onChange={(e) => setconfirmPassWord(e.target.value)}
        />
        <br />
        <CButton color="primary" type="submit">
          Xác nhận 
        </CButton>
      </CForm>
      {passwordUpdated && (
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      )}
      <ToastContainer/>
    </div>
  );
};

export default Changepassword;
