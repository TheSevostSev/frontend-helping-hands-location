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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const BaseMap = dynamic(() => import("./BaseMap"), { ssr: false });

export default function AddLocationModal() {
  const { data: session } = useSession();

  const [address, setAddress] = useState<string>("");

  const queryClient = useQueryClient();

  const { data: locationTags } = useQuery({
    queryFn: getListLocationTags,
    queryKey: ["location_tags"],
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: (location: HelpingHandsLocationCreate) =>
      createLocation(location),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["helpingHandsLocations"],
      });
      toast.success("Ubicación creada con exito");
      resetComponentValues();
    },
  });

  const [form] = Form.useForm();

  const [tagIds, setTagIds] = useState<string | string[]>([]);

  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });

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
    mutation.mutate({
      name: form.getFieldValue("name"),
      tagIds,
      address,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  };

  const handleCancel = () => {
    toggleAddLocation();
  };

  const handleChange = (value: string | string[]) => {
    setTagIds(value);
  };

  const resetComponentValues = () => {
    setTagIds([]);
    toggleAddLocation();
    setCoordinates({ latitude: null, longitude: null });
    setAddress("");
  };

  return (
    <Modal
      title="Añadir Ubicación"
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
          label="Titulo"
          name="name"
          rules={[
            {
              required: true,
              message: "Porfavor ingresa un titulo a la ubicación",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Etiquetas"
          name="tags"
          rules={[
            {
              required: true,
              message: "Porfavor ingresa una etiqueta a la ubicación",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Seleccione porfavor"
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
          label="Direccion"
          name="address"
          rules={[
            {
              required: true,
              message: "Porfavor ingresa una direccion",
            },
          ]}
        >
          <SelectLocationByAddress
            address={address}
            setAddress={setAddress}
            setCoordinates={setCoordinates}
          ></SelectLocationByAddress>
        </Form.Item>

        <Title level={5} style={{ fontWeight: "normal" }}>
          Previsulizar Ubicacion
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
          <BaseMap
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
