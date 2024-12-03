"use client";

import React, { useState } from "react";

import { Button, Checkbox, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { login } from "../api/auth";
import { toast } from "react-toastify";
import useTokenStore from "@/stores/useTokenStore";

type UserLoginType = {
  username?: string;
  password?: string;
  remember: boolean;
};

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserLoginType | null>(null);

  const setToken = useTokenStore((state) => state.setToken);

  const setUserWithPredifinedDataPosition = (
    username = user?.username,
    password = user?.password,
    remember = false
  ) => {
    setUser({ username, password, remember });
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  const handleLoginClick = () => {
    const token = btoa(`${user?.username}:${user?.password}`);
    login(token)
      .then((data) => {
        setToken(data.token, user?.remember ? false : true);
        toast.success("Se ha iniciado la session correctamente!");
        router.push("/");
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
        autoComplete="off"
      >
        <Form.Item<UserLoginType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            onChange={(e) =>
              setUserWithPredifinedDataPosition(
                e.target.value,
                user?.password,
                user?.remember
              )
            }
          />
        </Form.Item>

        <Form.Item<UserLoginType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            onChange={(e) =>
              setUserWithPredifinedDataPosition(
                user?.username,
                e.target.value,
                user?.remember
              )
            }
          />
        </Form.Item>

        <Form.Item<UserLoginType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox
            onChange={(e) =>
              setUserWithPredifinedDataPosition(
                user?.username,
                user?.password,
                e.target.value
              )
            }
          >
            Remember me
          </Checkbox>
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
