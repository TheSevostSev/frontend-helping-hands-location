"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession, signOut } from "next-auth/react";
import useTokenStore from "@/stores/useTokenStore";
import useLocationActionStore from "@/stores/useLocationActionStore";
import { Modal, Form, Input } from "antd";
import MainLayout from "./layouts/MainLayout";
import SelectLocationByAddress from "@/components/SelectLocationByAddress";
import MainMap from "@/components/MainMap";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const { data: session } = useSession();

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
    toggleAddLocation();
    setCoordinates({ latitude: null, longitude: null });
    setEraseAddress(true);
  };

  const handleCancel = () => {
    toggleAddLocation();
    setCoordinates({ latitude: null, longitude: null });
    setEraseAddress(true);
  };

  return (
    <MainLayout>
      <div className="App">
        <MainMap></MainMap>
        <Modal
          title="Add Location"
          open={addLocation}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
          style={{ textAlign: "center" }}
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            style={{ width: "100%" }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="Title"
              name="title"
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

            <Map searchedLocationByAddress={coordinates}></Map>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
}
