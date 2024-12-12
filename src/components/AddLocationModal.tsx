"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession, signOut } from "next-auth/react";
import useTokenStore from "@/stores/useTokenStore";
import useLocationActionStore from "@/stores/useLocationActionStore";
import { Modal, Form, Input } from "antd";
import SelectLocationByAddress from "@/components/SelectLocationByAddress";
import { Typography, Select } from "antd";
import { getListLocationTags } from "@/app/api/location-tag";
import { createLocation } from "@/app/api/location";
import { useQuery } from "@tanstack/react-query";

const { Title } = Typography;

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function AddLocationModal() {
  const { data: session } = useSession();

  const { data: locationTags } = useQuery({
    queryFn: getListLocationTags,
    queryKey: ["location_tags"],
    staleTime: 1000 * 60 * 5,
  });

  const [form] = Form.useForm();

  const [tagIds, setTagIds] = useState<string | string[]>([]);

  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });

  const [eraseAddress, setEraseAddress] = useState(false);

  const addLocation = useLocationActionStore((state) => state.addLocation);

  const toggleAddLocation = useLocationActionStore(
    (state) => state.toggleAddLocation
  );

  const setToken = useTokenStore((state) => state.setToken);

  useEffect(() => {
    if (session?.authMessage) {
      toast.success(session?.authMessage);
    }
    if (session?.tokenValue) {
      setToken(session?.tokenValue, true);
    }
    signOut({ redirect: false });
  }, [session?.authMessage, session?.tokenValue, setToken]);

  const handleOk = () => {
    createLocation({
      name: form.getFieldValue("name"),
      tagIds,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
    setTagIds([]);
    toggleAddLocation();
    setCoordinates({ latitude: null, longitude: null });
    setEraseAddress(true);
  };

  const handleChange = (value: string | string[]) => {
    setTagIds(value);
  };

  const handleCancel = () => {
    toggleAddLocation();
    setCoordinates({ latitude: null, longitude: null });
    setEraseAddress(true);
  };

  return (
    <Modal
      title="Add Location"
      open={addLocation}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      style={{ textAlign: "center", alignItems: "center" }}
    >
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        style={{ width: "100%" }}
        initialValues={{ remember: true }}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="Title"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the title of the location!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tags"
          name="tags"
          rules={[
            {
              required: true,
              message: "Please select tags for your location!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Please select"
            style={{ width: "100%" }}
            fieldNames={{ value: "id", label: "name" }}
            options={locationTags}
            optionFilterProp="name"
            filterSort={(optionA, optionB) =>
              ((optionA?.label as string) ?? "")
                .toLowerCase()
                .localeCompare(((optionB?.label as string) ?? "").toLowerCase())
            }
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please select address!",
            },
          ]}
        >
          <SelectLocationByAddress
            eraseAddress={eraseAddress}
            setCoordinates={setCoordinates}
          ></SelectLocationByAddress>
        </Form.Item>

        <Title level={5} style={{ fontWeight: "normal" }}>
          Location preview
        </Title>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Map
            style={{ width: "70%", height: "30vh" }}
            zoomControl={false}
            zoom={14}
            searchedLocationByAddress={coordinates}
          />
        </div>
      </Form>
    </Modal>
  );
}
