import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const useSignup = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        userData
      );
      login(response.data.token, response.data.user);

      // Redirect based on role
      if (response.data.user.role === "service") {
        navigate("/service-home");
      } else {
        navigate("/uhomepage");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const registerServicePerson = async (serviceData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        serviceData
      );
      login(response.data.token, response.data.user);
      navigate("/service-home");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registerUser, registerServicePerson };
};

export default useSignup;
