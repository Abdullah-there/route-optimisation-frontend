"use client"
import React, { useRef, useState } from "react";
import MapPlayground from "@/component/MapPlayground";
import Navbar from "@/component/Navbar";

export default function App() {
  const optimizeFnRef = useRef<() => void>(() => {});
  const [shrink, setShrink] = useState<boolean>(false);

  const toggleShrink = () => {
    setShrink(!shrink);
  }

  return (
    <>
    <div className={`${shrink ? "w-[80%]" : "w-full"}`}>
    <Navbar />
    <div className="p-4 bg-gradient-to-b from-gray-50 to-gray-200">
      <h1 className="text-xl font-bold mb-4">Route Playground</h1>

      <MapPlayground
        onOptimizeCallback={(fn: () => void) => {
          optimizeFnRef.current = fn;
        }}
        toggleShrink={toggleShrink}
/>
    </div>
    </div>
    </>
  );
}
