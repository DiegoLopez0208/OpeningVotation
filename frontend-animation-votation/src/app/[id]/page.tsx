"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSettings } from "@/app/context/SettingsContext";
import LoadingIcon from "@/app/components/LoadingIcon";
import VideoPlayer from "@/app/components/VideoPlayer";
import Image from "next/image";
import Kita from "@/app/img/kita-chan-kitaikuyo.gif";
import Konata from "@/app/img/konata.gif";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ops, setOps] = useState<any>(null);
  const [elevenVote, setElevenVote] = useState<boolean>();
  const [ceroVote, setCeroVote] = useState<boolean>();
  const [opVote, setOpVote] = useState<Vote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<number>(55);
  
  const fetchVotes = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/votes/${userId}`
      );
      const { data } = await response.json();

      const userVote = data.find((vote: Vote) => vote.openingId === id);
      setOpVote(userVote ? userVote : { value: 0 });

      setElevenVote(data.some((vote: Vote) => vote.vote === 11));
      setCeroVote(data.some((vote: Vote) => vote.vote === 0));

      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }, [id, userId]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchOpening = async () => {
      try {
        const opRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/opening/${id}`
        );

        if (!opRes.ok) throw new Error("Opening no encontrado");

        const opData = await opRes.json();
        await fetchVotes();
        setOps(opData.data);
      } catch (error) {
        console.error("Error al obtener el opening:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpening();
  }, [id, userId, fetchVotes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const handleButtonClick = (openingId: string) => {
    window.location.href = `/${openingId}`;
  };

  const sendVote = async () => {
    if (!userId) return;

    if (value === 110) alert("Estas seguro de utilizar el voto 11?");
    if (value === 0) alert("Estas seguro de utilizar el voto 0?");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            openingId: id,
            vote: value / 10,
          }),
        }
      );
      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      await fetchVotes(); // Actualiza los votos después de enviar el voto
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  if (loading) return <LoadingIcon />;

  return (
    <div className="h-full py-6">
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
      <div className="container sm:w-1/2 mx-auto sm:p-6 bg-gray-300 h-full">
        {/* Contenedor del video y título */}
        <div className="bg-white bg-opacity-90 shadow-lg hover:shadow-purple-500 transition-all duration-200 sm:rounded-lg sm:p-4 mb-4">
          {ops ? (
            <>
              <h1 className="text-4xl text-gray-800 mb-4">{ops.op.title}</h1>

              {opVote ? (
                <h3 className="text-lg text-gray-600">
                  {opVote.vote >= 0 ? `Voto: ${opVote.vote}` : "Aún sin votar"}
                </h3>
              ) : (
                <h3 className="text-lg text-gray-600">Aún sin votar</h3>
              )}

              <VideoPlayer src={ops.op.url} mode={mode} op={ops.op} />
            </>
          ) : (
            <h1 className="text-4xl text-gray-800 pb-6 text-center">
              🤨 No existe el opening...
            </h1>
          )}
        </div>

        {/* Slider de votación */}
        <div
          className={`${
            ops ? "" : "hidden"
          } bg-gray-50 bg-opacity-80 shadow-lg hover:shadow-xl hover:shadow-purple-500 sm:rounded-lg p-6 mb-4 flex flex-col items-center transition-all duration-200`}
        >
          <div className="flex items-center w-full gap-4">
            {/* Botón 1 */}
            <button
              className={`${
                ceroVote
                  ? "bg-gray-500 opacity-50 cursor-default"
                  : "bg-red-600 hover:bg-red-800"
              } text-white px-4 py-2 rounded-lg transition duration-200`}
              onClick={() => {
                if (!ceroVote) setValue(0);
              }}
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
                Nota: {value / 10}
              </span>
            </div>

            {/* Botón 11 si elevenVote es true oscurecer el boton */}

            <button
              className={`${
                elevenVote
                  ? "bg-gray-500 opacity-50 cursor-default"
                  : "bg-green-600 hover:bg-green-800"
              } text-white px-3 py-2 rounded-lg transition duration-200`}
              onClick={() => {
                if (!elevenVote) setValue(110);
              }}
            >
              11
            </button>
          </div>

          {/* Botón de envío de voto*/}
          <button
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md"
            onClick={() => sendVote()}
          >
            Enviar voto
          </button>
        </div>

        {/* Navegación entre openings */}
        {ops && (
          <div
            className={`flex flex-row ${
              ops.prevOp ? "justify-between" : "justify-end"
            } items-center gap-4`}
          >
            {ops.prevOp && (
              <button
                className={`w-1/3 sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg font-semibold px-6 py-2 sm:rounded-lg transition duration-200 shadow-lg`}
                onClick={() => handleButtonClick(ops.prevOp)}
              >
                Anterior
              </button>
            )}
            {ops.nextOp && (
              <button
                className="w-1/3 sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-l-lg font-semibold px-6 py-2 sm:rounded-lg transition duration-200 shadow-lg"
                onClick={() => handleButtonClick(ops.nextOp)}
              >
                Siguiente
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
