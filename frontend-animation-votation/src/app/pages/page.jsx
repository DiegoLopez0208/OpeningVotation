"use client";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [votes, setVotes] = useState([]);
  const [mode, setMode] = useState("normal");

  useEffect(() => {
    async function fetchOpenings() {
      try {
        const res = await fetch(`http://localhost:4000/api/openings`);
        const votes = await fetch(
          `http://localhost:4000/api/votes/${localStorage.getItem("userId")}`
        );

        if (!res.ok || !votes.ok) throw new Error(`Error: ${res.status}`);

        const opData = await res.json();
        const votesData = await votes.json();

        setOps(opData.openings);
        setVotes(votesData.data);
        setTotalPages(Math.ceil(opData.openings.length / pageSize));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOpenings();
  }, []);

  function handleVote(opId) {
    const vote = votes.find((vote) => vote.openingId === opId); // Asegúrate de usar la clave correcta

    if (vote) {
      return (
        <span className="text-white bg-green-500 px-3 py-1 rounded-full">
          {vote.vote}
        </span>
      );
    } else {
      return (
        <span className="text-white bg-gray-500 px-3 py-1 rounded-full">
          Sin votar
        </span> // Mostrar "N/A" si no hay voto
      );
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-200 min-h-screen">
      <input
        type="text"
        placeholder="Buscar anime..."
        className="mb-6 w-full rounded-xl border border-gray-300 p-3 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
      />

      <table className="w-full table-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <tr>
            <th className="px-6 py-4 text-left">Nombre del Anime</th>
            <th className="px-6 py-4 text-center">Puntuación</th>
          </tr>
        </thead>
        <tbody>
          {ops
            .slice((page - 1) * pageSize, page * pageSize)
            .map(op => (
              <tr
                key={op._id}
                className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-all duration-200"
              >
                <td className="border-t px-6 py-4">
                  <a
                    href={`pages/openings/${op._id}`}
                    className="text-blue-500 hover:underline hover:text-blue-700 transition-all duration-200"
                  >
                    {op.title}
                  </a>
                </td>
                <td className="border-t px-6 py-4 text-center">{handleVote(op._id)}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-center items-center space-x-4">
        {/* Botón "Anterior" */}
        {page > 1 && (
          <button
            className="flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-all duration-200"
            onClick={() => setPage(page - 1)}
          >
            {"<"}
          </button>
        )}

        {/* Número de página actual */}
        <span className="text-lg font-semibold">
          Página {page} de {totalPages}
        </span>

        {/* Botón "Siguiente" */}
        {page < totalPages && (
          <button
            className="flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-all duration-200"
            onClick={() => setPage(page + 1)}
          >
            {">"}
          </button>
        )}
      </div>
    </div>
  );
}
