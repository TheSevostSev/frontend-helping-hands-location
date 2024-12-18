"use client";

import React, { useState } from "react";

import { Button, Checkbox, Form, Input, Divider, Image } from "antd";
import { useRouter } from "next/navigation";
import { basicLogin } from "../api/auth";
import { toast } from "react-toastify";
import useTokenStore from "@/stores/useTokenStore";
import { signIn } from "next-auth/react";
import AuthLayout from "../layouts/AuthLayout";

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

  const handleCancelClick = () => {
    router.push("/");
  };

  const handleLoginClick = () => {
    basicLogin(user)
      .then((data) => {
        setToken(data.token, user?.remember ? false : true);
        toast.success("Se ha iniciado la sesión correctamente!");
        router.push("/");
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Ha ocurrido un error";
        toast.error(errorMessage);
      });
  };

  const handleLoginWithGoogle = () => {
    signIn("google");
  };

  return (
    <AuthLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "500px",
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
            label="Usuario"
            name="username"
            rules={[
              {
                required: true,
                message: "Porfavor ingresa tu nombre de usuario",
              },
            ]}
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
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: "Porfavor ingresa una contraseña" },
            ]}
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
              Recuerdame
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
                onClick={handleCancelClick}
                type="text"
                size="middle"
                style={{ padding: "5px 15px" }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ padding: "5px 15px" }}
                onClick={handleLoginClick}
              >
                ACCEDER
              </Button>
            </div>
          </Form.Item>

          <Divider style={{ borderColor: "#000000", padding: "10px 10px" }}>
            O
          </Divider>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              type="primary"
              shape="round"
              onClick={handleLoginWithGoogle}
              icon={
                <Image
                  src="/icons/google-logo.png"
                  alt="Location"
                  preview={false}
                  style={{ width: 30, height: 30 }}
                />
              }
              size="large"
            >
              Continuar con Google
            </Button>
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
