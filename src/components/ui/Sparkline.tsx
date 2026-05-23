"use client";

import { useMemo } from "react";
import { line, curveMonotoneX } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";

interface SparklineProps {
  data: readonly number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  stroke = "currentColor",
  fill,
  className,
}: SparklineProps) {
  const path = useMemo(() => {
    if (data.length < 2) return null;
    const [min = 0, max = 1] = extent(data);
    const x = scaleLinear()
      .domain([0, data.length - 1])
      .range([1, width - 1]);
    const y = scaleLinear()
      .domain([min, max === min ? max + 1 : max])
      .range([height - 2, 2]);
    return line<number>()
      .x((_, i) => x(i))
      .y((d) => y(d))
      .curve(curveMonotoneX)(Array.from(data));
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!path || !fill) return null;
    return `${path} L ${width - 1} ${height - 1} L 1 ${height - 1} Z`;
  }, [path, fill, width, height]);

  if (!path) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        aria-hidden
      />
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden
    >
      {areaPath ? <path d={areaPath} fill={fill} opacity={0.18} /> : null}
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
