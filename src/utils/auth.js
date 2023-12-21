// auth.js

import { API_BASE_URL } from "../context/Constant";

export const checkToken = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo && userInfo.accessToken) {
    // Kiểm tra token đã hết hạn hay chưa
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (userInfo.expireTime < currentTimestamp) {
      // Token đã hết hạn, kiểm tra xem có refreshToken không
      if (userInfo.data && userInfo.data.refreshToken) {
        // Refresh token
        refreshToken(userInfo.data.refreshToken);
      } else {
        // Không có refreshToken, có thể yêu cầu đăng nhập lại
        console.error('Không có refreshToken');
      }
    }

    // Token còn hạn, bạn có thể sử dụng userInfo.accessToken để gọi API
    return userInfo.accessToken;
  }

  // Không có token hoặc token hết hạn
  return null;
};

export const startTokenRefreshInterval = () => {
  // Kích thích làm mới token mỗi 5 phút (300000 milliseconds)
  setInterval(() => {
    refreshToken();
  }, 300000);
};

export const refreshToken = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo && userInfo.data && userInfo.data.refreshToken) {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: userInfo.data.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        userInfo.accessToken = data.accessToken;
        userInfo.data.refreshToken = data.refreshToken;

        // Lưu lại userInfo đã được cập nhật vào localStorage
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // Token mới đã được lưu, bạn có thể sử dụng userInfo.accessToken để gọi API
      } else {
        // Lỗi khi refresh token, có thể yêu cầu đăng nhập lại
        const data = await response.json();
        console.error('Lỗi khi refresh token');
        console.error(data.message);
      }
    } else {
      console.error('Không có refreshToken trong userInfo');
    }
  } catch (error) {
    console.error('Lỗi kết nối khi refresh token:', error);
  }
};
