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
                backgroundColor: "#cce4e9",
              }}
            >
              Logout
            </Button>
          </Popconfirm>
        ) : (
          <Button
            type="primary"
            onClick={handleLoginClick}
            icon={<LoginOutlined />}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 1000,
              backgroundColor: "#cce4e9",
            }}
          >
            Iniciar session
          </Button>
        )
      ) : null}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: "100vh",
          backgroundColor: "#cce4e9",      
       }}
      >
        <div className="demo-logo-vertical" />
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "18px",
            width: 80,
            height: 64,
            color: "black",
                    }}
                    
        />
        <Menu
          mode="inline"
          style={{
            fontSize: "14px",
            color: "white",
            backgroundColor: "#cce4e9",
            borderStyle: "solid",
            borderRadius: "10px",
                    }}
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
      <Content>{children}</Content>
    </Layout>
  );
}
