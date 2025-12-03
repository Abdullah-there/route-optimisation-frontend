"use client"
import React, { useRef, useState } from "react";
import MapPlayground from "@/component/MapPlayground";
import Navbar from "@/component/Navbar";
import { useSession } from "next-auth/react";

export default function App() {
  const { data: session, status } = useSession() 
  const optimizeFnRef = useRef<() => void>(() => {});
  const [shrink, setShrink] = useState<boolean>(false);

  const toggleShrink = () => {
    setShrink(!shrink);
  }

  if (status == "loading") return <p className="text-2xl font-bold text-center mt-80">Loading, This would take a second...</p>

  return (
    <>
    <div className={`${shrink ? "w-[80%]" : "w-full"}`}>
    <Navbar session={session}/>
    <div className="p-4 bg-gradient-to-b from-gray-50 to-gray-200">
      <h1 className="text-xl font-bold mb-4">Route Playground</h1>

      <MapPlayground
        onOptimizeCallback={(fn: () => void) => {
          optimizeFnRef.current = fn;
        }}
        toggleShrink={toggleShrink}
        session={session}
/>
    </div>
    </div>
    </>
  );
}
