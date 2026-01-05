"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylineoffset";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapClickHandler({ onAddNode }: { onAddNode: (coord: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onAddNode([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function isSameRoute(routeA: [number, number][], routeB: [number, number][], tolerance = 0.0001): boolean {
  if (!routeA.length || !routeB.length) return false;
  const minLen = Math.min(routeA.length, routeB.length);
  let matches = 0;
  for (let i = 0; i < minLen; i++) {
    if (Math.abs(routeA[i][0] - routeB[i][0]) < tolerance && Math.abs(routeA[i][1] - routeB[i][1]) < tolerance) matches++;
  }
  return matches / minLen > 0.8;
}

function deduplicateRoutes(routes: [number, number][][], precision = 6) {
  const seen = new Set<string>();
  const unique: [number, number][][] = [];
  for (const route of routes) {
    const key = route.map(([lat, lng]) => `${lat.toFixed(precision)},${lng.toFixed(precision)}`).join("|");
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(route);
    }
  }
  return unique;
}

async function getRoadRoutes(from: [number, number], to: [number, number]): Promise<[number, number][][]> {
  const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjUwYmMwNGUzNDBjZTRiMWE5OTg4NjhiNDI1MDNiZjg5IiwiaCI6Im11cm11cjY0In0=";
  const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: apiKey },
    body: JSON.stringify({
      coordinates: [[from[1], from[0]], [to[1], to[0]]],
      alternative_routes: { target_count: 3, share_factor: 0.6, weight_factor: 1.4 },
      instructions: false,
    }),
  });
  const data = await res.json();
  return data.features.map((f: any) => f.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]));
}

export default function RealRoadRouteMap() {
  const [nodes, setNodes] = useState<[number, number][]>([]);
  const [edges, setEdges] = useState<[number, number][][]>([]);
  const [optimizedPath, setOptimizedPath] = useState<[number, number][]>([]);

  const isOptimized = optimizedPath.length > 0;

  const addNode = async (coord: [number, number]) => {
    if (nodes.length >= 2) {
      alert("Only 2 points allowed");
      return;
    }
    const updated = [...nodes, coord];
    setNodes(updated);
    if (updated.length === 2) {
      const routes = await getRoadRoutes(updated[0], updated[1]);
      setEdges(deduplicateRoutes(routes));
    }
  };

  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setOptimizedPath([]);
  };

  const handleOptimize = async () => {
    const res = await fetch("http://localhost:8080/api/map/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        src: 0,
        dest: 1,
        routes: edges.map((route) => ({ from: 0, to: 1, weight: route.length, coords: route })),
      }),
    });
    setOptimizedPath(await res.json());
  };

  const visibleEdges = isOptimized ? edges.filter((r) => !isSameRoute(r, optimizedPath)) : edges;
  const darkColors = ["#0f4c81", "#0a7d3f", "#6b1e8a"];
  const lightColors = ["#b5d6fd", "#86efac", "#e9d5ff"];

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto">
      
      <div className="flex flex-wrap gap-3 items-center bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow-md border border-blue-200">
        <button onClick={handleOptimize} className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
          Optimize Route
        </button>
        <button onClick={handleReset} className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition">
          Reset
        </button>
        {edges.length > 0 && <span className="text-gray-600 font-medium">{edges.length} routes found</span>}
      </div>

      
      <div className="rounded-3xl overflow-hidden border border-blue-100 shadow-lg">
        <MapContainer center={[24.8607, 67.0011]} zoom={13} style={{ height: "520px", width: "100%" }}>
          <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {nodes.map((n, i) => (
            <Marker key={i} position={n}>
              <Popup>{i === 0 ? "Source" : "Destination"}</Popup>
            </Marker>
          ))}

          
          {isOptimized && <Polyline positions={optimizedPath} color="red" weight={9} opacity={1} />}

          {visibleEdges.map((edge, idx) => (
            <Polyline
              key={idx}
              positions={edge}
              color={isOptimized ? lightColors[idx % lightColors.length] : darkColors[idx % darkColors.length]}
              weight={isOptimized ? 4 : 6}
              opacity={isOptimized ? 0.45 : 0.9}
              //@ts-ignore
              offset={idx === 0 ? -6 : idx === 2 ? 6 : 0}
            />
          ))}

          <MapClickHandler onAddNode={addNode} />
        </MapContainer>
      </div>
    </div>
  );
}
