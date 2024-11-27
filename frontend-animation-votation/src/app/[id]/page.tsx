"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VideoPlayer from "@/app/components/VideoPlayer";
import Link from "next/link";
import Slider from "@mui/material/Slider";
import styled from "@emotion/styled";
import GifsComponent from "../components/GifsComponent";
import { useDataContext } from "../context/DataContext";
import { Vote, Opening } from "../interfaces/interfaces";

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
  const { data, votesMapping } = useDataContext();
  //const [userId, setUserId] = useState<string | null>(null);
  const [opVote, setOpVote] = useState<Vote>();
  const [op, setOp] = useState<Opening | null>(null);
  const [prevOp, setPrevOp] = useState<Opening | null>(null);
  const [nextOp, setNextOp] = useState<Opening | null>(null);
  const [value, setValue] = useState<number>(5.5);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    //const storedUserId = localStorage.getItem("userId");
    //if (storedUserId) setUserId(storedUserId);
    if (data.length > 0 && id) {
      // Encuentra el índice del opening actual
      const currentIndex = data.findIndex((op) => op._id === id);
      if (currentIndex !== -1) {
        // Guarda el opening actual
        setOp(data[currentIndex]);

        // Calcula el siguiente y anterior opening, manejando el desbordamiento de índices
        const prevOpening =
          data[(currentIndex - 1 + data.length) % data.length];
        const nextOpening = data[(currentIndex + 1) % data.length];

        // Guarda los resultados en el estado
        setPrevOp(prevOpening);
        setNextOp(nextOpening);
      }

      // Configura el voto para el opening actual
      if (typeof id === "string" && id && votesMapping[id]) {
        const vote = votesMapping[id][0];
        setValue(vote.vote || 5.5);
        setOpVote(vote);
      }
    }
  }, [data, id, votesMapping]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number); // Asegúrate de manejar el caso de rango si es necesario
  };
  /*

  const handleVote = () => {
    setShowAlert(true);
  };

  const confirmVote = (confirm: boolean) => {
    if (value === -1) {
      return setShowAlert(true);
    }

    if (confirm) {
      sendVote();
    }
    setShowAlert(false);
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

      fetchVotes();

      if (!response.ok) throw new Error("Error al enviar el voto");
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  */

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 transition-colors duration-200 sm:p-4 pt-4">
      <div className="container mx-auto w-fit rounded-lg border-2 dark:border-blue-700 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto rounded-lg shadow-lg">
          {op ? (
            <>
              <div className="text-2xl dark:text-blue-200 font-bold text-center m-4 sm:m-6">
                {op.title}
              </div>
              <div className="space-y-4">
                <div className="aspect-video sm:mx-6">
                  <VideoPlayer
                    className="sm:rounded-lg border-2 border-white border-opacity-10"
                    src={op.url.split("/")[op.url.split("/").length - 1]}
                    op={op}
                  />
                </div>
                <div className="flex flex-col items-center space-y-4 sm:w-9/12 w-full mx-auto pb-6 px-6">
                  <div className="w-full px-2">
                    <CustomSlider
                      value={value}
                      className="w-full"
                      onChange={handleChange}
                      min={1}
                      max={10}
                      step={0.5}
                      defaultValue={5.5}
                    />
                  </div>
                  <div className="w-full flex justify-between">
                    <button
                      /*
                      onClick={() => {
                        if (!ceroVote) setValue(0);
                      }}
                      className={`text-white h-10 w-12 rounded-lg ${
                        ceroVote
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                      }`}
                      */
                      className="text-white h-10 w-12 rounded-lg bg-gray-400 cursor-not-allowed"
                    >
                      0
                    </button>
                    <span className="text-4xl dark:text-blue-200 font-bold">
                      {value === -1
                        ? "Selecciona un voto"
                        : `Tu voto fue: ${opVote?.vote}`}
                    </span>
                    <button
                      /*
                      onClick={() => {
                        if (!elevenVote) setValue(11);
                      }}
                      className={`text-white h-10 w-12 rounded-lg ${
                        elevenVote
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                      }`}
                      */
                      className="text-white h-10 w-12 rounded-lg bg-gray-400 cursor-not-allowed"
                    >
                      11
                    </button>
                  </div>
                  <button
                    //onClick={handleVote}
                    /*
                    className={`text-white px-4 w-full py-2 ${
                      opVote?.vote === value
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    } rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                     */
                    className="text-white px-4 w-full py-2 bg-gray-400 cursor-not-allowed rounded-md"
                    >
                    {opVote?.vote === value ? (
                      <span>Votacion finalizada!{/*Voto enviado*/}</span>
                    ) : (
                      <span>Votacion finalizada!{/*Enviar voto*/}</span>
                    )}
                  </button>
                </div>
              </div>
              <div className="w-full flex justify-between p-6">
                <Link
                  href={prevOp ? `/${prevOp._id}` : "/"}
                  className={`px-4 py-2 text-white rounded-md ${
                    prevOp
                      ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Anterior
                </Link>
                <Link
                  href={nextOp ? `/${nextOp._id}` : "/"}
                  className={`px-4 py-2 text-white rounded-md ${
                    nextOp
                      ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Siguiente
                </Link>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-sm w-full">
            {value == -1 ? (
              <>
                <h2 className="text-lg font-bold mb-2 dark:text-blue-200">
                  Selecciona una nota antes de votar!
                </h2>
                <div className="w-full flex justify-end">
                  <button
                    onClick={() => setShowAlert(false)}
                    className="bg-blue-500 text-white rounded px-4 py-2"
                  >
                    Aceptar
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-lg font-bold mb-2 dark:text-white">
                  Estas seguro de votar{" "}
                  <span className="text-blue-700 dark:text-blue-400">
                    {op?.title}
                  </span>{" "}
                  con un:{" "}
                  <span className="text-blue-700 dark:text-blue-400">
                    {value}
                  </span>
                  ?
                </span>
                <div className="flex justify-end space-x-2">
                  <button
                    //onClick={() => confirmVote(false)}
                    className="bg-gray-300 rounded px-4 py-2"
                  >
                    Cancelar
                  </button>
                  <button
                    //onClick={() => confirmVote(true)}
                    className="bg-blue-500 text-white rounded px-4 py-2"
                  >
                    Aceptar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <GifsComponent />
    </div>
  );
}
