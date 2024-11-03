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
  const [controlsVisible] = useState(true);
  const isSeeking = useRef(false);

  useEffect(() => {
    const videoPlayer = videoRef.current;
    if (videoPlayer) {
      videoPlayer.volume = volume;

      const handleTimeUpdate = () => {
        if (!isSeeking.current) {
          setCurrentTime(videoPlayer.currentTime);
        }
      };

      videoPlayer.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        videoPlayer.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [volume]);

  useEffect(() => {
    const videoPlayer = videoRef.current;
    if (videoPlayer && isQuickView) {
      const startTime = parseInt(op.start, 10);
      const chorusTime = parseInt(op.chorus, 10);

      const handleQuickViewLogic = () => {
        const currentTime = videoPlayer.currentTime;
        if (currentTime >= startTime + 6 && currentTime < chorusTime) {
          videoPlayer.currentTime = chorusTime;
        } else if (currentTime >= chorusTime + 15) {
          videoPlayer.pause();
        }
      };

      videoPlayer.currentTime = startTime;
      videoPlayer.play();
      videoPlayer.addEventListener("timeupdate", handleQuickViewLogic);

      return () => {
        videoPlayer.removeEventListener("timeupdate", handleQuickViewLogic);
      };
    }
  }, [isQuickView, op]);

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
    setVolume(newValue as number);
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    isSeeking.current = true;
    setCurrentTime(newValue as number);
  };

  const handleSliderCommit = () => {
    const videoPlayer = videoRef.current;
    if (videoPlayer) {
      videoPlayer.currentTime = currentTime;
    }
    isSeeking.current = false;
  };

  const handleVolumeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className={`relative ${className}`}>
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
        <Box className={`absolute bottom-0 left-0 right-0 p-4 ${isDarkMode ? "bg-gray-900 bg-opacity-70" : "bg-gray-300"}`}>
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
              value={currentTime}
              onChange={handleSliderChange}
              onChangeCommitted={handleSliderCommit}
              sx={{ flexGrow: 1, mx: 2 }}
            />
            <IconButton onClick={handleVolumeClick} color="primary">
              <VolumeUpIcon />
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "bottom", horizontal: "right" }}
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
        </Box>
      )}
    </div>
  );
}
