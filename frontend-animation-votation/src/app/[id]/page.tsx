"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingIcon from "@/app/components/LoadingIcon";
import VideoPlayer from "@/app/components/VideoPlayer";
import Link from "next/link";
import Slider from "@mui/material/Slider";
import styled from "@emotion/styled";
import time from "timers"

interface Vote {
  openingId: string;
  userId: string;
  vote: number;
  _id: string;
  submittedBy: string;
}
const CustomSlider = styled(Slider)(({}) => ({
  color: "#1976D2",
  height: 10,
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "white",
    border: "2px solid currentColor",
    marginTop: 0,
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "inherit",
    },
  },
  "& .MuiSlider-rail": {
    height: 5,
    borderRadius: 4,
    backgroundColor: "#bfbfbf",
  },
  "& .MuiSlider-track": {
    height: 8,
    borderRadius: 4,
  },
}));

export default function PostPage() {
  const { id } = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [ops, setOps] = useState<any>(null); // eslint-disable-line
  const [elevenVote, setElevenVote] = useState<boolean>(false);
  const [ceroVote, setCeroVote] = useState<boolean>(false);
  const [opVote, setOpVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<number>(5.5);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showVoteAlert, setShowVoteAlert] = useState<boolean>(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/login";
    }
  }, []);

  const fetchVotes = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/votes/${userId}`
      );
      const { data } = await response.json();

      console.log(time)

      const userVote = data.find((vote: Vote) => vote.openingId === id);
      setOpVote(userVote || null);
      setValue(userVote ? userVote.vote : -1);

      setElevenVote(data.some((vote: Vote) => vote.vote === 11));
      setCeroVote(data.some((vote: Vote) => vote.vote === 0));
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

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number); // Asegúrate de manejar el caso de rango si es necesario
  };

  const handleVote = async () => {
    if (value === 11 || value === 0) {
      setAlertMessage(
        value === 11
          ? "¿Estás seguro de utilizar el voto 11?"
          : "¿Estás seguro de utilizar el voto 0?"
      );
      setShowAlert(true);
    } else if (value === -1) {
      alert("Elige un número para poder votar!");
    } else {
      await sendVote();
    }
  };

  const sendVote = async () => {
    if (!userId) return;

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

      if (!response.ok) throw new Error("Error al enviar el voto");

      await fetchVotes();
      setShowVoteAlert(true);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  if (loading) return <LoadingIcon />;

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 transition-colors duration-200 sm:p-4 pt-4">
      <div className="container mx-auto w-fit rounded-lg border-2 dark:border-blue-700 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto rounded-lg shadow-lg">
          <div className="text-2xl dark:text-blue-200 font-bold text-center m-4 sm:m-6">
            {ops ? ops.op.title : "Cargando..."}
          </div>
          <div className="space-y-6">
            <div className="aspect-video sm:mx-6">
              <VideoPlayer
                className="sm:rounded-lg border-2 border-white border-opacity-10"
                src={ops.op.url}
                op={ops.op}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 sm:w-9/12 w-full mx-auto pb-6 px-6">
              <CustomSlider
                value={value}
                className="w-full"
                onChange={handleChange}
                min={1}
                max={10}
                step={0.5}
                defaultValue={5.5}
              />
              <div className="w-full flex justify-between">
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
                  {value === -1 ? "Selecciona un voto" : value}
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
                onClick={handleVote}
                className={`text-white px-4 w-full py-2 ${
                  opVote?.vote === value
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                } rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                {opVote?.vote === value ? (
                  <span>Voto enviado</span>
                ) : (
                  <span>Enviar voto</span>
                )}
              </button>
            </div>
          </div>
          <div className="w-full flex justify-between p-6">
            <Link
              href={ops.prevOp ? `/${ops.prevOp}` : "/"}
              className={`px-4 py-2 text-white rounded-md ${
                ops.prevOp
                  ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Anterior
            </Link>
            <Link
              href={ops.nextOp ? `/${ops.nextOp}` : "/"}
              className={`px-4 py-2 text-white rounded-md ${
                ops.nextOp
                  ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Siguiente
            </Link>
          </div>
        </div>
      </div>
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2 dark:text-blue-200">
              Confirmación de Voto
            </h2>
            <p className="mb-4 dark:text-blue-200">{alertMessage}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAlert(false)}
                className="bg-gray-300 rounded px-4 py-2"
              >
                Cancelar
              </button>
              <button
                onClick={sendVote}
                className="bg-blue-500 text-white rounded px-4 py-2"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
      {showVoteAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2 dark:text-blue-200">
              Voto Realizado
            </h2>
            <p className="mb-4 dark:text-blue-200">
              Tu voto ha sido registrado.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowVoteAlert(false)}
                className="bg-blue-500 text-white rounded px-4 py-2"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
