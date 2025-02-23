"use client";

import ReactHlsPlayer from "react-hls-player";
import { RefObject, useEffect, useRef } from "react";
import { regulateAspectRatio } from "@/lib/utils";
import { VideoViewType } from "@/types/bsky";

export default function Player({
  thumbnail,
  playlist,
  aspectRatio,
}: VideoViewType) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const { width, height } = regulateAspectRatio(aspectRatio);
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // auto play if on the screen
          player.volume = 0;
          player.play();
        } else {
          // pause if out of the screen
          player.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(player);
    return () => observer.disconnect();
  }, [playerRef]);

  return (
    <ReactHlsPlayer
      poster={thumbnail}
      src={playlist}
      width={width}
      height={height}
      className="object-cover h-full w-full"
      playerRef={playerRef as RefObject<HTMLVideoElement>}
      controls
    />
  );
}
