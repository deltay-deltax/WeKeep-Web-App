import { Card, Typography, Form, Input, Button, Spin, Alert } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../Utils/AnimationData.json";
import useSignup from "../hooks/useSignup";

const ServiceSignUpPage = () => {
  const { loading, error, registerServicePerson } = useSignup();

  const handleSubmit = (values) => {
    // Add role to the values
    const serviceData = {
      ...values,
      role: "service",
    };
    registerServicePerson(serviceData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 p-4">
      <Card className="w-full max-w-lg p-8 bg-white rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          <Lottie animationData={animationData} className="w-32 h-32 mb-6" />
          <Typography.Title level={3} strong className="mb-6 text-center">
            Create Service Provider Account
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
              rules={[{ required: true, message: "Please enter your name" }]}
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
                { required: true, message: "Please enter your email" },
                { type: "email", message: "The email is not valid" },
              ]}
              className="mb-4"
            >
              <Input placeholder="Email" size="large" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              label="Shop Name"
              name="shopName"
              rules={[
                { required: true, message: "Please enter your shop name" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Shop Name"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter your address" }]}
              className="mb-4"
            >
              <Input.TextArea
                placeholder="Address"
                size="large"
                className="rounded-lg"
                rows={3}
              />
            </Form.Item>

            <Form.Item
              label="GST Number"
              name="gstNo"
              rules={[
                { required: true, message: "Please enter your GST number" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="GST Number"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
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
                { required: true, message: "Please confirm your password" },
              ]}
              className="mb-4"
            >
              <Input.Password
                placeholder="Confirm Password"
                size="large"
                className="rounded-lg"
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

            <Form.Item className="mb-4">
              <Button
                type={`${loading ? " " : "primary"}`}
                htmlType="submit"
                size="large"
                className="w-full rounded-lg bg-green-500 hover:bg-green-600 text-white"
              >
                {loading ? <Spin /> : "Sign Up"}
              </Button>
            </Form.Item>

            <Form.Item className="text-center">
              <span>Already have an account?</span>
              <Link to="/login">
                <Button
                  type="link"
                  size="large"
                  className="ml-2 text-green-500 hover:text-green-600"
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

export default ServiceSignUpPage;
