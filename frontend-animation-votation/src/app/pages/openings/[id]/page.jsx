"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMode } from "@/app/context/ModeContext";
import LoadingIcon from "@/app/components/LoadingIcon";
import ModeChange from "@/app/components/ModeChange";
import VideoPlayer from "@/app/components/VideoPlayer";
import Image from "next/image";
import Kita from "./img/kita.webp";
import Konata from "./img/konata.gif";
import { IoMdHome } from "react-icons/io";

export default function PostPage() {
  const { mode } = useMode();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(5); // Iniciar en 5 para un rango de 1 a 10

  useEffect(() => {
    async function fetchOpening() {
      try {
        const res = await fetch(`http://192.168.1.58:4000/api/opening/${id}`);
        if (!res.ok) throw new Error("Opening no encontrado");
        const { data } = await res.json();
        setData(data);
      } catch (error) {
        console.error("Error al obtener el opening:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOpening();
  }, [id]);

  const handleChange = (e) => setValue(e.target.value);

  const handleButtonClick = (openingId) => {
    window.location.href = `/pages/openings/${openingId}`;
  };

  const formatValue = (value) => value; // Devuelve el valor directamente

  if (loading) return <LoadingIcon />;

  return (
    <div className="w-full bg-gray-200">
      <Image
        src={Kita}
        width={40}
        height={40}
        alt="Kita icon"
        className="absolute bottom-2 right-10"
      />
      <Image
        src={Konata}
        width={200}
        height={200}
        alt="Konata icon"
        className="absolute bottom-0 left-0"
      />
      <div className="container sm:w-1/2 mx-auto sm:p-6 bg-gray-300 h-screen">
        <div className="flex justify-between">
          <button
            onClick={() => (window.location.href = "/pages")}
            className="text-3xl bg-blue-600 hover:bg-blue-800 text-white mb-4 sm:mr-4 px-4 py-2 sm:rounded-lg transition duration-200 shadow-lg"
          >
            <IoMdHome className="" />
          </button>

          <ModeChange reload={true} />
        </div>

        {/* Contenedor del video y título */}
        <div className="bg-white bg-opacity-90 shadow-2xl sm:rounded-lg sm:p-4 mb-4 border border-gray-300">
          <h1 className="text-4xl text-gray-800 sm:my-0 sm:mb-4 my-2">{data.opening.title}</h1>
          <VideoPlayer src={data.opening.url} mode={mode} op={data.opening} />
        </div>

        {/* Slider de votación */}
        <div className="bg-gray-50 bg-opacity-80 shadow-xl sm:rounded-lg p-6 mb-6 flex flex-col items-center border border-gray-200">
          <div className="flex items-center w-full gap-4">
            {/* Botón 1 */}
            <button
              className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 sm:rounded-lg transition duration-200"
              onClick={() => setValue(1)}
            >
              1
            </button>

            {/* Contenedor del Slider */}
            <div className="flex flex-col items-center w-full mx-4">
              <input
                id="range-slider"
                type="range"
                min="1"
                max="10"
                step="1"
                value={value}
                onChange={handleChange}
                className="w-full h-2 sm:rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4ade80 ${
                    ((value - 1) / 9) * 100
                  }%, #f87171 ${((value - 1) / 9) * 100}%)`, // Degradado de verde a rojo
                }}
                aria-labelledby="slider-value"
              />
              <span
                id="slider-value"
                className="mt-2 font-semibold text-xl text-gray-800"
              >
                Nota: {formatValue(value)}
              </span>
            </div>

            {/* Botón 10 */}
            <button
              className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 sm:rounded-lg transition duration-200"
              onClick={() => setValue(10)}
            >
              10
            </button>
          </div>

          {/* Botón de envío de voto */}
          <button
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 sm:rounded-lg transition-all duration-200 shadow-md"
            onClick={() => console.log(`Voto enviado: ${formatValue(value)}`)}
          >
            Enviar voto
          </button>
        </div>

        {/* Navegación entre openings */}
        <div className="flex flex-row justify-between items-center gap-4">
          {data.previousOpening && (
            <button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 sm:rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => handleButtonClick(data.previousOpening._id)}
            >
              Anterior
            </button>
          )}
          {data.nextOpening && (
            <button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 sm:rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => handleButtonClick(data.nextOpening._id)}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
