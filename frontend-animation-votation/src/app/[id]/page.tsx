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

    if (value === 110) confirm("Estas seguro de utilizar el voto 11?");
    if (value === 0) confirm("Estas seguro de utilizar el voto 0?");

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
    <div>
      <GifsComponent />
      <div className="h-full">
        <div className="">
          {ops ? (
            <>
              <h1 className="">{ops.op.title}</h1>

              {opVote ? (
                <h3 className="">
                  {opVote.vote >= 0 ? `Voto: ${opVote.vote}` : "Aún sin votar"}
                </h3>
              ) : (
                <h3 className="">Aún sin votar</h3>
              )}

              <VideoPlayer src={ops.op.url} op={ops.op} />
            </>
          ) : (
            <h1 className="">
              🤨 No existe el opening...
            </h1>
          )}
        </div>

        <div
          className={`${
            ops ? "" : "hidden"
          } `}
        >
          <div className="">
            <button
              className={`${
                ceroVote
                  ? ""
                  : ""
              } `}
              onClick={() => {
                if (!ceroVote) setValue(0);
              }}
            >
              0
            </button>

            <div className="">
              <input
                id="range-slider"
                type="range"
                min="10"
                max="100"
                step="5"
                value={value}
                onChange={handleChange}
                className=""
                style={{
                  background: `linear-gradient(to right, #4ade80 ${
                    ((value - 10) / 90) * 10000
                  }%, #f87171 ${((value - 1) / 9) * 100}%)`, // Degradado de verde a rojo
                }}
                aria-labelledby="slider-value"
              />
              <span
                id="slider-value"
                className=""
              >
                Nota: {value / 10}
              </span>
            </div>

            <button
              className={`${
                elevenVote
                  ? ""
                  : ""
              } `}
              onClick={() => {
                if (!elevenVote) setValue(110);
              }}
            >
              11
            </button>
          </div>

          <button
            className=""
            onClick={() => sendVote()}
          >
            Enviar voto
          </button>
        </div>

        {ops && (
          <div
            className={` ${
              ops.prevOp ? "" : ""
            } `}
          >
            {ops.prevOp && (
              <button
                className={``}
                onClick={() => handleButtonClick(ops.prevOp)}
              >
                Anterior
              </button>
            )}
            {ops.nextOp && (
              <button
                className=""
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
