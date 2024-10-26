"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMode } from "@/app/context/ModeContext";
import LoadingIcon from "@/app/components/LoadingIcon";
import ModeChange from "@/app/components/ModeChange"
import VideoPlayer from "@/app/components/VideoPlayer";

export default function PostPage() {
  const {mode} = useMode();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleButtonClick = (id) => {
    window.location.href = `/pages/openings/${id}`;
  };

  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-200 min-h-screen flex flex-col items-center">
      <ModeChange reload={true}/>
      <div className="flex flex-row">
        <h1>{data.opening.title}</h1>
        <button
          className="ml-4"
          onClick={() => (window.location.href = "/pages")}
        >
          Volver
        </button>
      </div>
      <VideoPlayer src={data.opening.url} mode={mode} op={data.opening}></VideoPlayer>
      Votacion XD
      {data.previousOpening ? (
        <button onClick={() => handleButtonClick(data.previousOpening._id)}>
          Anterior
        </button>
      ) : null}
      {data.nextOpening ? (
        <button onClick={() => handleButtonClick(data.nextOpening._id)}>
          Siguiente
        </button>
      ) : null}
      <p>URL del video: {data.opening.url}</p>
    </div>
  );
}
