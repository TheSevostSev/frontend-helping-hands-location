"use client";

import React, { useState } from "react";
import { Button, Form, Input, Select, Divider } from "antd";
import { useRouter } from "next/navigation";
import { register } from "../api/auth";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getListUserTypes } from "../api/type";

type UserRegisterType = {
  username?: string;
  password?: string;
  typeId?: number;
  firstName?: string;
  lastName?: string | null;
  email?: string;
  phoneNumber?: string | null;
};

type UserType = {
  id: number;
  name: string;
};

const { Option } = Select;

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<UserRegisterType | null>(null);

  const handleLoginCLick = () => {
    router.push("/login");
  };

  const { data: userTypes } = useQuery({
    queryFn: getListUserTypes,
    queryKey: ["user_types"],
    staleTime: 1000 * 60 * 5,
  });

  const setUserWithPredifinedDataPosition = (
    username = user?.username,
    password = user?.password,
    typeId = user?.typeId,
    firstName = user?.firstName,
    lastName = user?.lastName,
    email = user?.email,
    phoneNumber = user?.phoneNumber
  ) => {
    setUser({
      username,
      password,
      typeId,
      firstName,
      lastName,
      email,
      phoneNumber,
    });
  };

  const handleRegisterClick = () => {
    register(user)
      .then(() => {
        toast.success("El usuario se ha registrado con exito");
        router.push("/");
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage);
      });
  };

  return (
    <>
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
          style={{ maxWidth: "100vh" }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Divider style={{ borderColor: "#000000" }}>
            Authentification information
          </Divider>
          <Form.Item<UserRegisterType>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              onChange={(e) =>
                setUserWithPredifinedDataPosition(
                  e.target.value,
                  user?.password,
                  user?.typeId,
                  user?.firstName,
                  user?.lastName,
                  user?.email,
                  user?.phoneNumber
                )
              }
            />
          </Form.Item>

          <Form.Item<UserRegisterType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              onChange={(e) =>
                setUserWithPredifinedDataPosition(
                  user?.username,
                  e.target.value,
                  user?.typeId,
                  user?.firstName,
                  user?.lastName,
                  user?.email,
                  user?.phoneNumber
                )
              }
            />
          </Form.Item>

          <Divider style={{ borderColor: "#000000" }}>
            Personal information
          </Divider>

          <Form.Item<UserRegisterType>
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your First Name!" },
            ]}
          >
            <Input
              onChange={(e) =>
                setUserWithPredifinedDataPosition(
                  user?.username,
                  user?.password,
                  user?.typeId,
                  e.target.value,
                  user?.lastName,
                  user?.email,
                  user?.phoneNumber
                )
              }
            />
          </Form.Item>

          <Form.Item label="Last Name" name="lastName">
            <Input
              onChange={(e) =>
                setUserWithPredifinedDataPosition(
                  user?.username,
                  user?.password,
                  user?.typeId,
                  user?.firstName,
                  e.target.value,
                  user?.email,
                  user?.phoneNumber
                )
              }
            />
          </Form.Item>

          <Form.Item<UserRegisterType>
            label="Type"
            name="typeId"
            rules={[
              { required: true, message: "Por favor pon tu tipo de usuario!" },
            ]}
          >
            <Select
              style={{ width: 120 }}
              allowClear
              onChange={(e) =>
                setUserWithPredifinedDataPosition(
                  user?.username,
                  user?.password,
                  Number(e),
                  user?.firstName,
                  user?.lastName,
                  user?.email,
                  user?.phoneNumber
                )
              }
              placeholder="Elige tu tipo de usuario"
            >
              {userTypes?.map((item: UserType) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider style={{ borderColor: "#000000" }}>
            Contact information
          </Divider>

          <Form.Item<UserRegisterType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              onChange={(e) =>
                setUserWithPredifinedDataPosition(
                  user?.username,
                  user?.password,
                  user?.typeId,
                  user?.firstName,
                  user?.lastName,
                  e.target.value,
                  user?.phoneNumber
                )
              }
            />
          </Form.Item>

          <Form.Item label="Phone number" name="phoneNumber">
            <Input
              onChange={(e) =>
                setUserWithPredifinedDataPosition(
                  user?.username,
                  user?.password,
                  user?.typeId,
                  user?.firstName,
                  user?.lastName,
                  user?.email,
                  e.target.value
                )
              }
            />
          </Form.Item>

          <Form.Item label={null}>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-start",
                marginTop: "20px",
              }}
            >
              <Button
                onClick={handleLoginCLick}
                type="text"
                size="middle"
                style={{ padding: "5px 15px" }}
              >
                Loggear
              </Button>
              <Button
                onClick={handleRegisterClick}
                type="primary"
                htmlType="submit"
                style={{ padding: "5px 15px" }}
              >
                Registrar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default RegisterPage;
