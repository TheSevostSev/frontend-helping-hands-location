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
import {
  Button,
  Layout,
  Menu,
  theme,
  Popconfirm,
  Tag,
  Flex,
  Dropdown,
} from "antd";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import useTokenStore from "@/stores/useTokenStore";
import useLocationActionStore from "@/stores/useLocationActionStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getListLocationTags } from "@/app/api/location-tag";

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

  const queryClient = useQueryClient();

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const sizeOfPrimaryTags = 5;

  const router = useRouter();

  const { data: locationTags } = useQuery({
    queryFn: getListLocationTags,
    queryKey: ["location_tags"],
    staleTime: 0,
  });

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

  const handleChange = (tag: Tag, checked: boolean) => {
    console.log("Tag", tag, "Checked", checked);
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
    queryClient.refetchQueries();
  };

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
                Logout
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
                    label: "Add location",
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
              Presentarme como voluntario
            </Button>

            <Flex
              gap={4}
              wrap
              style={{
                position: "absolute",
                top: 20,
                zIndex: 1000,
              }}
            >
              {locationTags?.map((tag: Tag, index: number) => {
                if (index < sizeOfPrimaryTags) {
                  return (
                    <Tag.CheckableTag
                      key={tag.id}
                      checked={selectedTags.includes(tag)}
                      onChange={(checked) => handleChange(tag, checked)}
                      className={`tag-button ${
                        selectedTags.includes(tag) ? "selected" : ""
                      }`}
                    >
                      {tag.name}
                    </Tag.CheckableTag>
                  );
                } else if (index === sizeOfPrimaryTags) {
                  return (
                    <Dropdown
                      key="more-tags-dropdown"
                      overlay={
                        <div>
                          {locationTags
                            .slice(index)
                            .map((remainingTag: Tag) => (
                              <Tag.CheckableTag
                                key={remainingTag.id}
                                checked={selectedTags.includes(remainingTag)}
                                onChange={(checked) =>
                                  handleChange(remainingTag, checked)
                                }
                                className={`tag-button-dropdown ${
                                  selectedTags.includes(remainingTag)
                                    ? "selected"
                                    : ""
                                }`}
                              >
                                {remainingTag.name}
                              </Tag.CheckableTag>
                            ))}
                        </div>
                      }
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Tag className={`tag-button`}>Ver mas</Tag>
                      </a>
                    </Dropdown>
                  );
                }
              })}
            </Flex>
          </>
        )
      ) : null}
      <Content>{children}</Content>
    </Layout>
  );
}
