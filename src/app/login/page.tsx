"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUsername, setPassword, setToken } from "../../redux/userSlice";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import type { RootState } from "../../redux/store.ts";
import { login } from "../api/auth";
import { toast } from "react-toastify";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LoginPage: React.FC = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { username, password } = useSelector((state: RootState) => state.user);

  const handleRegisterClick = () => {
    router.push("/register");
  };

  const handleLoginClick = () => {
    const token = btoa(`${username}:${password}`);
    login(token)
      .then((data) => {
        dispatch(setToken(data.token));
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input onChange={(e) => dispatch(setUsername(e.target.value))} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-start",
            }}
          >
            <Button
              onClick={handleRegisterClick}
              type="text"
              size="middle"
              style={{ padding: "5px 15px" }}
            >
              Crear cuenta
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ padding: "5px 15px" }}
              onClick={handleLoginClick}
            >
              Loggear
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
