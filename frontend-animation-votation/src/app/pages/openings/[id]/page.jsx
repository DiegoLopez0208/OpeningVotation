"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMode } from "@/app/context/ModeContext";
import LoadingIcon from "@/app/components/LoadingIcon";
import ModeChange from "@/app/components/ModeChange";
import VideoPlayer from "@/app/components/VideoPlayer";
import Image from "next/image";
import Kita from "@/app/img/kita-chan-kitaikuyo.gif";
import Konata from "@/app/img/konata.gif";
import { IoMdHome } from "react-icons/io";

export default function PostPage() {
  const { mode } = useMode();
  const { id } = useParams();
  const [userId, setUserId] = useState(null);
  const [ops, setOps] = useState(null);
  const [votes, setVotes] = useState(null);
  const [opVote, setOpVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(5); // Iniciar en 5 para un rango de 1 a 10

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);
  
  useEffect(() => {
    if (!userId) return;
  
    async function fetchOpening() {
      try {
        const opRes = await fetch(`http://192.168.1.58:4000/api/opening/${id}`);
        const voteRes = await fetch(`http://192.168.1.58:4000/api/votes/${userId}`);
  
        if (!opRes.ok || !voteRes.ok) throw new Error("Opening no encontrado");
  
        const opData = await opRes.json();
        const votesData = await voteRes.json();
  
        console.log(votesData)
        setVotes(votesData.data);

        // encontrar el voto del usuario para el opening
        const userVote = votesData.data.find((vote) => vote.openingId === id);
        setOpVote(userVote ? userVote : null);

        setOps(opData.data);
        
      } catch (error) {
        console.error("Error al obtener el opening:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOpening();
  }, [id, userId]);

  const handleChange = (e) => setValue(e.target.value);

  const handleButtonClick = (openingId) => {
    window.location.href = `/pages/openings/${openingId}`;
  };

  const formatValue = (value) => value / 10;

  if (loading) return <LoadingIcon />;

  return (
    <div className="w-full bg-gray-200">
      <Image
        src={Kita}
        unoptimized
        height={150}
        alt="Kita icon"
        className="absolute bottom-0 right-4"
      />
      <Image
        src={Konata}
        unoptimized
        priority
        height={200}
        alt="Konata icon"
        className="absolute -bottom-3 left-0"
      />
      <div className="container sm:w-1/2 mx-auto sm:p-6 bg-gray-300 h-screen">
        <div className="flex justify-between">
          <button
            onClick={() => (window.location.href = "/pages")}
            className="text-3xl bg-blue-600 hover:bg-blue-800 text-white mb-4 sm:mr-4 px-4 sm:rounded-lg transition duration-200 shadow-lg"
          >
            <IoMdHome className="" />
          </button>

          <ModeChange reload={true} />
        </div>

        {/* Contenedor del video y título */}
        <div className="bg-white bg-opacity-90 shadow-lg hover:shadow-purple-500 sm:rounded-lg sm:p-4 mb-4 transition-all duration-200">
          <h1 className="text-4xl text-gray-800 sm:my-0 sm:mb-4 my-2">
            {ops.opening.title}
          </h1>
          <h3>Nota {opVote.vote}</h3>
          <VideoPlayer src={ops.opening.url} mode={mode} op={ops.opening} />
        </div>

        {/* Slider de votación */}
        <div className="bg-gray-50 bg-opacity-80 shadow-lg hover:shadow-xl hover:shadow-purple-500 sm:rounded-lg p-6 mb-6 flex flex-col items-center transition-all duration-200">
          <div className="flex items-center w-full gap-4">
            {/* Botón 1 */}
            <button
              className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={() => setValue(1)}
            >
              0
            </button>

            {/* Contenedor del Slider */}
            <div className="flex flex-col items-center w-full mx-4">
              <input
                id="range-slider"
                type="range"
                min="10"
                max="100"
                step="5"
                value={value}
                onChange={handleChange}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4ade80 ${
                    ((value - 10) / 90) * 10000
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
              className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={() => setValue(10)}
            >
              11
            </button>
          </div>

          {/* Botón de envío de voto */}
          <button
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md"
            onClick={() => console.log(`Voto enviado: ${formatValue(value)}`)}
          >
            Enviar voto
          </button>
        </div>

        {/* Navegación entre openings */}
        <div className="flex flex-row justify-between items-center gap-4">
          {ops.previousOpening && (
            <button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 sm:rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => handleButtonClick(ops.previousOpening._id)}
            >
              Anterior
            </button>
          )}
          {ops.nextOpening && (
            <button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 sm:rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => handleButtonClick(ops.nextOpening._id)}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
