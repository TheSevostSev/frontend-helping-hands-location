"use client";

import React from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSession, signOut } from "next-auth/react";
import useTokenStore from "@/stores/useTokenStore";
import MainLayout from "./layouts/MainLayout";
import MainMap from "@/components/MainMap";
import LocationModal from "@/components/LocationModal";
import AboutUsModal from "@/components/AboutUsModal";
import AppGuideModal from "@/components/AppGuideModal";
import useLocationPopupStore from "@/stores/useLocationPopupStore";
import { createLocation, editLocation } from "@/app/api/location";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const { data: session } = useSession();

  const setToken = useTokenStore((state) => state.setToken);

  const location = useLocationPopupStore((store) => store.location);
  const resetLocation = useLocationPopupStore((store) => store.resetLocation);
  const toggleShowLocationPopup = useLocationPopupStore(
    (store) => store.toggleShowPopup
  );
  const showLocationPopup = useLocationPopupStore((store) => store.showPopup);

  const queryClient = useQueryClient();

  const onCancel = () => {
    if (location?.id != null) {
      resetLocation();
    }
    resetLocation();
    toggleShowLocationPopup();
  };

  const createLocationMutation = useMutation({
    mutationFn: (location: HelpingHandsLocationForm) =>
      createLocation(location),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["helpingHandsLocations"],
      });
      toast.success("Ubicación creada con exito");
    },
  });

  const editLocationMutation = useMutation({
    mutationFn: ({
      id,
      location,
    }: {
      id: number;
      location: HelpingHandsLocationForm;
    }) => editLocation(id, location),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["helpingHandsLocations"],
      });
      toast.success("Ubicación editada con exito");
    },
  });

  const onOk = (locationForm: HelpingHandsLocationForm) => {
    if (location?.id != null) {
      editLocationMutation.mutate({ id: location.id, location: locationForm });
    } else {
      createLocationMutation.mutate(locationForm);
    }

    resetLocation();
    toggleShowLocationPopup();
  };

  useEffect(() => {
    if (session?.authMessage) {
      toast.success(session?.authMessage);
    }
    if (session?.authErrorMessage) {
      toast.error(session?.authErrorMessage);
    }
    if (session?.tokenValue) {
      setToken(session?.tokenValue, true);
    }
    signOut({ redirect: false });
  }, [session?.authErrorMessage, session?.tokenValue]);

  return (
    <MainLayout>
      <div className="App">
        <MainMap></MainMap>
      </div>
      <LocationModal
        location={location}
        onOk={onOk}
        showPopup={showLocationPopup}
        onCancel={onCancel}
        title={location?.id == null ? "Añadir Ubicación" : "Editar Ubicación"}
      ></LocationModal>
      <AboutUsModal></AboutUsModal>
      <AppGuideModal></AppGuideModal>
    </MainLayout>
  );
}
