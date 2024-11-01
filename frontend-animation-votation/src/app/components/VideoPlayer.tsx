import { useEffect, useRef } from "react";
import { useSettings } from "@/app/context/SettingsContext";

interface Props {
    className?: string;
    src: string;
    op: {
        start: string;
        chorus: string;
    };
}

export default function VideoPlayer({ src, op, className }: Props) {
    const { isQuickView } = useSettings();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        
        const videoPlayer = videoRef.current;
        const startTime = parseInt(op.start, 10);
        const chorusTime = parseInt(op.chorus, 10);

        videoPlayer.volume = 0.5
        
        // Función de reproducción segmentada
        const handleTimeUpdate = () => {
            const currentTime = videoPlayer.currentTime;
            // Primera pausa en el segmento inicial
            if (isQuickView && currentTime >= startTime + 6 && currentTime < chorusTime) {
                videoPlayer.pause();
                videoPlayer.currentTime = chorusTime;
                videoPlayer.play();
            }
            // Segunda pausa en el segmento del estribillo
            else if (isQuickView && currentTime >= chorusTime + 15) {
                videoPlayer.pause();
                videoPlayer.removeEventListener("timeupdate", handleTimeUpdate);
            }
        };
    
        // Configura el video dependiendo del modo
        if (isQuickView) {
            videoPlayer.currentTime = startTime;
            videoPlayer.play();
            videoPlayer.addEventListener("timeupdate", handleTimeUpdate);
        } else if (!isQuickView) {
            videoPlayer.currentTime = 0;
            videoPlayer.play();
        }
    
        // Limpieza de listener al desmontar o al cambiar de modo

    }, [isQuickView, op]);
    
    

    return (
        <video
            ref={videoRef}
            preload="auto"
            className={className}
            width={1920}
            height={1080}
            autoPlay
            loop
            controls
        >
            <source src={src} type="video/webm" />
            Tu navegador no soporta la extension de video.
        </video>
    );
}
