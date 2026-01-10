import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

 // localStorage.setItem('user', 'true'); // 存储用户登录状态


  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // 从 localStorage 中获取登录状态
    const storedUser = localStorage.getItem('user');
    return storedUser !== null; // 如果存在用户信息，则认为已登录
  });


  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('user', 'true'); // 存储用户登录状态
  };

  const logout = () => {
    setIsLoggedIn(false);
    // 清除所有认证相关的 localStorage 项
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    localStorage.removeItem('uid');
    localStorage.removeItem('email');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};