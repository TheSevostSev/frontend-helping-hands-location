"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import { getListLocations } from "@/app/api/location";
import { Tag, Dropdown, Button } from "antd";
import { getListLocationTags } from "@/app/api/location-tag";
import { useState } from "react";
import useAboutUsStore from "@/stores/useAboutUsStore";
import useAppGuideStore from "@/stores/useAppGuideStore";

const BaseMap = dynamic(() => import("./BaseMap"), { ssr: false });

const MainMap: React.FC = ({}) => {
  const [selectedLocationTagIds, setSelectedLocationTagIds] = useState<
    number[]
  >([]);

  const { data: helpingHandsLocations } = useQuery({
    queryFn: () => getListLocations(selectedLocationTagIds),
    queryKey: ["helpingHandsLocations", selectedLocationTagIds],
    staleTime: 1000 * 60 * 5,
  });

  const toggleAboutUsShow = useAboutUsStore((state) => state.toggleAboutUsShow);
  const toggleAppGuideShow = useAppGuideStore(
    (state) => state.toggleAppGuideShow
  );

  const sizeOfPrimaryTags = 5;

  const { data: locationTags } = useQuery({
    queryFn: () => getListLocationTags(),
    queryKey: ["location_tags"],
    staleTime: 0,
  });

  const handleChange = (tag: Tag, checked: boolean) => {
    const nextSelectedLocationTagIds = checked
      ? [...selectedLocationTagIds, tag.id]
      : selectedLocationTagIds.filter((t) => t !== tag.id);
    setSelectedLocationTagIds(nextSelectedLocationTagIds);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "10px",
          position: "absolute",
          top: "20px",
          transform: "translateX(42px)",
          zIndex: 1000,
        }}
      >
        {locationTags?.map((tag: Tag, index: number) => {
          if (index < sizeOfPrimaryTags) {
            return (
              <Tag.CheckableTag
                key={tag.id}
                checked={selectedLocationTagIds.includes(tag.id)}
                onChange={(checked) => handleChange(tag, checked)}
                className={`tag-button ${
                  selectedLocationTagIds.includes(tag.id) ? "selected" : ""
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
                    {locationTags.slice(index).map((remainingTag: Tag) => (
                      <Tag.CheckableTag
                        key={remainingTag.id}
                        checked={selectedLocationTagIds.includes(
                          remainingTag.id
                        )}
                        onChange={(checked) =>
                          handleChange(remainingTag, checked)
                        }
                        className={`tag-button-dropdown ${
                          selectedLocationTagIds.includes(remainingTag.id)
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
                  <Tag
                    className={`tag-button ${
                      selectedLocationTagIds.some((value) =>
                        locationTags
                          .slice(index)
                          .map((t: Tag) => t.id)
                          .includes(value)
                      )
                        ? "selected"
                        : ""
                    }`}
                  >
                    Ver más
                  </Tag>
                </a>
              </Dropdown>
            );
          }
        })}
        <Button
          type="primary"
          onClick={toggleAppGuideShow}
          style={{ marginLeft: "160px" }}
        >
          Guía
        </Button>
        <Button
          type="primary"
          onClick={toggleAboutUsShow}
          style={{ marginLeft: "10px" }}
        >
          Sobre nosotros
        </Button>
      </div>

      <BaseMap
        zoomControl={true}
        markUserLocation={true}
        helpingHandsLocations={helpingHandsLocations}
        style={{ width: "100%", height: "100vh" }}
      />
    </>
  );
};

export default MainMap;
