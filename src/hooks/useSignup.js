import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { message } from "antd";

// this is the user defined hook that will take of the SignUp work
const useSignup = () => {
  const { login } = useAuth(); //This is to put the contents of the signedUp user to login page

  const [error, setError] = useState(null); // for any error
  const [loading, setLoading] = useState(false); // for any loading

  // This function will take care of the signUp logic
  // const registerUser = async (values) => {
  //   console.log(values.password);
  //   console.log(" ah asf" + values.passwordConfirmation);
  //   // Check whether the password and confirmed password are the same
  //   if (values.password !== values.passwordConfirmation) {
  //     return setError("Passwords aren't matching");
  //   }
  //   //if passwords match
  //   // SignUp Logic
  //   try {
  //     setError(null); //make the error to null since no error is present at present
  //     setLoading(true); // loading should be true since we are sending the data to the server so that ui should be spinning
  //     const result = await fetch("http://localhost:8000/api/auth/signup", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(values),
  //     });

  //     // once we post the data into the server then we will wait for the response
  //     const data = await result.json();
  //     // If we get the data then we will send the data to the login thing
  //     if (result.status === 201) {
  //       message.success(data.message);
  //       login(data.token, data.user);
  //     } else if (result.status === 400) {
  //       console.log(data.message);
  //       setError(data.message);
  //     } else {
  //       message.error("SignUp Failed");
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //     message.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const registerUser = async (values) => {
    console.log(values.password);
    console.log(" ah asf" + values.passwordConfirmation);

    // Check whether the password and confirmed password are the same
    if (values.password !== values.passwordConfirmation) {
      return setError("Passwords aren't matching");
    }

    // Add an extra component to the user data (e.g., a default role)
    const modifiedValues = {
      ...values,
      role: "user", // You can replace this with any other component you want to add
    };
    const { name, email, password, passwordConfirmation, role } = modifiedValues;

    // Log the destructured values
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Password Confirmation:", passwordConfirmation);
    console.log("User:", role);

    // SignUp Logic
    try {
      setError(null); // make the error to null since no error is present at present
      setLoading(true); // loading should be true since we are sending the data to the server so that ui should be spinning

      const result = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedValues), // Use modifiedValues here
      });

      // Once we post the data into the server then we will wait for the response
      const data = await result.json();

      // If we get the data then we will send the data to the login thing
      if (result.status === 201) {
        message.success(data.message);
        login(data.token, data.user);
      } else if (result.status === 400) {
        console.log(data.message);
        setError(data.message);
      } else {
        message.error("SignUp Failed");
      }
    } catch (error) {
      setError(error.message);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registerUser };
};

export default useSignup;
