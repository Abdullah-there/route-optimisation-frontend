"use client";

import dynamic from "next/dynamic";
import Navbar from "@/component/Navbar";
import { useSession } from "next-auth/react";

const LeafletMap = dynamic(() => import("@/component/Map"), {
  ssr: false,
});

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return <p className="text-center mt-80">Loading...</p>;

  return (
    <>
      <Navbar session={session} />
      <LeafletMap />
    </>
  );
}
