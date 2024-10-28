"use client";
import { useEffect, useState } from "react";
import LoadingIcon from "@/app/components/LoadingIcon";
import ModeChange from "@/app/components/ModeChange";
import { IoMdHome } from "react-icons/io";

import Link from "next/link";

interface Opening {
  _id: string;
  title: string;
  url: string;
}

interface Vote {
  openingId: string;
  userId: string;
  vote: number;
}

export default function Leaderboard() {
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    async function fetchOpenings() {
      try {
        const res = await fetch(`http://192.168.1.58:4000/api/openings`);
        const votes = await fetch(
          `http://192.168.1.58:4000/api/votes/${localStorage.getItem("userId")}`
        );

        if (!res.ok || !votes.ok) throw new Error(`Error: ${res.status}`);

        const opData = await res.json();
        const votesData = await votes.json();

        setOps(opData.openings);
        setVotes(votesData.data || []);
        setTotalPages(Math.ceil(opData.openings.length / pageSize));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOpenings();
  }, []);

  function handleVote(opId: string) {
    const vote = votes.find((vote: Vote) => vote.openingId === opId); // Asegúrate de usar la clave correcta

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
            </span>
        );
    }
}


  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <div className="container sm:w-1/2 mx-auto sm:p-6 bg-gray-200 min-h-screen">
      <table className="w-full table-auto bg-white shadow-xl sm:rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <tr>
            <th className="px-6 py-4 text-left">Nombre del Anime</th>
            <th className="px-6 py-4 text-center">Puntuación</th>
          </tr>
        </thead>
        <tbody>
          {ops.slice((page - 1) * pageSize, page * pageSize).map((op: Opening) => (
            <tr
              key={op._id}
              className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-all duration-200"
            >
              <td className="border-t px-6 py-4">
                <Link
                  href={`/${op._id}`} 
                  className="text-blue-500 hover:underline hover:text-blue-700 transition-all duration-200"
                >
                  {op.title}
                </Link>
              </td>
              <td className="border-t px-6 py-4 text-center">
                {handleVote(op._id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-center items-center space-x-4">
        <button
          className="flex items-center justify-center w-12 h-12 pb-1 bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition-all duration-200"
          onClick={() => {
            if (page > 1) setPage(page - 1);
          }}
        >
          <span className="text-xl text-white">&laquo;</span>
        </button>

        <span className="text-lg font-semibold">
          Página {page} de {totalPages}
        </span>

        <button
          className="flex items-center justify-center w-12 h-12 pb-1 bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition-all duration-200"
          onClick={() => {
            if (page > 1) setPage(page + 1);
          }}
        >
          <span className="text-xl text-white">&raquo;</span>
        </button>
      </div>
    </div>
  );
}
