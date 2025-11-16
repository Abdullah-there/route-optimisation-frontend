"use client"
import React, { useRef } from "react";
import MapPlayground from "@/component/MapPlayground";
import Navbar from "@/component/Navbar";

export default function App() {
  // Ref to store the optimize function
  const optimizeFnRef = useRef<() => void>(() => {});

  return (
    <>
    <Navbar />
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Route Playground</h1>

      {/* Pass callback to store optimize function */}
      <MapPlayground
        onOptimizeCallback={(fn: any) => {
          optimizeFnRef.current = fn;
        }}
      />
    </div>
    </>
  );
}
