"use client";
import { useEffect, useState } from "react";
import LoadingIcon from "@/app/components/LoadingIcon";
import Link from "next/link";
import { useSettings } from "@/app/context/SettingsContext";
import { motion } from "framer-motion";
import Countdown from "./components/Countdowm";

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
  const { isDarkMode } = useSettings();
  const [ops, setOps] = useState<Opening[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(15);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [votesMap, setVotesMap] = useState<Record<string, Vote>>({});

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    async function fetchOpenings() {
      try {
        console.log(
          "Fetching openings a: ",
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openings`
        );
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openings`
        );
        console.log("Fetching votos...");
        const votes = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/votes/${localStorage.getItem("userId")}`
        );

        if (!res.ok || !votes.ok) throw new Error(`Error: ${res.status}`);

        const opData = await res.json();
        const votesData = await votes.json();

        console.log(opData);

        setOps(opData.openings);

        const votesByOpeningId = votesData.data.reduce(
          (acc: Record<string, Vote>, vote: Vote) => {
            acc[vote.openingId] = vote;
            return acc;
          },
          {}
        );

        setVotesMap(votesByOpeningId);
        setTotalPages(Math.ceil(opData.openings.length / pageSize));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    fetchOpenings();
  }, [pageSize]);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "dark  transition-colors duration-200"
          : " transition-colors duration-200"
      }`}
    >
      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 transition-colors duration-200">
        <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="sm:flex justify-between items-center">
              <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4 sm:text-left text-center transition-colors duration-200">
                Votación de openings
              </h1>
              <Countdown />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ops
                .slice((page - 1) * pageSize, page * pageSize)
                .map((op, index) => {
                  const vote = votesMap[op._id]?.vote;

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      viewport={{ once: true }}
                      key={op._id}
                      className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm overflow-hidden transition-colors duration-200"
                    >
                      <div className="p-4">
                        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 transition-colors duration-200">
                          {op.title}
                        </h2>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-2xl font-bold transition-colors duration-200 ${
                              vote === 0
                                ? "text-red-400"
                                : vote === 11
                                ? "text-purple-400"
                                : vote !== undefined
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-500"
                            }`}
                          >
                            {vote ?? "Sin votar"}
                          </span>

                          <Link href={`/${op._id}`} passHref>
                            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                              Votar
                            </button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className={`px-3 py-2 rounded-l-md text-sm font-medium ${
                    page === 1
                      ? "bg-blue-100 dark:bg-blue-800 text-blue-400 dark:text-blue-300 cursor-not-allowed"
                      : "bg-white dark:bg-gray-700  text-blue-500 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-600"
                  } border border-blue-300 dark:border-blue-600 transition-colors duration-200`}
                  disabled={page === 1}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`px-3 py-2 text-sm font-medium ${
                      page === index + 1
                        ? "bg-blue-500 dark:bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-700 text-blue-500 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-600"
                    } border-t border-b border-blue-300 dark:border-blue-600 transition-colors duration-200`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  className={`px-3 py-2 rounded-r-md text-sm font-medium ${
                    page === totalPages
                      ? "bg-blue-100 dark:bg-blue-800 text-blue-400 dark:text-blue-300 cursor-not-allowed"
                      : "bg-white dark:bg-gray-700 text-blue-500 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-600"
                  } border border-blue-300 dark:border-blue-600 transition-colors duration-200`}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
