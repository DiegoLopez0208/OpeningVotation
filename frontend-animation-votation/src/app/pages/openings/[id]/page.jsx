"use client";
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function PostPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [op, setOp] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null); // Referencia para el elemento de video

  useEffect(() => {
    async function fetchOpening() {
      try {
        const res = await fetch(`http://localhost:4000/api/opening/${id}`);
        if (!res.ok) throw new Error("Opening no encontrado");
        const { data } = await res.json();
        setData(data);
        setOp(data.opening);
      } catch (error) {
        console.error("Error al obtener el opening:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOpening();
  }, [id]);

  useEffect(() => {
    // Reproduce el video cuando `op` esté listo y `loading` sea falso
    if (op && !loading && videoRef.current) {
      const videoPlayer = videoRef.current;

      const startTime = parseInt(op.start, 10);
      const chorusTime = parseInt(op.chorus, 10);
      
      // Establece el tiempo de inicio
      videoPlayer.currentTime = startTime;

      const playSegments = () => {
        videoPlayer.play();

        // Maneja el primer segmento (5 segundos desde `start`)
        const firstSegmentEnd = startTime + 5; // Fin del primer segmento

        const timeUpdateHandler = () => {
          if (videoPlayer.currentTime >= firstSegmentEnd) {
            videoPlayer.pause();
            videoPlayer.currentTime = chorusTime; // Salta al tiempo de `chorus`
            videoPlayer.play(); // Reanuda la reproducción

            // Maneja el segundo segmento (15 segundos desde `chorus`)
            const secondSegmentEnd = chorusTime + 15; // Fin del segundo segmento

            const secondSegmentHandler = () => {
              if (videoPlayer.currentTime >= secondSegmentEnd) {
                videoPlayer.pause();
                videoPlayer.removeEventListener('timeupdate', secondSegmentHandler); // Remueve el listener
              }
            };

            videoPlayer.addEventListener('timeupdate', secondSegmentHandler);
            videoPlayer.removeEventListener('timeupdate', timeUpdateHandler); // Remueve el listener del primer segmento
          }
        };

        videoPlayer.addEventListener('timeupdate', timeUpdateHandler);
      };

      playSegments();
    }
  }, [op, loading]);

  // Button function to go to the next video or previous video based on the id of the button
  const handleButtonClick = (id) => {
    window.location.href = `/pages/openings/${id}`;
  }

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!op) {
    return <p>Opening no encontrado</p>;
  }

  return (
    <div>
      <button onClick={() => window.history.back()}>Volver</button>
      <h1>{op.title}</h1>
      <p>URL del video: {op.url}</p>
      <video ref={videoRef} src={op.url} width={720} controls autoPlay />
      {data.previousOpening ? (
        <button onClick={() => handleButtonClick(data.previousOpening._id)}>Anterior</button>
      ) : null}

      {data.nextOpening ? (
        <button onClick={() => handleButtonClick(data.nextOpening._id)}>Siguiente</button>
      ) : null}
    </div>
  );
}
