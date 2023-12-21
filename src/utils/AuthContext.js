// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkToken, refreshToken } from './auth'; // Đường dẫn có thể cần điều chỉnh tùy thuộc vào cấu trúc dự án của bạn

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = checkToken();
    setAccessToken(token);
  }, []);

  const refreshAccessToken = async () => {
    await refreshToken();
    const newToken = checkToken();
    setAccessToken(newToken);
  };

  const contextValue = {
    accessToken,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
