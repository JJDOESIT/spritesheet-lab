"use client";   

import { useEffect, useRef } from "react";


export default function LoadingIcon({time = 1, tileSize = 1, className} : {time?: number, tileSize?: number, className?: string}) {
    const svg = useRef<SVGSVGElement>(null!);
    const animations = useRef<SVGElement[]>([]);
    const intervalId = useRef<NodeJS.Timeout | null>(null);

    const size = 10;

    return (
        <svg ref={svg} viewBox={`${-size} ${-size} ${size*4} ${size*4}`} xmlns="http://www.w3.org/2000/svg"  className={className} width={tileSize} height={tileSize}>
        <defs/>
        <rect x={-((size/2) + 1)} y={-((size/2) + 1)} width={size} height={size} style={{ fill: 'rgb(0, 255, 125)', stroke: 'rgb(0, 255, 125)', transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
            <animateTransform type="scale" additive="replace" attributeName="transform" values="0 1;1 1;1 1;0 1;0 1"  dur={`${time}s`} fill="freeze" keyTimes="0; 0.25; 0.5; 0.75; 1" begin="0" repeatCount="indefinite"></animateTransform>
        </rect>
        <rect x={((size/2) + 1)} y={-((size/2) + 1)} width={size} height={size} style={{ fill: 'rgb(0, 255, 125)', stroke: 'rgb(0, 255, 125)', transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
            <animateTransform type="scale" additive="replace" attributeName="transform" values="1 0;1 0;1 1;1 1;1 0" dur={`${time}s`} fill="freeze" keyTimes="0; 0.25; 0.5; 0.75; 1" begin="0" repeatCount="indefinite"></animateTransform>
        </rect>
        <rect x={((size/2) + 1)} y={((size/2) + 1)} width={size} height={size} style={{ fill: 'rgb(0, 255, 125)', stroke: 'rgb(0, 255, 125)', transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
        <animateTransform type="scale" additive="replace" attributeName="transform" values="1 1;0 1;0 1;1 1;1 1" dur={`${time}s`} fill="freeze" keyTimes="0; 0.25; 0.5; 0.75; 1" begin="0" repeatCount="indefinite"></animateTransform>
        </rect>
        <rect x={-((size/2) + 1)} y={((size/2) + 1)} width={size} height={size} style={{ fill: 'rgb(0, 255, 125)', stroke: 'rgb(0, 255, 125)', transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
            <animateTransform type="scale" additive="replace" attributeName="transform" values="1 1;1 1;1 0;1 0;1 1" dur={`${time}s`} fill="freeze" keyTimes="0; 0.25; 0.5; 0.75; 1" begin="0" repeatCount="indefinite"></animateTransform>
        </rect>
        </svg>
    )
}