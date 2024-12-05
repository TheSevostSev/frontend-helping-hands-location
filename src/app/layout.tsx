"use client";

import React, { useEffect, useState } from "react";
import "./globals.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CompassOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Popconfirm } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import useTokenStore from "@/stores/useTokenStore";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { SessionProvider } from "next-auth/react";

const { Sider, Content } = Layout;

export default function RootLayout({
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
  const currentPath = usePathname();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogoutClick = () => {
    removeToken();
  };

  const handleMapClick = () => {
    router.push("/");
  };

  const token = useTokenStore((state) => state.token);
  const removeToken = useTokenStore((state) => state.removeToken);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <SessionProvider>
            <ToastContainer
              position="bottom-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={true}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <AntdRegistry>
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
                  }}
                >
                  <div className="demo-logo-vertical" />
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
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
                    selectedKeys={[currentPath ? currentPath : "/"]}
                    items={[
                      {
                        key: "/",
                        icon: <CompassOutlined />,
                        label: "Mapa",
                        onClick: handleMapClick,
                      },
                    ]}
                  />
                </Sider>
                <Content>{children}</Content>
              </Layout>
            </AntdRegistry>
          </SessionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
