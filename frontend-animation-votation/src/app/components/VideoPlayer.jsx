import { useEffect, useRef } from "react";
import { useMode } from "../context/ModeContext";

export default function VideoPlayer({ src, op }) {
    const { mode } = useMode();
    const videoRef = useRef(null);

    useEffect(() => {
        if (mode === "rapido" && op && videoRef.current) {
            const videoPlayer = videoRef.current;
            const startTime = parseInt(op.start, 10);
            const chorusTime = parseInt(op.chorus, 10);
            videoPlayer.currentTime = startTime;

            const playSegments = () => {
                videoPlayer.play();

                const firstSegmentEnd = startTime + 5;
                const timeUpdateHandler = () => {
                    if (mode === "rapido" && videoPlayer.currentTime >= firstSegmentEnd) {
                        videoPlayer.pause();
                        videoPlayer.currentTime = chorusTime;
                        videoPlayer.play();

                        const secondSegmentEnd = chorusTime + 15;
                        const secondSegmentHandler = () => {
                            if (mode === "rapido" && videoPlayer.currentTime >= secondSegmentEnd) {
                                videoPlayer.pause();
                                videoPlayer.removeEventListener("timeupdate", secondSegmentHandler);
                            }
                        };

                        videoPlayer.addEventListener("timeupdate", secondSegmentHandler);
                        videoPlayer.removeEventListener("timeupdate", timeUpdateHandler);
                    }
                };

                videoPlayer.addEventListener("timeupdate", timeUpdateHandler);
            };

            playSegments();
        }
        else if (mode === "normal" && videoRef.current) {
            videoRef.current.play();
        }
    }, [mode, op]);

    return (
        <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover sm:rounded-lg"
            autoPlay
            controls
        />
    );
}
