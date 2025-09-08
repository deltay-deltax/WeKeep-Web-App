import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Spin,
  Alert,
  Tooltip,
} from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../Utils/AnimationData.json";
import useSignup from "../hooks/useSignup";
import { InfoCircleOutlined } from "@ant-design/icons";

const ServiceSignUpPage = () => {
  const { loading, error, registerServicePerson } = useSignup();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    // Add role to the values and format Google Maps info
    const serviceData = {
      ...values,
      role: "service",
      googleMapsInfo: {
        businessName: values.googleBusinessName,
        placeId: values.googlePlaceId,
      },
    };

    // Remove the individual fields that were moved to the googleMapsInfo object
    delete serviceData.googleBusinessName;
    delete serviceData.googlePlaceId;

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
            form={form}
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

            {/* Google Maps Information Section */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Typography.Title level={5} className="mb-3">
                Google Maps Information
                <Tooltip title="This information helps customers find your shop on the map">
                  <InfoCircleOutlined className="ml-2 text-blue-500" />
                </Tooltip>
              </Typography.Title>

              <Form.Item
                label="Google Business Name (exactly as it appears on Google Maps)"
                name="googleBusinessName"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Google Maps business name",
                  },
                ]}
                className="mb-4"
              >
                <Input
                  placeholder="e.g., Sharma Electronics"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label="Google Place ID (optional)"
                name="googlePlaceId"
                tooltip="You can find your Place ID by searching for your business on Google Maps, right-clicking on your listing, and selecting 'Share' then 'Copy place ID'"
                className="mb-0"
              >
                <Input
                  placeholder="e.g., ChIJN1t_tDeuEmsRUsoyG83frY4"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
              <div className="text-xs text-gray-500 mt-1">
                Your shop will need to be verified by our team before appearing
                in search results
              </div>
            </div>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
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
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match")
                    );
                  },
                }),
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
                className="alert mb-4"
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
