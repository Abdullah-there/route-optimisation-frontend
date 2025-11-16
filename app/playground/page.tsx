"use client"
import React, { useRef } from "react";
import MapPlayground from "@/component/MapPlayground";
import Navbar from "@/component/Navbar";

export default function App() {
  const optimizeFnRef = useRef<() => void>(() => {});

  return (
    <>
    <Navbar />
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Route Playground</h1>

      <MapPlayground
        onOptimizeCallback={(fn: any) => {
          optimizeFnRef.current = fn;
        }}
      />
    </div>
    </>
  );
}
