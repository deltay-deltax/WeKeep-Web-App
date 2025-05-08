import { Card, Typography, Form, Input, Button, Alert, Spin } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../Utils/AnimationData.json";
import useLogin from "../hooks/useLogin";

const Login = () => {

  const { loading, error, loginUser } = useLogin();

  const handleLogin = async (values) => {
    await loginUser(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-lg p-10 bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center">
          <Lottie animationData={animationData} className="w-40 h-40 mb-8" />
          <Typography.Title
            level={3}
            strong
            className="mb-8 text-center text-gray-800"
          >
            Log into the Account
          </Typography.Title>

          <Form
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
            className="w-full"
          >
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
              className="mb-6"
            >
              <Input
                placeholder="Email"
                size="large"
                className="rounded-lg p-2 border-gray-300"
              />
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
              className="mb-6"
            >
              <Input.Password
                placeholder="Password"
                size="large"
                className="rounded-lg p-2 border-gray-300"
              />
            </Form.Item>

            {error && (
              <Alert
                description={error}
                type="error"
                showIcon
                closable
                className="alert"
              />
            )}

            <Form.Item className="mb-6">
              <Button
                type={`${loading ? " " : "primary"}`}
                htmlType="submit"
                size="large"
                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2"
              >
                {loading ? <Spin /> : "Login"}
              </Button>
            </Form.Item>

            <Form.Item className="text-center">
              <span className="text-gray-700">Don't have an account?</span>
              <Link to="/">
                <Button
                  type="link"
                  size="large"
                  className="ml-2 text-indigo-500 hover:text-indigo-700 font-semibold"
                >
                  Sign Up
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
