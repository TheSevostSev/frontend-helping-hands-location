"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Modal, Form, Input } from "antd";
import SelectLocationByAddress from "@/components/SelectLocationCoordinatesWithAddress";
import { Typography, Select } from "antd";
import { getListLocationTags } from "@/app/api/location-tag";
import { useQuery } from "@tanstack/react-query";

const { Title } = Typography;

const BaseMap = dynamic(() => import("./BaseMap"), { ssr: false });

interface LocationModalProps {
  title: string;
  location: HelpingHandsLocation;
  onOk: (location: HelpingHandsLocationForm) => void;
  onCancel: () => void;
  showPopup: boolean;
}

const LocationModal: React.FC<LocationModalProps> = ({
  title,
  location,
  onCancel,
  onOk,
  showPopup,
}) => {
  const [localLocation, setLocalLocation] = useState<HelpingHandsLocationForm>({
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    address: location.address,
    tagIds: location.tags.map((tag) => tag.id),
  });

  const [form] = Form.useForm();

  useEffect(() => {
    if (localLocation) {
      form.setFieldsValue({
        name: localLocation.name,
        tags: localLocation.tagIds,
        address: localLocation.address,
      });
    }
  }, [localLocation, form]);

  const { data: locationTags } = useQuery({
    queryFn: getListLocationTags,
    queryKey: ["location_tags"],
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (location?.name || location?.address || location?.tags.length > 0) {
      setLocalLocation({
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        tagIds: location.tags.map((tag) => tag.id),
      });
    } else {
      setLocalLocation({
        name: null,
        address: null,
        latitude: null,
        longitude: null,
        tagIds: [],
      });
    }
  }, [location]);

  const handleOk = () => {
    onOk(localLocation);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={showPopup}
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
        form={form}
        autoComplete="off"
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
          <Input
            onChange={(e) => {
              setLocalLocation({ ...localLocation, name: e.target.value });
            }}
          />
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
            onChange={(selectedIds) => {
              setLocalLocation({ ...localLocation, tagIds: selectedIds });
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
            location={localLocation} // Pass the local location here
            setLocation={setLocalLocation}
          />
        </Form.Item>

        {localLocation?.address && (
          <>
            <Title level={5} style={{ fontWeight: "normal" }}>
              Previsualización de la Ubicación
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
                searchedLocationByAddress={{
                  latitude: localLocation.latitude,
                  longitude: localLocation.longitude,
                }}
              />
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default LocationModal;
