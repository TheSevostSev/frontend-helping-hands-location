"use client";

import React, { useState } from "react";
import { Button, Form, Input, Select, Divider } from "antd";
import { useRouter } from "next/navigation";
import { basicRegister } from "../api/auth";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getListUserTypes } from "../api/type";
import useTokenStore from "@/stores/useTokenStore";
import AuthLayout from "../layouts/AuthLayout";

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

  const setToken = useTokenStore((state) => state.setToken);

  const [user, setUser] = useState<UserRegisterType | null>(null);

  const handleCancelCLick = () => {
    router.push("/");
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
    basicRegister(user)
      .then((data) => {
        toast.success("El usuario se ha registrado con exito");
        setToken(data.token, true);
        router.push("/");
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Ha ocurrido un error";
        toast.error(errorMessage);
      });
  };

  return (
    <AuthLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
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
          <Divider style={{ borderColor: "#000000", padding: "5px 5px" }}>
            Authentification information
          </Divider>
          <Form.Item<UserRegisterType>
            label="Usuario"
            name="username"
            rules={[{ required: true, message: "Porfavor ingresa tu nombre de usuario" }]}
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
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Porfavor ingresa tu contraseña" }]}
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

          <Divider style={{ borderColor: "#000000", padding: "5px 5px" }}>
            Informacion Personal
          </Divider>

          <Form.Item<UserRegisterType>
            label="Nombre"
            name="firstName"
            rules={[
              { required: true, message: "Porfavor ingresa tu nombre" },
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

          <Form.Item label="Apellido" name="lastName">
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
            label="Tipo de usuario"
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

          <Divider style={{ borderColor: "#000000", padding: "5px 5px" }}>
            Contact information
          </Divider>

          <Form.Item<UserRegisterType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Porfavor ingresa tu email" }]}
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

          <Form.Item label="Telefono" name="phoneNumber">
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
                onClick={handleCancelCLick}
                type="text"
                size="middle"
                style={{ padding: "5px 15px" }}
              >
                Cancel
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
    </AuthLayout>
  );
};

export default RegisterPage;
