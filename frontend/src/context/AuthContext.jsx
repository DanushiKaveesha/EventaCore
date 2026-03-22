import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking an authenticated user for demonstration
    // In a real app, this would check localStorage or an API for session
    const mockUser = {
      _id: "67d94e7732d84d1234567890",
      name: "John Doe",
      email: "john@example.com",
      role: "Student",
    };
    
    setUser(mockUser);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
