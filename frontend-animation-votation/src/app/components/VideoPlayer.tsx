import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/app/context/SettingsContext";
import { IconButton, Slider, Box, Typography, Popover } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

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
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const videoPlayer = videoRef.current;
    if (videoPlayer) {
      const startTime = parseInt(op.start, 10);
      const chorusTime = parseInt(op.chorus, 10);
      videoPlayer.volume = volume;

      const handleTimeUpdate = () => {
        const currentTime = videoPlayer.currentTime;
        setCurrentTime(currentTime);

        if (isQuickView) {
          if (currentTime <= startTime) {
            videoPlayer.currentTime = startTime;
          }
          if (currentTime >= startTime + 6 && currentTime < chorusTime) {
            videoPlayer.currentTime = chorusTime;
          } else if (currentTime >= chorusTime + 15) {
            togglePlayPause();
            videoPlayer.currentTime = chorusTime + 15;
          }
        }
      };

      videoPlayer.addEventListener("timeupdate", handleTimeUpdate);
      setDuration(videoPlayer.duration);

      return () => {
        videoPlayer.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuickView, op]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    const videoPlayer = videoRef.current;
    if (videoPlayer) {
      if (isPlaying) {
        videoPlayer.pause();
      } else {
        videoPlayer.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (videoRef.current) {
      const newTime = newValue as number;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "volume-popover" : undefined;

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen().catch(console.error);
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
      setControlsVisible(true);
    }
  };

  const formatTime = (time: number) => {
    // return is number is NaN
    if (isNaN(time)) {
      return "0:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 2000);
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
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
      >
        <source src={src} type="video/webm" />
        Tu navegador no soporta la extensión de video.
      </video>
      {controlsVisible && (
        <Box
          className={`absolute bottom-0 left-0 right-0 p-4 sm:rounded-b-lg ${
            isDarkMode ? "bg-gray-900 bg-opacity-70" : "bg-gray-300"
          }`}
        >
          <Typography color={isDarkMode ? "white" : "black"}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <IconButton onClick={togglePlayPause} color="primary">
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <Slider
              min={0}
              max={duration || 1}
              step={0.1}
              onChange={handleSliderChange}
              value={currentTime}
              sx={{ flexGrow: 1, mx: 2 }}
            />
            <IconButton onClick={handleVolumeClick} color="primary">
              <VolumeUpIcon />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Box p={2} alignItems="center">
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
        </Box>
      )}
    </div>
  );
}
