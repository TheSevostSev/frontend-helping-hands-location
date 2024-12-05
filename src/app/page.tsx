"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSession, signOut } from "next-auth/react";
import useTokenStore from "@/stores/useTokenStore";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const { data: session } = useSession();

  const setToken = useTokenStore((state) => state.setToken);

  useEffect(() => {
    if (session?.authMessage) {
      toast.success(session?.authMessage);
    }
    if (session?.tokenValue) {
      setToken(session?.tokenValue, true);
    }
    signOut({ redirect: false });
  }, [session?.authMessage, session?.tokenValue]);

  return (
    <div className="App">
      <Map></Map>
    </div>
  );
}
