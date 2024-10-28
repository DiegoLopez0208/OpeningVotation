"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSettings } from "@/app/context/SettingsContext";
import LoadingIcon from "@/app/components/LoadingIcon";
import ModeChange from "@/app/components/ModeChange";
import VideoPlayer from "@/app/components/VideoPlayer";
import Image from "next/image";
import Kita from "@/app/img/kita-chan-kitaikuyo.gif";
import Konata from "@/app/img/konata.gif";
import { IoMdHome } from "react-icons/io";
import Link from "next/link";

interface Vote {
  openingId: string;
  userId: string;
  vote: number;
  _id: string;
  submittedBy: string;
}

export default function PostPage() {
  const { mode, gifsEnabled } = useSettings();
  const { id } = useParams();
  const [userId, setUserId] = useState<string | null>();
  const [ops, setOps] = useState<any>(null);
  const [opVote, setOpVote] = useState<Vote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<number>(5);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);
  
  useEffect(() => {
    if (!userId) return;
  
    async function fetchOpening() {
      try {
        const opRes = await fetch(`${process.env.BASE_URL}/api/opening/${id}`);
        const voteRes = await fetch(`${process.env.BASE_URL}/api/votes/${userId}`);
  
        if (!opRes.ok || !voteRes.ok) throw new Error("Opening no encontrado");
  
        const opData = await opRes.json();
        const votesData = await voteRes.json();
  
        // encontrar el voto del usuario para el opening
        const userVote = votesData.data.find((vote: Vote) => vote.openingId === id);
        setOpVote(userVote ? userVote : {
          value: 0,
        });

        setOps(opData.data);
        
      } catch (error) {
        console.error("Error al obtener el opening:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOpening();
  }, [id, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  }

  const handleButtonClick = (openingId: string) => {
    window.location.href = `/${openingId}`;
  };

  if (loading) return <LoadingIcon />;

  return (
    <div className="w-full bg-gray-200">
      <Image
        src={Kita}
        hidden={!gifsEnabled}
        unoptimized
        height={150}
        alt="Kita icon"
        className="absolute bottom-0 right-4"
      />
      <Image
        src={Konata}
        hidden={!gifsEnabled}
        unoptimized
        priority
        height={200}
        alt="Konata icon"
        className="absolute bottom-0 left-0"
      />
      <div className="container sm:w-1/2 mx-auto sm:p-6 bg-gray-300 h-screen">
        {/* Contenedor del video y título */}
        <div className="bg-white bg-opacity-90 shadow-lg hover:shadow-purple-500 sm:rounded-lg sm:p-4 mb-4 transition-all duration-200">
          <h1 className="text-4xl text-gray-800 sm:my-0 sm:mb-4 my-2">
            {ops.opening.title}
          </h1>
          <h3>{opVote?.vote ? `Voto: ${opVote.vote}` : "Aun sin votar"}</h3>
          <VideoPlayer src={ops.opening.url} mode={mode} op={ops.opening} />
        </div>

        {/* Slider de votación */}
        <div className="bg-gray-50 bg-opacity-80 shadow-lg hover:shadow-xl hover:shadow-purple-500 sm:rounded-lg p-6 mb-4 flex flex-col items-center transition-all duration-200">
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
                Nota: {(value / 10)}
              </span>
            </div>

            {/* Botón 10 */}
            <button
              className="bg-green-600 hover:bg-green-800 text-white px-3 py-2 rounded-lg transition duration-200"
              onClick={() => setValue(10)}
            >
              11
            </button>
          </div>

          {/* Botón de envío de voto */}
          <button
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md"
            onClick={() => console.log(`Voto enviado: ${value}`)}
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
