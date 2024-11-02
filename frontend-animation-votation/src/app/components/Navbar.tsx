"use client";
import { useSettings } from "@/app/context/SettingsContext";
import Link from "next/link";
import { useEffect } from "react";

export default function Navbar() {
  const {
    isSettingsOpen,
    isDarkMode,
    isQuickView,
    isShowGifs,
    updateSettingsOpen,
    updateDarkMode,
    updateQuickView,
    updateShowGifs,
  } = useSettings();

  const handleLogout = () => {
    // Implementar lógica de cierre de sesión aquí
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <nav className="bg-blue-600 dark:bg-blue-800 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link href={"/"} className="flex-shrink-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
          <div className="flex items-center">
            <button
              onClick={() => updateSettingsOpen(!isSettingsOpen)}
              className="relative p-2 rounded-full text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white transition-colors duration-200"
              aria-label="Abrir configuración"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl z-10 top-16 mr-4 transition-all duration-300 ease-in-out transform origin-top-right">
                <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Configuración
                  </h3>
                </div>
                <div className="px-4 py-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="flex-grow flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        Modo de ver
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {isQuickView ? "Rápido" : "Normal"}
                      </span>
                    </span>
                    <button
                      onClick={() => updateQuickView(!isQuickView)}
                      className={`${
                        isQuickView
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      aria-pressed={isQuickView}
                    >
                      <span className="sr-only">Usar modo de ver rápido</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          isQuickView ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex-grow flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        Mostrar GIFs
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {isShowGifs ? "Encendido" : "Apagado"}
                      </span>
                    </span>
                    <button
                      onClick={() => updateShowGifs(!isShowGifs)}
                      className={`${
                        isShowGifs
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      aria-pressed={isShowGifs}
                    >
                      <span className="sr-only">Mostrar GIFs</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          isShowGifs ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex-grow flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        Tema
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {isDarkMode ? "Oscuro" : "Claro"}
                      </span>
                    </span>
                    <button
                      onClick={() => updateDarkMode(!isDarkMode)}
                      className={`${
                        isDarkMode
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      aria-pressed={isDarkMode}
                    >
                      <span className="sr-only">Usar tema oscuro</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          isDarkMode ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      />
                    </button>
                  </div>
                </div>
                <div className="px-4 py-4 bg-gray-50 dark:bg-gray-700 text-right transition ease-in-out duration-200">
                  <button
                    onClick={handleLogout}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
