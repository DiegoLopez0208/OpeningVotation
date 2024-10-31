"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingIcon from "@/app/components/LoadingIcon";
import VideoPlayer from "@/app/components/VideoPlayer";
import GifsComponent from "@/app/components/GifsComponent";

interface Vote {
  openingId: string;
  userId: string;
  vote: number;
  _id: string;
  submittedBy: string;
}

export default function PostPage() {
  const { id } = useParams();
  const [userId, setUserId] = useState<string | null>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ops, setOps] = useState<any>(null);
  const [elevenVote, setElevenVote] = useState<boolean>();
  const [ceroVote, setCeroVote] = useState<boolean>();
  const [opVote, setOpVote] = useState<Vote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<number>(5.5);

  const fetchVotes = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/votes/${userId}`
      );
      const { data } = await response.json();

      const userVote = data.find((vote: Vote) => vote.openingId === id);
      setOpVote(userVote ? userVote : { value: 0 });
      setValue(userVote ? userVote.vote : -1);

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

  /*
  const handleButtonClick = (openingId: string) => {
    window.location.href = `/${openingId}`;
  };
  */

  const sendVote = async () => {
    if (!userId) return;

    if (value === 11) confirm("Estas seguro de utilizar el voto 11?");
    if (value === 0) confirm("Estas seguro de utilizar el voto 0?");
    if (value === -1) {
      alert("Elegi un numero para poder votar!")
      return;
    };

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
            vote: value,
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
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 transition-colors duration-200 sm:p-4 pt-4">
      <div className="container mx-auto w-fit rounded-lg border-2 dark:border-blue-700 dark:bg-gray-800">
        {/* Card */}
        <div className="max-w-4xl mx-auto rounded-lg shadow-lg">
          {/* Card Header */}
          <div className="text-2xl dark:text-blue-200 font-bold text-center m-4 sm:m-6">
            {ops.op.title || "Cargando..."}
          </div>
          {/* Card Content */}
          <div className="space-y-6">
            <div className="aspect-video sm:mx-6">
              <VideoPlayer
                className="sm:rounded-lg border-2 border-white border-opacity-10"
                src={ops.op.url}
                op={ops.op}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 sm:w-9/12 w-full mx-auto pb-6 px-6">
              {/* Slider */}
              <input
                type="range"
                className="w-full"
                value={value}
                onChange={handleChange}
                min={1}
                max={10}
                step={0.5}
              />
              <div className="w-full flex justify-between">
                {/* Button */}
                <button
                  onClick={() => {
                    if (!ceroVote) setValue(0);
                  }}
                  className={`text-white h-10 w-12 rounded-lg font-thin ${
                    ceroVote
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  }`}
                >
                  0
                </button>
                <span className="text-4xl dark:text-blue-200 font-bold">
                  {value == -1 ? "^ Selecciona un voto ^" : value}
                </span>
                <button
                  onClick={() => {
                    if (!elevenVote) setValue(11);
                  }}
                  className={`text-white h-10 w-12 rounded-lg font-thin ${
                    elevenVote
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  }`}
                >
                  11
                </button>
              </div>
              <button
                onClick={sendVote}
                className={`text-white px-4 w-full py-2 ${
                  opVote?.vote == value
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                } rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                {opVote?.vote == value ? (
                  <span>Voto enviado</span>
                ) : (
                  <span>Enviar voto</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <GifsComponent />
    </div>
  );
}
