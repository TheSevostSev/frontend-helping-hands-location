"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSession, signOut } from "next-auth/react";
import useTokenStore from "@/stores/useTokenStore";
import useLocationActionStore from "@/stores/useLocationActionStore";
import { Modal } from "antd";
import MainLayout from "./layouts/MainLayout";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const { data: session } = useSession();

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
  };

  const handleCancel = () => {
    toggleAddLocation();
  };

  return (
    <MainLayout>
      <div className="App">
        <Map></Map>
        <Modal
          title="Add Location"
          open={addLocation}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    </MainLayout>
  );
}
