"use client";
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useSession } from "next-auth/react";
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

export interface MapPlaygroundProps {
  onOptimizeCallback: (fn: () => void) => void;
  toggleShrink: () => void;
}

export default function MapPlayground(props: MapPlaygroundProps) {
  const { data: session, status } = useSession();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [optimizedPath, setOptimizedPath] = useState<number[]>([]);
  const [showLoader, setShowLoader] = useState(false);

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
        console.log(data);
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

    console.log(newNodes);

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


  if (status === "loading") return <p>Loading...</p>;

  return (
    <>
      <div className="p-4 flex">

        <div className={`transition-all duration-300 ${showLoader ? "w-[80vw]" : "w-full"}`}>
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
            {routes.length > 1 && (
              <button className="px-4 py-2 bg-white text-blue border-2 border-blue-500 rounded" onClick={saveRoute}>
                Save Playground
              </button>
            )}

            <button
              className="px-4 py-2 bg-gray-700 text-white rounded"
              onClick={setLoaderAndShrink}
            >
              See Saved Routes
            </button>
          </div>

          <div className="relative w-[95%] h-[500px] border border-gray-300 bg-white">

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
                    className={`absolute ${isOptimizedEdge(r.from, r.to) ? "bg-red-600" : "bg-blue-500"}`}
                    style={{
                      width: length,
                      height: 4,
                      left: x1,
                      top: y1,
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: "0 0",
                    }}
                    onClick={() => editTraffic(i)}
                  />
                  <div
                    className="absolute px-1 text-black font-bold bg-white rounded"
                    style={{
                      left: midX - 15,
                      top: midY - 10,
                    }}
                  >
                    {r.traffic}
                  </div>
                </React.Fragment>
              );
            })}

            {nodes.map((n) => (
              <Rnd
                key={n.nodeid}
                size={{ width: 40, height: 40 }}
                position={{ x: n.x, y: n.y }}
                bounds="parent"
                onDragStop={(e, d) =>
                  setNodes(nodes.map((nd) => (nd.nodeid === n.nodeid ? { ...nd, x: d.x, y: d.y } : nd)))
                }
              >
                <div
                  onClick={() => handleNodeClick(n.nodeid)}
                  className={`w-full h-full flex items-center justify-center rounded-full text-white font-bold cursor-pointer 
                  ${selectedNode === n.nodeid ? "bg-yellow-500" : "bg-blue-400"}
                `}
                >
                  {n.label}
                </div>

              </Rnd>
            ))}
          </div>
        </div>

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
