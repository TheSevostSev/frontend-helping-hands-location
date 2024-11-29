"use client";

import "./globals.css";

import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CompassOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";

import { Provider } from "react-redux";
import store from "../redux/store";

const { Sider, Content } = Layout;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();

  const currentPath = usePathname();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleMapClick = () => {
    router.push("/");
  };

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
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
              <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={handleLoginClick}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  zIndex: 1000,
                }}
              >
                Iniciar session
              </Button>
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
                  selectedKeys={[currentPath]}
                  items={[
                    {
                      key: "/",
                      icon: <CompassOutlined />,
                      label: "Mapa",
                      onClick: handleMapClick,
                    },
                  ]}
                ></Menu>
              </Sider>
              <Content>{children}</Content>
            </Layout>
          </AntdRegistry>
        </Provider>
      </body>
    </html>
  );
}
