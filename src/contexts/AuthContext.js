import React, { createContext, useContext, useEffect, useState } from "react";

// This component is used for the authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // For the jwt tokens
  const [userData, setUserData] = useState(null); // to store all the user data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // authenticated or not

  // to store the data
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user_data")); //store the data in the localStorage
    if (storedData) {
      const { userToken, user } = storedData; //take the token and user information
      setToken(userToken); //set the token
      setUserData(user); //set the user data
      setIsAuthenticated(true); //make the user authenticated
    }
  }, []);

  // const login = (newToken, newData) => {
  //   //  store the userData to the localStorage
  //   localStorage.setItem(
  //     "user_data",
  //     JSON.stringify({ userToken: newToken, user: newData })
  //   );
  //   console.log("sn" + { ...newData });
  //   setToken(newToken);
  //   setUserData(newData);
  //   setIsAuthenticated(true);
  // };

  const login = (newToken, newData) => {
    // Log the entire newData object to check its structure
    console.log("New Data:", newData);

    // Destructure properties from newData
    const { name, email, role } = newData;

    // Store the userData to the localStorage
    localStorage.setItem(
      "user_data",
      JSON.stringify({ userToken: newToken, user: newData })
    );

    console.log("sn", name, email, role); // example of using destructured variables

    setToken(newToken);
    setUserData(newData);
    setIsAuthenticated(true);
  };

  // During logout remove the item from the localStorage
  const logout = () => {
    localStorage.removeItem("user_data");
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, login, logout, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
