import React, { useState } from "react";

interface Playground {
  playgroundName: string;
}

interface Props {
  userId: string;
  onLoadPlayground: (routes: any[]) => void;
}

const PlaygroundLoader: React.FC<Props> = ({ userId, onLoadPlayground }) => {
    console.log(userId)
  const [isOpen, setIsOpen] = useState(false);
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaygrounds = async () => {
    setIsOpen(true);
    setLoading(true);

    try {
      const getPlaygrounds = async (userId: string) => {
  try {
    const res = await fetch(`http://localhost:8080/api/playground/list?userId=${userId}`, {
      method: 'GET', // explicitly specifying GET (optional)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data, res)
    setPlaygrounds(data);
  } catch (error) {
    console.error('Error fetching playgrounds:', error);
  }
};

getPlaygrounds(userId);

    } catch (err) {
      console.error("Error loading playgrounds:", err);
      alert("Failed to load saved routes!");
    }

    setLoading(false);
  };

  const loadPlaygroundRoutes = async (name: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/playground/get?userId=${userId}&playgroundName=${name}`
      );

      const routes = await res.json();
      onLoadPlayground(routes); // send data back to parent
      setIsOpen(false);

    } catch (err) {
      console.error("Error loading playground data:", err);
      alert("Failed to load selected playground!");
    }
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={fetchPlaygrounds}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow"
      >
        Load Saved Playgrounds
      </button>

      {/* OVERLAY + SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 
        ${isOpen ? "w-1/5" : "w-0"} overflow-hidden z-50`}
      >
        <div className="p-4 h-full">

          <h2 className="text-xl font-bold mb-4">Saved Playgrounds</h2>

          {loading && <p className="text-gray-600">Loading...</p>}

          {!loading && playgrounds.length === 0 && (
            <p className="text-gray-600 text-sm">No saved routes found.</p>
          )}

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
            onClick={() => setIsOpen(false)}
            className="mt-5 px-3 py-2 bg-red-500 text-white w-full rounded"
          >
            Close
          </button>

        </div>
      </div>
    </>
  );
};

export default PlaygroundLoader;
