"use client";
import React, { useRef, useState } from "react";
import MapPlayground from "@/component/MapPlayground";
import Navbar from "@/component/Navbar";
import { useSession } from "next-auth/react";

export default function App() {
  const { data: session, status } = useSession();
  const optimizeFnRef = useRef<() => void>(() => {});
  const [shrink, setShrink] = useState<boolean>(false);

  const toggleShrink = () => {
   console.log("shriked") 
    setShrink(!shrink);
  }

  if (status === "loading")
    return (
      <p className="text-2xl font-semibold text-center mt-80 text-gray-600">
        Loading playground...
      </p>
    );

  return (
    <>
      <Navbar session={session} />

      <main
        className={`transition-all duration-300 ${
          shrink ? "max-w-[80vw]" : "max-w-full"
        }`}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
               Route Playground
            </h1>

            <MapPlayground
              onOptimizeCallback={(fn: () => void) => {
                optimizeFnRef.current = fn;
              }}
              toggleShrink={toggleShrink}
              session={session}
            />
          </div>
        </div>
      </main>
    </>
  );
}
