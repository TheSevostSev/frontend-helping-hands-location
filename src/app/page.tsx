"use client";

import React from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSession, signOut } from "next-auth/react";
import useTokenStore from "@/stores/useTokenStore";
import MainLayout from "./layouts/MainLayout";
import MainMap from "@/components/MainMap";
import AddLocationModal from "@/components/AddLocationModal";

export default function Home() {
  const { data: session } = useSession();

  const setToken = useTokenStore((state) => state.setToken);

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
  }, [session?.authErrorMessage]);

  return (
    <MainLayout>
      <div className="App">
        <MainMap></MainMap>
      </div>
      <AddLocationModal></AddLocationModal>
    </MainLayout>
  );
}
