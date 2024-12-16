"use client";

import React from "react";
import { Modal, Image } from "antd";
import useAboutUsStore from "@/stores/useAboutUsStore";

export default function AboutUsModal() {
  const aboutUsShow = useAboutUsStore((state) => state.aboutUsShow);

  const toggleAboutUsShow = useAboutUsStore((state) => state.toggleAboutUsShow);

  return (
    <Modal
      title="Sobre nosotros"
      open={aboutUsShow}
      onOk={toggleAboutUsShow}
      onCancel={toggleAboutUsShow}
      centered
      footer={null}
      style={{
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <p style={{ marginBottom: "16px", marginTop: "16px" }}>
          En Helping Hands Location, creemos en el poder de la comunidad y en la
          importancia de brindar apoyo a quienes más lo necesitan. Nuestra
          misión es conectar a personas voluntarias con aquellos que requieren
          ayuda, ofreciendo un espacio donde se pueden encontrar puntos de apoyo
          disponibles en su localidad.
        </p>
        <p style={{ marginBottom: "16px" }}>
          A través de nuestra plataforma, los voluntarios pueden compartir sus
          lugares de ayuda, ya sea proporcionando comida, agua, acceso a duchas,
          ropa o cualquier otro recurso esencial. Por otro lado, las personas en
          situación de necesidad pueden acceder fácilmente a este mapa
          interactivo para encontrar los puntos de ayuda más cercanos a su
          ubicación.
        </p>
        <p style={{ marginBottom: "16px" }}>
          Nuestro objetivo es crear una red solidaria, accesible y eficiente que
          permita a todos colaborar de manera sencilla y segura. En Helping
          Hands Location, cada acción cuenta, y juntos podemos hacer la
          diferencia.
        </p>
      </div>
      <Image
        src="/images/logo.png"
        style={{ height: "200px", width: "200px" }}
        alt=""
      />
    </Modal>
  );
}
