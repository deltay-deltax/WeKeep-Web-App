import { Card, Typography, Form, Input, Button, Spin, Alert } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../Utils/AnimationData.json";
import useSignup from "../hooks/useSignup";

// This is the signUp Page UI
const SignUpPage = () => {
  const { loading, error, registerUser } = useSignup(); //to make the ui for better

  const handleSubmit = (values) => {
    // console.log(values); // for the testing purpose
    registerUser(values); //is is the component made by useSignup hook
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <Card className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          <Lottie animationData={animationData} className="w-32 h-32 mb-6" />
          <Typography.Title level={3} strong className="mb-6 text-center">
            Create an Account
          </Typography.Title>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            className="w-full"
          >
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Full Name"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email",
                },
                {
                  type: "email",
                  message: "The email is not valid",
                },
              ]}
              className="mb-4"
            >
              <Input placeholder="Email" size="large" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                },
              ]}
              className="mb-4"
            >
              <Input.Password
                placeholder="Password"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="passwordConfirmation"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password",
                },
              ]}
              className="mb-4"
            >
              <Input.Password
                placeholder="Confirm Password"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            {/* TO add the custom message from the antd library */}
            {error && (
              <Alert
                description={error}
                type="error"
                showIcon
                closable
                className="alert"
              />
            )}

            <Form.Item className="mb-4">
              <Button
                // To make the ui button better
                type={`${loading ? " " : "primary"}`}
                htmlType="submit"
                size="large"
                className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? <Spin /> : "Sign Up"}
                {/* If the loading is true then make it Spinning else show the SignUp text */}
              </Button>
            </Form.Item>
            <Form.Item className="text-center">
              <span>Already have an account?</span>
              <Link to="/login">
                <Button
                  type="link"
                  size="large"
                  className="ml-2 text-blue-500 hover:text-blue-600"
                >
                  Login
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default SignUpPage;
