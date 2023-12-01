"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string;
  width?: string;
  height?: string;
}

export const VideoPlayer = ({ videoUrl, width, height }: VideoPlayerProps) => {
  const ReactPlayer = useMemo(
    () => dynamic(() => import("react-player"), { ssr: false }),
    [],
  );

  return (
    <div className="bg-white">
      <ReactPlayer
        url={videoUrl}
        width={width}
        height={height}
        controls={true}
        pip={true}
      />
    </div>
  );
};
