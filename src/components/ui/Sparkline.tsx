"use client";

import { useMemo } from "react";
import { line, curveLinear } from "d3-shape";
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

/**
 * Terminal-style sparkline: linear (not curved) interpolation, sharp pixel
 * edges, thin stroke. Matches the brutalist mono aesthetic.
 */
export function Sparkline({
  data,
  width = 60,
  height = 18,
  stroke = "currentColor",
  fill,
  className,
}: SparklineProps) {
  const path = useMemo(() => {
    if (data.length < 2) return null;
    const [min = 0, max = 1] = extent(data);
    const x = scaleLinear()
      .domain([0, data.length - 1])
      .range([0.5, width - 0.5]);
    const y = scaleLinear()
      .domain([min, max === min ? max + 1 : max])
      .range([height - 0.5, 0.5]);
    return line<number>()
      .x((_, i) => x(i))
      .y((d) => y(d))
      .curve(curveLinear)(Array.from(data));
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!path || !fill) return null;
    return `${path} L ${width - 0.5} ${height} L 0.5 ${height} Z`;
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
      shapeRendering="geometricPrecision"
    >
      {areaPath ? <path d={areaPath} fill={fill} opacity={0.14} /> : null}
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={1}
      />
    </svg>
  );
}
