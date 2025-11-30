import React, { useState, useEffect } from "react";

interface Playground {
  playgroundName: string;
}

interface Props {
  userId: string;
  onLoadPlayground: (routes: any[]) => void;
  onClose: () => void;
}

const PlaygroundLoader: React.FC<Props> = ({ userId, onLoadPlayground, onClose }) => {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchPlaygrounds = async () => {
      setLoading(true);

      try {
        const res = await fetch(`http://localhost:8080/api/playground/list?userid=${userId}`);
        const data: Playground[] = await res.json();

        const unique = Array.from(
          new Map(data.map((item) => [item.playgroundName, item]))
        ).map(([, value]) => value);

        setPlaygrounds(unique);
      } catch {}
      setLoading(false);
    };

    fetchPlaygrounds();
  }, [userId]);

  const loadPlaygroundRoutes = async (name: string) => {
    const res = await fetch(
      `http://localhost:8080/api/playground/getplayground?userid=${userId}&playgroundName=${name}`
    );
    const routesAndNodes = await res.json();
    onLoadPlayground(routesAndNodes);
    onClose();
  };

  return (
    <div className="fixed top-0 right-0 w-[20%] h-full bg-white shadow-lg p-4 z-50">
      <h2 className="text-xl font-bold mb-4">Saved Playgrounds</h2>

      {loading && <p>Loading...</p>}
      {!loading && playgrounds.length === 0 && <p>No saved routes.</p>}

      <ul className="space-y-2">
        {playgrounds.map((pg) => (
          <li
            key={pg.playgroundName}
            className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
            onClick={() => loadPlaygroundRoutes(pg.playgroundName)}
          >
            {pg.playgroundName}
          </li>
        ))}
      </ul>

      <button
        onClick={onClose}
        className="mt-5 px-3 py-2 bg-red-500 text-white w-full rounded"
      >
        Close
      </button>
    </div>
  );
};

export default PlaygroundLoader;
