// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import SignUpPage from "../Logins/SignUpPage";
// import { Login } from "../backend/Controllers/authController";
// import DashBoard from "../Logins/DashBoard";
// import UserHomePage from "../ApplicationUsers/UserHomePage";

// function Body({ isAuthenticated }) {
//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={
//           !isAuthenticated ? <SignUpPage /> : <Navigate to="/dashboard" />
//         }
//       />
//       <Route
//         path="/login"
//         element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
//       />
//       <Route
//         path="/dashboard"
//         element={isAuthenticated ? <DashBoard /> : <Navigate to="/login" />}
//       />
//       <Route path="/uhomepage" element={<UserHomePage />} />
//     </Routes>
//   );
// }

// export default Body;


import React from 'react'

const Body = () => {
  return (
    <div>Body</div>
  )
}

export default Body