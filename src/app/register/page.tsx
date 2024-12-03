"use client";

import React, { useState } from "react";
import { Button, Form, Input, Select, Divider } from "antd";
import { useRouter } from "next/navigation";
import { register } from "../api/auth";
import { toast } from "react-toastify";

type UserRegisterType = {
  username?: string;
  password?: string;
  typeId?: number;
  firstName?: string;
  lastName?: string | null;
  email?: string;
  phoneNumber?: string | null;
};

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [selectOpen, setSelectOpen] = useState(false);

  const [user, setUser] = useState<UserRegisterType | null>(null);

  const handleLoginCLick = () => {
    router.push("/login");
  };

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
    register(user);
    toast.success("El usuario se ha registrado con exito");
    router.push("/");
  };

  const handleSelectDropdownChange = (open: boolean) => {
    setSelectOpen(open);
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

          <Form.Item<UserRegisterType>
            label="Type"
            name="typeId"
            rules={[
              { required: true, message: "Por favor pon tu tipo de usuario!" },
            ]}
          >
            <Select
              defaultValue="lucy"
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
              options={[
                { value: "1", label: "Personal" },
                { value: "2", label: "Empresario" },
              ]}
              placeholder="Elige tu tipo de usuario"
              onDropdownVisibleChange={handleSelectDropdownChange}
            />
          </Form.Item>

          <Form.Item label={null}>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-start",
                marginTop: selectOpen ? "40px" : "0px",
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
