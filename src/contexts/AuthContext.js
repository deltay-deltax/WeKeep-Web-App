import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // NEW: Add loading state

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("user_data"));
        if (storedData) {
          const { userToken, user } = storedData;
          setToken(userToken);
          setUserData(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false); // Always set loading to false
      }
    };

    initializeAuth();
  }, []);

  const login = (newToken, newData) => {
    console.log("Login data:", newData);

    localStorage.setItem(
      "user_data",
      JSON.stringify({ userToken: newToken, user: newData })
    );

    setToken(newToken);
    setUserData(newData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user_data");
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
        userData,
        loading, // NEW: Export loading state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
