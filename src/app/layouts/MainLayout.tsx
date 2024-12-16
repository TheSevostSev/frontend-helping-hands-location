"use client";

import React, { useEffect, useState } from "react";
import "../globals.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoginOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Popconfirm } from "antd";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import useTokenStore from "@/stores/useTokenStore";
import useLocationActionStore from "@/stores/useLocationActionStore";

const { Sider, Content } = Layout;

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogoutClick = () => {
    removeToken();
  };

  const handleAddLocationClick = () => {
    toggleAddLocation();
  };

  const token = useTokenStore((state) => state.token);
  const removeToken = useTokenStore((state) => state.removeToken);

  const toggleAddLocation = useLocationActionStore(
    (state) => state.toggleAddLocation
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <Layout
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        position: "relative",
      }}
    >
      {isHydrated ? (
        token ? (
          <>
            <Popconfirm
              title="Quieres cerrar session?"
              description="Estas seguro de que quieres cerrar la sesion?"
              okText="Si"
              cancelText="No"
              onConfirm={handleLogoutClick}
            >
              <Button
                type="primary"
                icon={<LogoutOutlined />}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  zIndex: 1000,
                }}
              >
                Cerrar Sesion
              </Button>
            </Popconfirm>
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              style={{
                height: "100vh",
              }}
            >
              <div className="demo-logo-vertical" />
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "18px",
                  width: 64,
                  height: 64,
                  color: "white",
                }}
              />
              <Menu
                theme="dark"
                mode="inline"
                items={[
                  {
                    key: "add-location",
                    icon: <EnvironmentOutlined />,
                    label: "Añadir Ubicación",
                    onClick: handleAddLocationClick,
                  },
                ]}
              />
            </Sider>
          </>
        ) : (
          <>
            <Button
              type="primary"
              onClick={handleLoginClick}
              icon={<LoginOutlined />}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 1000,
              }}
            >
              Iniciar sesión / Registrarse
            </Button>
          </>
        )
      ) : null}
      <Content>{children}</Content>
    </Layout>
  );
}
