// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Initialize user from localStorage if available
  useEffect(() => {
    const initializeUser = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('currentUser');

      if (savedToken && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setCurrentUser(userData);
          setToken(savedToken);
          
          // 선택사항: 서버에 토큰 유효성 검증
          // const response = await fetch(`http://localhost:8080/api/verify-token`, {
          //   headers: {
          //     'Authorization': `Bearer ${savedToken}`
          //   }
          // });
          
          // if (!response.ok) {
          //   // 토큰이 만료되었거나 유효하지 않음
          //   logout();
          // }
        } catch (error) {
          console.error('Failed to parse saved user data:', error);
          logout();
        }
      }
    };

    initializeUser();
  }, []);

  const login = (userData, authToken) => {
    setCurrentUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      token,
      login,
      logout,
      isAuthenticated: !!token && !!currentUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};