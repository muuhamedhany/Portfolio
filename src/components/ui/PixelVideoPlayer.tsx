import React, { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import playIcon from "@iconify-icons/pixelarticons/play";
import pauseIcon from "@iconify-icons/pixelarticons/pause";
import volumeIcon from "@iconify-icons/pixelarticons/volume";
import volume1Icon from "@iconify-icons/pixelarticons/volume-1";
import volume2Icon from "@iconify-icons/pixelarticons/volume-2";
import volume3Icon from "@iconify-icons/pixelarticons/volume-3";
import volumeXIcon from "@iconify-icons/pixelarticons/volume-x";
import expandIcon from "@iconify-icons/pixelarticons/expand";
import collapseIcon from "@iconify-icons/pixelarticons/collapse";
import reloadIcon from "@iconify-icons/pixelarticons/reload";
import repeatIcon from "@iconify-icons/pixelarticons/repeat";
import slidersIcon from "@iconify-icons/pixelarticons/sliders";
import loaderIcon from "@iconify-icons/pixelarticons/loader";
import alertIcon from "@iconify-icons/pixelarticons/alert";
import arrowLeftIcon from "@iconify-icons/pixelarticons/arrow-left";
import arrowRightIcon from "@iconify-icons/pixelarticons/arrow-right";
import { motion, AnimatePresence } from "motion/react";

export interface PixelVideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  embedded?: boolean;
  className?: string;
  onEnded?: () => void;
}

const PLAYBACK_SPEEDS = [0.5, 1, 1.25, 1.5, 2] as const;

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function PixelVideoPlayer({
  src,
  title = "VIDEO_PLAYBACK.MP4",
  poster,
  autoPlay = false,
  loop = true,
  muted = false,
  embedded = false,
  className = "",
  onEnded,
}: PixelVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [volume, setVolume] = useState<number>(muted ? 0 : 1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [bufferedEnd, setBufferedEnd] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(loop);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [crtEffect, setCrtEffect] = useState<boolean>(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const [speedMenuOpen, setSpeedMenuOpen] = useState<boolean>(false);

  // Kinetic flash notification HUD
  const [flashFeedback, setFlashFeedback] = useState<{ text: string; id: number } | null>(null);

  const triggerFlash = useCallback((text: string) => {
    setFlashFeedback({ text, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!flashFeedback) return;
    const timer = setTimeout(() => {
      setFlashFeedback(null);
    }, 700);
    return () => clearTimeout(timer);
  }, [flashFeedback]);

  // Controls auto-hide timer
  const scheduleControlsHide = useCallback(() => {
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (!isPlaying) {
      setControlsVisible(true);
      return;
    }
    hideControlsTimerRef.current = setTimeout(() => {
      if (!isDragging && !speedMenuOpen) {
        setControlsVisible(false);
      }
    }, 2800);
  }, [isPlaying, isDragging, speedMenuOpen]);

  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    scheduleControlsHide();
  }, [scheduleControlsHide]);

  // Reset controls timer on state changes
  useEffect(() => {
    scheduleControlsHide();
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [scheduleControlsHide]);

  // Handle Play/Pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play()
        .then(() => {
          setIsPlaying(true);
          triggerFlash("PLAY");
        })
        .catch((err) => {
          console.warn("Video playback blocked or failed:", err);
          setIsPlaying(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
      setControlsVisible(true);
      triggerFlash("PAUSE");
    }
  }, [triggerFlash]);

  // Handle Volume
  const changeVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    if (videoRef.current) {
      videoRef.current.volume = clamped;
      videoRef.current.muted = clamped === 0;
    }
    setIsMuted(clamped === 0);
    triggerFlash(`VOL ${Math.round(clamped * 100)}%`);
  }, [triggerFlash]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted || volume === 0) {
      const restored = volume === 0 ? 0.75 : volume;
      video.muted = false;
      video.volume = restored;
      setIsMuted(false);
      setVolume(restored);
      triggerFlash(`VOL ${Math.round(restored * 100)}%`);
    } else {
      video.muted = true;
      setIsMuted(true);
      triggerFlash("MUTED");
    }
  }, [isMuted, volume, triggerFlash]);

  // Seek forward / backward
  const seekRelative = useCallback((deltaSeconds: number) => {
    const video = videoRef.current;
    if (!video || isNaN(video.duration)) return;
    const target = Math.max(0, Math.min(video.duration, video.currentTime + deltaSeconds));
    video.currentTime = target;
    setCurrentTime(target);
    triggerFlash(deltaSeconds > 0 ? `+${deltaSeconds}S` : `${deltaSeconds}S`);
    showControlsTemporarily();
  }, [triggerFlash, showControlsTemporarily]);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
        triggerFlash("FULLSCREEN");
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        triggerFlash("WINDOWED");
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed:", err);
    }
  }, [triggerFlash]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Speed Cycle
  const cyclePlaybackSpeed = useCallback(() => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed as any);
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    const nextSpeed = PLAYBACK_SPEEDS[nextIndex];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
    triggerFlash(`${nextSpeed}X SPEED`);
  }, [playbackSpeed, triggerFlash]);

  const selectPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setSpeedMenuOpen(false);
    triggerFlash(`${speed}X SPEED`);
  }, [triggerFlash]);

  // Loop toggle
  const toggleLoop = useCallback(() => {
    const next = !isLooping;
    setIsLooping(next);
    if (videoRef.current) {
      videoRef.current.loop = next;
    }
    triggerFlash(next ? "LOOP: ON" : "LOOP: OFF");
  }, [isLooping, triggerFlash]);

  // CRT scanline effect toggle
  const toggleCrt = useCallback(() => {
    const next = !crtEffect;
    setCrtEffect(next);
    triggerFlash(next ? "CRT: ON" : "CRT: OFF");
  }, [crtEffect, triggerFlash]);

  // Scrubber drag / click mechanics
  const handleSeekFromEvent = useCallback((e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!scrubberRef.current || !videoRef.current || !duration) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const target = ratio * duration;
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  }, [duration]);

  const handleScrubberMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleSeekFromEvent(e);

    const onMouseMove = (moveEvent: MouseEvent) => {
      handleSeekFromEvent(moveEvent);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current || !duration) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverRatio(ratio);
    setHoverTime(ratio * duration);
  };

  const handleScrubberMouseLeave = () => {
    setHoverRatio(null);
    setHoverTime(null);
  };

  // Keyboard Navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;

    switch (e.key) {
      case " ":
      case "k":
      case "K":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowLeft":
        e.preventDefault();
        seekRelative(-5);
        break;
      case "ArrowRight":
        e.preventDefault();
        seekRelative(5);
        break;
      case "ArrowUp":
        e.preventDefault();
        changeVolume(volume + 0.1);
        break;
      case "ArrowDown":
        e.preventDefault();
        changeVolume(volume - 0.1);
        break;
      case "m":
      case "M":
        e.preventDefault();
        toggleMute();
        break;
      case "f":
      case "F":
        e.preventDefault();
        toggleFullscreen();
        break;
      case "c":
      case "C":
        e.preventDefault();
        toggleCrt();
        break;
      case "l":
      case "L":
        e.preventDefault();
        toggleLoop();
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if (duration) {
          e.preventDefault();
          const pct = parseInt(e.key, 10) / 10;
          if (videoRef.current) {
            videoRef.current.currentTime = pct * duration;
            setCurrentTime(pct * duration);
            triggerFlash(`${pct * 100}%`);
          }
        }
        break;
    }
  }, [togglePlay, seekRelative, changeVolume, volume, toggleMute, toggleFullscreen, toggleCrt, toggleLoop, duration, triggerFlash]);

  // Video event handlers
  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);

    if (videoRef.current.buffered.length > 0) {
      const buffered = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBufferedEnd(buffered);
    }
  };

  const onLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    videoRef.current.playbackRate = playbackSpeed;
    videoRef.current.loop = isLooping;
    setHasError(false);
  };

  const onWaiting = () => setIsBuffering(true);
  const onPlaying = () => {
    setIsBuffering(false);
    setIsPlaying(true);
  };
  const onPause = () => setIsPlaying(false);
  const onError = () => {
    setHasError(true);
    setIsBuffering(false);
    setErrorMessage("FAILED TO LOAD MEDIA STREAM");
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return volumeXIcon;
    if (volume < 0.33) return volume1Icon;
    if (volume < 0.66) return volume2Icon;
    return volume3Icon;
  };

  const VOLUME_BLOCKS = 6;
  const activeVolumeBlocks = isMuted ? 0 : Math.round(volume * VOLUME_BLOCKS);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseMove={showControlsTemporarily}
      onMouseEnter={showControlsTemporarily}
      className={`pixel-video-player group relative w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixel-frame)] ${
        isFullscreen ? "h-screen w-screen bg-black flex flex-col justify-center" : "aspect-video"
      } ${className}`}
      aria-label={`Pixel Video Player: ${title}`}
    >
      {/* ── Outer Bezel Enclosure (Double-Bezel Hardware Frame) ── */}
      <div
        className={`relative flex h-full w-full flex-col bg-[#050508] overflow-hidden ${
          isFullscreen || embedded
            ? "border-0 shadow-none"
            : "border-2 border-[var(--pixel-frame)] shadow-[4px_4px_0_var(--pixel-shadow)]"
        }`}
        style={{
          clipPath:
            isFullscreen || embedded
              ? undefined
              : "polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px))",
        }}
      >
        {/* ── Top Hardware HUD Bar ── */}
        <div className="relative z-30 flex h-7 sm:h-8 items-center justify-between border-b-2 border-[var(--pixel-frame)] bg-[var(--card)] px-2.5 sm:px-3 text-foreground shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {/* Status dot */}
            <span
              className={`inline-block h-2 w-2 border border-[var(--pixel-frame)] ${
                isBuffering
                  ? "bg-amber-400 animate-pulse"
                  : isPlaying
                  ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                  : "bg-muted-foreground"
              }`}
            />
            {/* Filename/Title */}
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate text-foreground">
              [ {title} ]
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Resolution indicator */}
            <span className="hidden sm:inline-block border border-[var(--pixel-frame)] bg-background px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
              1080P // 60FPS
            </span>

            {/* CRT scanline toggle badge */}
            <button
              type="button"
              onClick={toggleCrt}
              title="Toggle Retro CRT Scanlines"
              className={`border border-[var(--pixel-frame)] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider transition-colors cursor-pointer ${
                crtEffect
                  ? "bg-[var(--pixel-active)] text-[var(--pixel-active-foreground)] font-bold shadow-[1px_1px_0_var(--pixel-shadow)]"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              CRT: {crtEffect ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* ── Main Video Display Stage ── */}
        <div
          className="relative flex-1 bg-black flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={togglePlay}
        >
          {/* Native Video Element */}
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay={autoPlay}
            loop={isLooping}
            muted={isMuted}
            playsInline
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onWaiting={onWaiting}
            onPlaying={onPlaying}
            onPause={onPause}
            onError={onError}
            onEnded={() => {
              setIsPlaying(false);
              onEnded?.();
            }}
            className="h-full w-full object-contain pointer-events-none"
          />

          {/* ── CRT Retro Scanline Texture (Toggleable) ── */}
          {crtEffect && (
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(18, 16, 26, 0) 50%, rgba(0, 0, 0, 0.6) 50%)",
                backgroundSize: "100% 4px",
              }}
              aria-hidden="true"
            />
          )}

          {/* ── Center Kinetic HUD Flash Notification ── */}
          <AnimatePresence>
            {flashFeedback && (
              <motion.div
                key={flashFeedback.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none absolute z-30 border-2 border-[var(--pixel-frame)] bg-background/95 px-4 py-2 font-display text-2xl tracking-wider text-[var(--accent-to)] shadow-[4px_4px_0_var(--pixel-shadow)]"
                style={{
                  clipPath:
                    "polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))",
                }}
              >
                {flashFeedback.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Buffering Indicator ── */}
          {isBuffering && (
            <div className="absolute z-20 flex flex-col items-center gap-2 border-2 border-[var(--pixel-frame)] bg-background/90 px-4 py-2.5 shadow-[4px_4px_0_var(--pixel-shadow)]">
              <Icon icon={loaderIcon} className="h-6 w-6 text-[var(--accent-to)] animate-spin" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground font-bold">
                BUFFERING STREAM...
              </span>
            </div>
          )}

          {/* ── Error Screen ── */}
          {hasError && (
            <div
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/90 p-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-12 w-12 items-center justify-center border-2 border-red-500 bg-red-950/80 text-red-400 shadow-[3px_3px_0_var(--pixel-shadow)]">
                <Icon icon={alertIcon} className="h-7 w-7" />
              </div>
              <div className="font-display text-xl text-red-400 uppercase tracking-wide">
                STREAM ERROR
              </div>
              <p className="max-w-xs font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                {errorMessage || "Unable to play video source."}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) {
                    setHasError(false);
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="mt-2 inline-flex items-center gap-2 border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] px-4 py-1.5 font-mono text-[11px] font-bold uppercase text-white shadow-[3px_3px_0_var(--pixel-shadow)] hover:brightness-110 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                <Icon icon={reloadIcon} className="h-4 w-4" />
                RETRY CONNECTION
              </button>
            </div>
          )}

          {/* ── Retro Arcade "PRESS START" Big Center Play Overlay ── */}
          {!isPlaying && !isBuffering && !hasError && (
            <div
              className="group/btn absolute z-20 flex flex-col items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center border-2 border-[var(--pixel-frame)] bg-[var(--card)] text-[var(--accent-to)] shadow-[4px_4px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-white transition-colors cursor-pointer"
                style={{
                  clipPath:
                    "polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px))",
                }}
                aria-label="Play video"
              >
                <Icon icon={playIcon} className="h-8 w-8 translate-x-0.5" />
              </motion.button>

              <div className="border border-[var(--pixel-frame)] bg-background/95 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-foreground shadow-[2px_2px_0_var(--pixel-shadow)]">
                PRESS START
              </div>
            </div>
          )}
        </div>

        {/* ── Tactile Arcade Control Deck (Bottom Dock) ── */}
        <AnimatePresence>
          {(controlsVisible || !isPlaying || speedMenuOpen) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.14 }}
              className="relative z-30 flex flex-col border-t-2 border-[var(--pixel-frame)] bg-[var(--card)] px-2 sm:px-3 pt-2 pb-2 text-foreground shrink-0 shadow-[inset_1px_1px_0_var(--pixel-edge-light)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── 1. Chunky Pixel Scrubber (Timeline) ── */}
              <div
                ref={scrubberRef}
                onMouseDown={handleScrubberMouseDown}
                onMouseMove={handleScrubberMouseMove}
                onMouseLeave={handleScrubberMouseLeave}
                className="group/scrubber relative mb-2 flex h-5 w-full items-center cursor-pointer select-none"
                role="slider"
                aria-label="Video timeline"
                aria-valuemin={0}
                aria-valuemax={duration || 100}
                aria-valuenow={currentTime}
              >
                {/* Scrubber Base Groove */}
                <div className="relative h-2.5 w-full border border-[var(--pixel-frame)] bg-background shadow-[inset_1px_1px_0_rgba(0,0,0,0.6)] overflow-hidden">
                  {/* Buffer progress bar */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-muted-foreground/30 transition-all duration-150"
                    style={{ width: `${bufferedPercent}%` }}
                  />

                  {/* Play progress bar */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-[var(--pixel-active)] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-75"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Chunky Pixel Thumb Handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-4 w-3 items-center justify-center border border-[var(--pixel-frame)] bg-foreground shadow-[2px_2px_0_var(--pixel-shadow)] group-hover/scrubber:scale-110 active:scale-95 transition-transform pointer-events-none"
                  style={{
                    left: `${progressPercent}%`,
                    clipPath:
                      "polygon(0 2px, 2px 2px, 2px 0, calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px))",
                  }}
                />

                {/* Hover Time Tooltip */}
                {hoverRatio !== null && hoverTime !== null && (
                  <div
                    className="absolute -top-7 -translate-x-1/2 pointer-events-none border border-[var(--pixel-frame)] bg-foreground px-1.5 py-0.5 font-mono text-[9px] font-bold text-background shadow-[2px_2px_0_var(--pixel-shadow)] z-40"
                    style={{
                      left: `${hoverRatio * 100}%`,
                      clipPath:
                        "polygon(0 2px, 2px 2px, 2px 0, calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px))",
                    }}
                  >
                    {formatTime(hoverTime)}
                  </div>
                )}
              </div>

              {/* ── 2. Pixel Arcade Controls Bar ── */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Left controls: Play, Skip, Volume, Digital Time */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Play / Pause button */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="pixel-control-btn flex h-8 w-8 items-center justify-center border-2 border-[var(--pixel-frame)] bg-background text-foreground shadow-[2px_2px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-colors cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    <Icon icon={isPlaying ? pauseIcon : playIcon} className="h-4 w-4" />
                  </button>

                  {/* Skip -5s */}
                  <button
                    type="button"
                    onClick={() => seekRelative(-5)}
                    className="pixel-control-btn hidden sm:flex h-8 w-8 items-center justify-center border-2 border-[var(--pixel-frame)] bg-background text-foreground shadow-[2px_2px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-white active:translate-x-[1px] active:translate-y-[1px] transition-colors cursor-pointer"
                    title="Seek backward 5 seconds"
                    aria-label="Seek backward 5 seconds"
                  >
                    <Icon icon={arrowLeftIcon} className="h-4 w-4" />
                  </button>

                  {/* Skip +5s */}
                  <button
                    type="button"
                    onClick={() => seekRelative(5)}
                    className="pixel-control-btn hidden sm:flex h-8 w-8 items-center justify-center border-2 border-[var(--pixel-frame)] bg-background text-foreground shadow-[2px_2px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-white active:translate-x-[1px] active:translate-y-[1px] transition-colors cursor-pointer"
                    title="Seek forward 5 seconds"
                    aria-label="Seek forward 5 seconds"
                  >
                    <Icon icon={arrowRightIcon} className="h-4 w-4" />
                  </button>

                  {/* Volume Cluster: Mute button + Stepped Volume Bars */}
                  <div className="flex items-center gap-1 border border-[var(--pixel-frame)] bg-background px-1.5 py-1">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="text-foreground hover:text-[var(--accent-to)] transition-colors cursor-pointer"
                      title={isMuted ? "Unmute" : "Mute"}
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      <Icon icon={getVolumeIcon()} className="h-4 w-4" />
                    </button>

                    {/* Stepped Discrete Pixel Volume Bars */}
                    <div
                      className="flex items-center gap-0.5 cursor-pointer py-0.5"
                      title="Adjust Volume"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const fraction = (e.clientX - rect.left) / rect.width;
                        changeVolume(fraction);
                      }}
                    >
                      {Array.from({ length: VOLUME_BLOCKS }).map((_, i) => {
                        const filled = i < activeVolumeBlocks;
                        return (
                          <span
                            key={i}
                            className={`block h-3 w-1.5 border border-[var(--pixel-frame)] transition-colors ${
                              filled
                                ? "bg-[var(--pixel-active)] shadow-[0_0_3px_var(--pixel-active)]"
                                : "bg-muted-foreground/20"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Monospace Digital Telemetry Timer */}
                  <div className="flex items-center gap-1 border border-[var(--pixel-frame)] bg-background px-2 py-1 font-mono text-[9px] sm:text-[10px] font-bold text-foreground select-none">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Right controls: Speed, Loop, Replay, Fullscreen */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Playback speed selector pill with popover */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                      className="pixel-control-btn flex h-8 items-center gap-1 border-2 border-[var(--pixel-frame)] bg-background px-2 font-mono text-[10px] font-bold uppercase text-foreground shadow-[2px_2px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-white transition-colors cursor-pointer"
                      title="Playback Speed"
                      aria-label={`Playback speed: ${playbackSpeed}x`}
                    >
                      <Icon icon={slidersIcon} className="h-3.5 w-3.5" />
                      <span>{playbackSpeed}X</span>
                    </button>

                    {/* Speed menu dropdown */}
                    {speedMenuOpen && (
                      <div
                        className="absolute bottom-full right-0 mb-1 flex flex-col border-2 border-[var(--pixel-frame)] bg-[var(--card)] p-1 shadow-[3px_3px_0_var(--pixel-shadow)] z-50 min-w-[70px]"
                        style={{
                          clipPath:
                            "polygon(0 3px, 3px 3px, 3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px))",
                        }}
                      >
                        {PLAYBACK_SPEEDS.map((sp) => (
                          <button
                            key={sp}
                            type="button"
                            onClick={() => selectPlaybackSpeed(sp)}
                            className={`px-2 py-1 text-left font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                              playbackSpeed === sp
                                ? "bg-[var(--pixel-active)] text-white"
                                : "text-foreground hover:bg-background"
                            }`}
                          >
                            {sp}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Loop toggle button */}
                  <button
                    type="button"
                    onClick={toggleLoop}
                    className={`pixel-control-btn flex h-8 w-8 items-center justify-center border-2 border-[var(--pixel-frame)] shadow-[2px_2px_0_var(--pixel-shadow)] transition-colors cursor-pointer ${
                      isLooping
                        ? "bg-[var(--pixel-active)] text-[var(--pixel-active-foreground)]"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
                    title={isLooping ? "Looping: ON" : "Looping: OFF"}
                    aria-label="Toggle loop"
                  >
                    <Icon icon={repeatIcon} className="h-4 w-4" />
                  </button>

                  {/* Fullscreen button */}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="pixel-control-btn flex h-8 w-8 items-center justify-center border-2 border-[var(--pixel-frame)] bg-background text-foreground shadow-[2px_2px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-white active:translate-x-[1px] active:translate-y-[1px] transition-colors cursor-pointer"
                    title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    <Icon icon={isFullscreen ? collapseIcon : expandIcon} className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
