import React from "react";

export default function MapControls({ onOptimize }: { onOptimize: () => void }) {
  return (
    <div>
      <h3>Controls</h3>
      <button
        onClick={onOptimize}
        style={{
          padding: "8px 12px",
          background: "black",
          color: "white",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Optimize Route
      </button>
    </div>
  );
}
