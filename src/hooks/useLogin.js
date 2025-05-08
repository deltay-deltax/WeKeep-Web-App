import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { message } from "antd";

// This hook will handle the login work
const useLogin = () => {
  const { login } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginUser = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const result = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await result.json();
      if (result.status === 200) {
        message.success(data.message);
        login(data.token, data.user);
      } else if (result.status === 404) {
        setError(data.message);
      } else {
        message.error("Login Failed");
      }
    } catch (error) {
      setError(error.message);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, loginUser };
};

export default useLogin;
