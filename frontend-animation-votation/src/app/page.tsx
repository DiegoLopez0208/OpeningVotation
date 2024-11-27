"use client";
import { useEffect, useState, useRef } from "react";
import LoadingIcon from "@/app/components/LoadingIcon";
import { useSettings } from "@/app/context/SettingsContext";
import Countdown from "./components/Countdowm";
import { useDataContext } from "./context/DataContext";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Leaderboard() {
  const { isDarkMode } = useSettings();
  const { data = [], loading, votesMapping = {} } = useDataContext();
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("currentPage") || "1");
    }
    return 1;
  });
  const itemsPerPage = 15;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        buttonRef.current,
        { backgroundColor: "#1e40af" },
        { backgroundColor: "#1d4ed8", duration: 0.5, repeat: -1, yoyo: true },
      );
    },
    { dependencies: [loading], scope: containerRef }
  );

  useGSAP(
    () => {
      gsap.fromTo(
        ".card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2, stagger: 0.03 }
      );
    },
    { dependencies: [loading, currentPage], scope: containerRef }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentPage", currentPage.toString());
    }
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
          ? "dark transition-colors duration-200"
          : "transition-colors duration-200"
      }`}
    >
      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 transition-colors duration-200">
        <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="w-full flex justify-center">
              <Link
                ref={buttonRef}
                href={"/results"}
                className="text-gray-100 font-semibold text-2xl py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700"
              >
                Resultados disponibles!
              </Link>
            </div>
            <div className="sm:flex justify-between items-center">
              <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 sm:text-left text-center transition-colors duration-200 hidden sm:inline">
                Votación de openings
              </h1>
              <Countdown />
            </div>
            <div
              ref={containerRef}
              className="container mx-auto grid mt-4 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {currentData.map((op) => {
                const vote = votesMapping[op._id]?.[0]?.vote;
                return (
                  <div
                    key={op._id}
                    className="card bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm overflow-hidden transition-colors duration-200"
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
                            Ver
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-2 rounded-l-md text-sm font-medium bg-blue-600 text-white border border-blue-300 dark:border-blue-600 transition-colors duration-200 ${
                  }"
                >
                  Anterior
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-2 text-sm font-medium bg-blue-700 text-white border-t border-b border-blue-300 dark:border-blue-600 transition-colors duration-200 ${
                      currentPage === index + 1
                        ? "bg-blue-400 text-white dark:bg-blue-500"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-r-md text-sm bg-blue-600 text-white font-medium border border-blue-300 dark:border-blue-600 transition-colors duration-200 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
