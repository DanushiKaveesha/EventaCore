import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          setUser(JSON.parse(userInfo));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("AuthContext parse error", err);
        setUser(null);
      }
      setLoading(false);
    };
    
    fetchUser();
    
    // Optional: listen for storage changes across tabs if needed
    window.addEventListener('storage', fetchUser);
    return () => window.removeEventListener('storage', fetchUser);
  }, []);

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
