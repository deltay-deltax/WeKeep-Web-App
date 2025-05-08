import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    {/* This is to make sure to add react Strictness */}
    <AuthProvider>
      {/* To provide the authentication */}
      <App />
    </AuthProvider>
  </StrictMode>
);

reportWebVitals();
