"use client";

import React, { useState } from "react";
import "../globals.css";
import { Layout, theme, Card } from "antd";
import { useRouter, usePathname } from "next/navigation";

const { Content } = Layout;

const tabList = [
  {
    key: "/login",
    tab: "Iniciar sesión",
  },
  {
    key: "/register",
    tab: "Registrarse",
  },
];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();

  const [activeTabKey, setActiveTabKey] = useState(usePathname() ?? "");

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
    router.push(key);
  };

  return (
    <Layout
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        display: "flex", // Enable flexbox
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
      }}
    >
      <Content>
        <Card
          activeTabKey={activeTabKey}
          onTabChange={onTabChange}
          style={{
            width: "40vw", // Adjust the width as needed
            justifyContent: "center", // Center children vertically within the Card
            textAlign: "center",
            flexDirection: "column",
            alignItems: "center", // Center content horizontally within the card
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Optional: add a shadow for better visibility
            borderRadius: borderRadiusLG,
          }}
          title="Iniciar sesión"
          tabList={tabList}
        >
          {children}
        </Card>
      </Content>
    </Layout>
  );
}
