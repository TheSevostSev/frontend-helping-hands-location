"use client";

import React from "react";
import { Modal, Image } from "antd";
import useAppGuideStore from "@/stores/useAppGuideStore";

export default function AppGuideModal() {
  const appGuideShow = useAppGuideStore((state) => state.appGuideShow);

  const toggleAppGuideShow = useAppGuideStore(
    (state) => state.toggleAppGuideShow
  );

  return (
    <Modal
      open={appGuideShow}
      title="Guía de la pagina"
      onOk={toggleAppGuideShow}
      onCancel={toggleAppGuideShow}
      footer={null}
      centered
      style={{ textAlign: "center", alignItems: "center" }}
    >
      <Image src="/images/app-guide.jpeg" alt="" preview={false} />
    </Modal>
  );
}
