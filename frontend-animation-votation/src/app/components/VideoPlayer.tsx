import { useEffect, useRef } from "react";
import { useSettings } from "@/app/context/SettingsContext";

interface Props {
    src: string;
    op: {
        start: string;
        chorus: string;
    };
}

export default function VideoPlayer({ src, op }: Props) {
    const { mode } = useSettings();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoRef.current) return;
    
        const videoPlayer = videoRef.current;
        const startTime = parseInt(op.start, 10);
        const chorusTime = parseInt(op.chorus, 10);
    
        // Función de reproducción segmentada
        const handleTimeUpdate = () => {
            const currentTime = videoPlayer.currentTime;
    
            // Primera pausa en el segmento inicial
            if (mode === "rapido" && currentTime >= startTime + 6 && currentTime < chorusTime) {
                videoPlayer.pause();
                videoPlayer.currentTime = chorusTime;
                videoPlayer.play();
            }
            // Segunda pausa en el segmento del estribillo
            else if (mode === "rapido" && currentTime >= chorusTime + 15) {
                videoPlayer.pause();
                videoPlayer.removeEventListener("timeupdate", handleTimeUpdate);
            }
        };
    
        // Configura el video dependiendo del modo
        if (mode === "rapido") {
            videoPlayer.currentTime = startTime;
            videoPlayer.play();
            videoPlayer.addEventListener("timeupdate", handleTimeUpdate);
        } else if (mode === "normal") {
            videoPlayer.currentTime = 0;
            videoPlayer.play();
        }
    
        // Limpieza de listener al desmontar o al cambiar de modo

    }, [mode, op]);
    
    

    return (
        <video
            ref={videoRef}
            src={src}
            preload="auto"
            autoPlay
            loop
            controls
            muted
        />
    );
}
