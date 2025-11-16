"use client";
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
}

interface Route {
  from: number;
  to: number;
  traffic: number;
}

export default function MapPlayground({
  onOptimizeCallback,
}: {
  onOptimizeCallback: (fn: () => void) => void;
}) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [optimizedPath, setOptimizedPath] = useState<number[]>([]);

  const getLabel = (index: number) => {
    let label = "";
    let i = index;
    do {
      label = String.fromCharCode(65 + (i % 26)) + label;
      i = Math.floor(i / 26) - 1;
    } while (i >= 0);
    return label;
  };

  const addNode = () => {
    const newNode: Node = {
      id: nodes.length,
      x: Math.random() * 900 + 50,
      y: Math.random() * 400 + 50,
      label: getLabel(nodes.length),
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const startAddRoute = () => {
    setSelectedNode(null);
    alert("Click two nodes in order to create a route");
  };

  const handleNodeClick = (id: number) => {
    if (selectedNode === null) {
      setSelectedNode(id);
    } else if (selectedNode === id) {
      setSelectedNode(null);
    } else {
      const input = prompt("Enter traffic weightage:");
      if (!input) return;
      const traffic = Number(input);
      if (isNaN(traffic) || traffic <= 0) {
        alert("Invalid traffic weightage");
        return;
      }
      setRoutes((prev) => [...prev, { from: selectedNode, to: id, traffic }]);
      setSelectedNode(null);
    }
  };

  const optimizeRoute = () => {
    if (nodes.length < 2 || routes.length === 0) {
      alert("Need at least 2 nodes and 1 route");
      return;
    }

    const startLabel = prompt("Enter start node label (e.g., A):");
    const endLabel = prompt("Enter end node label (e.g., D):");
    if (!startLabel || !endLabel) {
      alert("Start or End Label undefined!");
      return;
    }

    const startNode = nodes.find((n) => n.label === startLabel.toUpperCase());
    const endNode = nodes.find((n) => n.label === endLabel.toUpperCase());
    if (!startNode || !endNode) {
      alert("Invalid node labels");
      return;
    }

    fetch("http://localhost:8080/api/optimize", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    routes: routes.map(r => ({ from: r.from, to: r.to, weight: r.traffic })),
    start: startNode.id,
    end: endNode.id,
  }),
})

      .then((res) => res.json())
      .then((data: number[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          alert("No optimized path found");
          return;
        }
        setOptimizedPath(data);
        alert(
          "Optimized Path: " + data.map((i) => nodes[i]?.label).join(" → ")
        );
      })
      .catch((err) => console.error(err));
  };

  const editTraffic = (index: number) => {
    const input = prompt("Enter new traffic weightage:");
    if (!input) return;
    const traffic = Number(input);
    if (isNaN(traffic) || traffic <= 0) {
      alert("Invalid weight");
      return;
    }
    setRoutes((prev) => prev.map((r, i) => (i === index ? { ...r, traffic } : r)));
  };

  useEffect(() => {
    onOptimizeCallback(optimizeRoute);
  }, [optimizeRoute]);

  return (
    <div className="p-4">
      <div className="mb-2 flex gap-2">
        <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={addNode}>
          Add Node
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={startAddRoute}>
          Add Route
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={optimizeRoute}>
          Optimize Route
        </button>
      </div>

      <div className="relative w-[95vw] h-[500px] border border-gray-300 bg-white">
        {/* Routes */}
        {routes.map((r, i) => {
          const start = nodes.find((n) => n.id === r.from);
          const end = nodes.find((n) => n.id === r.to);
          if (!start || !end) return null;

          const x1 = start.x + 20;
          const y1 = start.y + 20;
          const x2 = end.x + 20;
          const y2 = end.y + 20;
          const length = Math.hypot(x2 - x1, y2 - y1);
          const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

          let isOptimized = false;
          for (let j = 0; j < optimizedPath.length - 1; j++) {
            if (
              (optimizedPath[j] === start.id && optimizedPath[j + 1] === end.id) ||
              (optimizedPath[j] === end.id && optimizedPath[j + 1] === start.id)
            ) {
              isOptimized = true;
              break;
            }
          }

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <React.Fragment key={i}>
              {/* Route line */}
              <div
                className={isOptimized ? "absolute bg-red-700" : "absolute bg-blue-500"}
                style={{
                  width: length,
                  height: isOptimized ? 6 : 4,
                  left: x1,
                  top: y1,
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "0 0",
                  zIndex: 0,
                }}
                onClick={() => editTraffic(i)}
                title={`Traffic: ${r.traffic}`}
              />
              {/* Traffic weight */}
              <div
                className="absolute px-1 text-black font-bold"
                style={{
                  left: midX - 15,
                  top: midY - 10,
                  backgroundColor: "white",
                  borderRadius: "2px",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              >
                {r.traffic}
              </div>
            </React.Fragment>
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => (
          <Rnd
            key={n.id}
            size={{ width: 40, height: 40 }}
            position={{ x: n.x, y: n.y }}
            bounds="parent"
            onDragStop={(e, d) =>
              setNodes(nodes.map((nd) => (nd.id === n.id ? { ...nd, x: d.x, y: d.y } : nd)))
            }
          >
            <div
              onClick={() => handleNodeClick(n.id)}
              className={`w-full h-full flex items-center justify-center rounded-full text-white font-bold cursor-pointer ${
                selectedNode === n.id ? "bg-yellow-500" : "bg-blue-400"
              }`}
            >
              {n.label}
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}
