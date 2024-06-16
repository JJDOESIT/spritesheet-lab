"use client";

import { useEffect, useRef } from "react";
import { Color } from "three";

export default function LoadingIcon({
  time = 1,
  tileSize = 1,
  color,
  className,
}: {
  time?: number;
  tileSize?: number;
  color: string;
  className?: string;
}) {
  const svg = useRef<SVGSVGElement>(null!);
  const animations = useRef<SVGElement[]>([]);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const size = 10;

  return (
    <svg
      ref={svg}
      viewBox={`${-size} ${-size} ${size * 4} ${size * 4}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`animate__animated animate__fadeIn animate__slower ${className}`}
      width={tileSize}
      height={tileSize}
    >
      <defs />
      <rect
        x={-(size / 2 + 1)}
        y={-(size / 2 + 1)}
        width={size}
        height={size}
        style={{
          fill: color,
          stroke: color,
          transformBox: "fill-box",
          transformOrigin: "50% 50%",
        }}
      >
        <animateTransform
          type="scale"
          additive="replace"
          attributeName="transform"
          values="0 1;1 1;1 1;0 1;0 1"
          dur={`${time}s`}
          fill="freeze"
          keyTimes="0;0.25;0.5;0.75;1"
          begin="0s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x={size / 2 + 1}
        y={-(size / 2 + 1)}
        width={size}
        height={size}
        style={{
          fill: color,
          stroke: color,
          transformBox: "fill-box",
          transformOrigin: "50% 50%",
        }}
      >
        <animateTransform
          type="scale"
          additive="replace"
          attributeName="transform"
          values="1 0;1 0;1 1;1 1;1 0"
          dur={`${time}s`}
          fill="freeze"
          keyTimes="0;0.25;0.5;0.75;1"
          begin="0s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x={size / 2 + 1}
        y={size / 2 + 1}
        width={size}
        height={size}
        style={{
          fill: color,
          stroke: color,
          transformBox: "fill-box",
          transformOrigin: "50% 50%",
        }}
      >
        <animateTransform
          type="scale"
          additive="replace"
          attributeName="transform"
          values="1 1;0 1;0 1;1 1;1 1"
          dur={`${time}s`}
          fill="freeze"
          keyTimes="0;0.25;0.5;0.75;1"
          begin="0s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x={-(size / 2 + 1)}
        y={size / 2 + 1}
        width={size}
        height={size}
        style={{
          fill: color,
          stroke: color,
          transformBox: "fill-box",
          transformOrigin: "50% 50%",
        }}
      >
        <animateTransform
          type="scale"
          additive="replace"
          attributeName="transform"
          values="1 1;1 1;1 0;1 0;1 1"
          dur={`${time}s`}
          fill="freeze"
          keyTimes="0;0.25;0.5;0.75;1"
          begin="0s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}
