"use client";
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import PlaygroundLoader from "./PlaygroundLoader";

interface Node {
  nodeid: number;
  x: number;
  y: number;
  label: string;
}

interface Route {
  from: number;
  to: number;
  traffic: number;
}

interface MapPlaygroundProps {
  onOptimizeCallback: (fn: () => void) => void;
  toggleShrink: () => void;
  session: any;
}

export default function MapPlayground(props: MapPlaygroundProps) {
  const session = props.session;

  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [optimizedPath, setOptimizedPath] = useState<number[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);

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
      nodeid: nodes.length,
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
        src: startNode.nodeid,
        dest: endNode.nodeid,
      }),
    })
      .then((res) => res.json())
      .then((data: number[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          alert("No optimized path found");
          return;
        }
        setOptimizedPath(data);
        alert("Optimized Path: " + data.map((i) => nodes[i]?.label).join(" → "));
      })
      .catch((err) => console.error(err));
  };

  const shortestPath = () => {
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

    fetch("http://localhost:8080/api/shortest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routes: routes.map(r => ({ from: r.from, to: r.to, weight: r.traffic })),
        src: startNode.nodeid,
        dest: endNode.nodeid,
      }),
    })
      .then((res) => res.json())
      .then((data: number[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          alert("No optimized path found");
          return;
        }
        setOptimizedPath(data);
        alert("Optimized Path: " + data.map((i) => nodes[i]?.label).join(" → "));
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

  const saveRoute = () => {
    if (session == null) {
      alert("Login Required");
      return;
    }
    const myPlaygroundName = prompt("Enter a playground Name");

    fetch("http://localhost:8080/api/playground/saveRoute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user?.email,
        playgroundName: myPlaygroundName,
        routes: routes.map(r => ({
          from: r.from,
          to: r.to,
          weight: r.traffic,
        })),
      }),
    });

    const newNodes = nodes.map(n => ({
      nodeid: n.nodeid,
      x: n.x,
      y: n.y,
      label: n.label,
    }));

    fetch("http://localhost:8080/api/playground/saveNode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playgroundName: myPlaygroundName,
        nodes: newNodes
      }),
    });
  };

  const loadPlayground = (loadedRoutes: any) => {
    if (routes.length !== 0) {
      if (!window.confirm("Your current route will be lost. Are you sure?")) return;
    }

    const backendNodes = loadedRoutes.nodes;
    const backendRoutes = loadedRoutes.routes;

    const newNodes: Node[] = backendNodes.map((n: any) => ({
      nodeid: Number(n.nodeId),
      x: n.x,
      y: n.y,
      label: n.label,
    }));

    const newRoutes: Route[] = backendRoutes.map((r: any) => ({
      from: Number(r.fromNode),
      to: Number(r.toNode),
      traffic: r.weight,
    }));

    setSelectedNode(null);
    setOptimizedPath([]);
    setShowLoader(false);

    setNodes(newNodes);

    setTimeout(() => {
      setRoutes(newRoutes);
    }, 0);
  };

  const setLoaderAndShrink = () => {
    if (session == null) {
      alert("Login to see your saved routes")
      return;
    }
    setShowLoader(!showLoader);
    props.toggleShrink();
  }

  useEffect(() => {
    props.onOptimizeCallback(optimizeRoute);
  }, [optimizeRoute]);

  const isOptimizedEdge = (from: number, to: number) => {
    if (!optimizedPath || optimizedPath.length < 2) return false;

    for (let i = 0; i < optimizedPath.length - 1; i++) {
      const a = optimizedPath[i];
      const b = optimizedPath[i + 1];

      if ((a === from && b === to) || (a === to && b === from)) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
  <div className="p-6 flex justify-center items-start min-h-screen">

    <div className={`transition-all duration-500 ${showLoader ? "w-[80vw]" : "w-full"}`}>
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap gap-3 bg-white/30 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/20">
        <button
          className="px-5 py-2 rounded-full bg-green-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={addNode}
        >
          Add Node
        </button>

        <button
          className="px-5 py-2 rounded-full bg-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={startAddRoute}
        >
          Add Route
        </button>

        <button
          className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={() => setShowOptions(true)}
        >
          Optimize
        </button>

        {routes.length > 1 && (
          <button
            className="px-5 py-2 rounded-full border-2 border-blue-500 text-blue-600 font-semibold hover:bg-blue-50 hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={saveRoute}
          >
            Save Playground
          </button>
        )}

        <button
          className="px-5 py-2 rounded-full bg-gray-800 text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={setLoaderAndShrink}
        >
          Saved Routes
        </button>
      </div>

      {/* Optimize Modal */}
      {showOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white/90 rounded-3xl p-6 w-72 shadow-2xl border border-white/20 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Choose Optimization
            </h2>

            <button
              className="w-full py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition duration-300"
              onClick={() => { shortestPath(); setShowOptions(false); }}
            >
              Shortest Path
            </button>

            <button
              className="w-full py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 shadow-md hover:shadow-lg transition duration-300"
              onClick={() => { optimizeRoute(); setShowOptions(false); }}
            >
              Traffic Optimized
            </button>

            <button
              className="mt-3 w-full text-gray-500 hover:text-gray-800 font-medium text-sm transition duration-200"
              onClick={() => setShowOptions(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div className="relative w-[100%] h-[520px] bg-white rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        {/* Routes */}
        {routes.map((r, i) => {
          const start = nodes.find((n) => n.nodeid === r.from);
          const end = nodes.find((n) => n.nodeid === r.to);
          if (!start || !end) return null;

          const x1 = start.x + 20;
          const y1 = start.y + 20;
          const x2 = end.x + 20;
          const y2 = end.y + 20;
          const length = Math.hypot(x2 - x1, y2 - y1);
          const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <React.Fragment key={i}>
              <div
                className={`absolute h-2 rounded-lg cursor-pointer ${isOptimizedEdge(r.from, r.to) ? "bg-gradient-to-r from-red-500 to-pink-500 shadow-lg" : "bg-gradient-to-r from-blue-400 to-sky-500 shadow-md"}`}
                style={{
                  width: length,
                  left: x1,
                  top: y1,
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "0 0",
                }}
                onClick={() => editTraffic(i)}
              />
              <div
                className="absolute px-2 py-0.5 text-black font-semibold bg-white/80 rounded-md text-sm shadow-sm"
                style={{ left: midX - 15, top: midY - 10 }}
              >
                {r.traffic}
              </div>
            </React.Fragment>
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => (
          <Rnd
            key={n.nodeid}
            size={{ width: 44, height: 44 }}
            position={{ x: n.x, y: n.y }}
            bounds="parent"
            onDragStop={(e, d) =>
              setNodes(nodes.map((nd) => (nd.nodeid === n.nodeid ? { ...nd, x: d.x, y: d.y } : nd)))
            }
          >
            <div
              onClick={() => handleNodeClick(n.nodeid)}
              className={`w-full h-full flex items-center justify-center rounded-full font-bold cursor-pointer shadow-xl transition-all duration-300
                ${selectedNode === n.nodeid
                  ? "bg-yellow-400 text-gray-900 scale-110 shadow-2xl"
                  : "bg-gradient-to-br from-blue-400 to-sky-500 text-white hover:scale-105"}
              `}
            >
              {n.label}
            </div>
          </Rnd>
        ))}
      </div>
    </div>

    {/* Loader */}
    {showLoader && (
      <PlaygroundLoader
        userId={session?.user?.email as string}
        onLoadPlayground={loadPlayground}
        onClose={setLoaderAndShrink}
      />
    )}

  </div>
</>

  );
}
