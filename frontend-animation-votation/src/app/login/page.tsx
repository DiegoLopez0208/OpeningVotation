"use client";
import { useEffect, useState } from "react";
import PasswordInput from "@/app/components/PasswordInput";

export default function Home() {
  const [serverStatus, setServerStatus] = useState("Offline");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        setServerStatus("Iniciando...");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api`);
        const data = await response.json();
        if (data.status === 200) {
          setServerStatus("Online");
        }
      } catch (error) {
        setServerStatus("Offline");
        console.error("Error en la solicitud:", error);
      }
    }
    const userId = localStorage.getItem("userId");
    if (userId) {
      window.location.href = "/";
    }

    fetchServerStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (data.status === 200) {
        localStorage.setItem("userId", data.userId);
        window.location.href = "/";
      }

      if (data.status === 401) {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);     
    }
  };

  return (
    <div className="absolute top-0 h-full flex flex-col w-full items-center justify-center bg-[#f9f9f9] dark:bg-gray-900 -z-10">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 max-w-md w-full  border border-blue-500">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Iniciar sesión
        </h2>
        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-white text-sm font-semibold mb-2"
              htmlFor="username"
            >
              Usuario
            </label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 dark:bg-gray-800 text-white"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-white text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 dark:bg-gray-800"
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center"></div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200"
            onClick={handleSubmit}
          >
            Iniciar sesión
          </button>
        </form>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mt-4">Estado del servidor: {serverStatus}</h2>
    </div>
  );
}
