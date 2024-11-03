import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/app/context/SettingsContext";
import { IconButton, Slider, Box, Typography, Popover } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

interface Props {
    className?: string;
    src: string;
    op: {
        start: string;
        chorus: string;
    };
}

export default function VideoPlayer({ src, op, className }: Props) {
    const { isQuickView, isDarkMode } = useSettings();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(0.5);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [controlsVisible, setControlsVisible] = useState(true);

    useEffect(() => {
        const videoPlayer = videoRef.current;
        if (videoPlayer) {
            const startTime = parseInt(op.start, 10);
            const chorusTime = parseInt(op.chorus, 10);
            videoPlayer.volume = volume;

            const handleTimeUpdate = () => {
                setCurrentTime(videoPlayer.currentTime);

                if (isQuickView) {
                    if (videoPlayer.currentTime >= startTime + 6 && videoPlayer.currentTime < chorusTime) {
                        videoPlayer.currentTime = chorusTime;
                    } else if (videoPlayer.currentTime >= chorusTime + 15) {
                        videoPlayer.pause();
                        videoPlayer.removeEventListener("timeupdate", handleTimeUpdate);
                    }
                }
            };

            videoPlayer.currentTime = isQuickView ? startTime : 0;
            videoPlayer.play();
            videoPlayer.addEventListener("timeupdate", handleTimeUpdate);

            return () => {
                videoPlayer.removeEventListener("timeupdate", handleTimeUpdate);
            };
        }
    }, [isQuickView, op]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlayPause = () => {
        const videoPlayer = videoRef.current;
        if (videoPlayer) {
            if (isPlaying) videoPlayer.pause();
            else videoPlayer.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
        const value = Math.min(Math.max(newValue as number, 0), 1);
        setVolume(value);
        if (videoRef.current) {
            videoRef.current.volume = value;
        }
    };

    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        if (videoRef.current) {
            const timeValue = newValue as number;
            if (timeValue >= 0 && timeValue <= duration) {
                videoRef.current.currentTime = timeValue;
                setCurrentTime(timeValue);
            }
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (!isFullscreen) {
                videoRef.current.requestFullscreen().catch(console.error);
            } else {
                document.exitFullscreen();
            }
            setIsFullscreen(!isFullscreen);
        }
    };

    const formatTime = (time: number): string => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleMouseMove = () => {
        setControlsVisible(true);
        setTimeout(() => setControlsVisible(false), 2000);
    };

    return (
        <div className={`relative ${className}`} onMouseMove={handleMouseMove}>
            <video
                ref={videoRef}
                preload="auto"
                className="w-full h-auto rounded-lg shadow-md"
                autoPlay
                loop
                controls={false}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            >
                <source src={src} type="video/webm" />
                Tu navegador no soporta la extensión de video.
            </video>
            {controlsVisible && (
                <Box className={`absolute bottom-0 left-0 right-0 p-4 ${isDarkMode ? 'bg-gray-900 bg-opacity-70' : 'bg-gray-300'}`}>
                    <Typography color={isDarkMode ? "white" : "black"}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <IconButton onClick={togglePlayPause} color="primary">
                            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <Slider
                            min={0}
                            max={duration}
                            step={0.1}
                            onChange={handleSliderChange}
                            value={currentTime}
                            sx={{ flexGrow: 1, mx: 2 }}
                        />
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="primary">
                            <VolumeUpIcon />
                        </IconButton>
                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                            <Box p={2}>
                                <Slider
                                    orientation="vertical"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    sx={{ height: 100 }}
                                />
                            </Box>
                        </Popover>
                        <IconButton onClick={toggleFullscreen} color="primary">
                            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                    </Box>
                    <Typography color={isDarkMode ? "white" : "black"}>
                        {isPlaying ? "Reproduciendo" : "Pausado"}
                    </Typography>
                </Box>
            )}
        </div>
    );
}
