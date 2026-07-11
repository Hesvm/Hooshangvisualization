"use client";

import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import type { PortfolioValueSeries } from "@/types/finance";
import styles from "./PortfolioValueChart.module.css";

type PortfolioValueChartProps = {
  series: PortfolioValueSeries;
  accentRgb?: string;
};

const DEFAULT_ACCENT_RGB = "26, 158, 107"; // finance green

function EndDot({ cx, cy, index, total, color }: { cx?: number; cy?: number; index?: number; total: number; color: string }) {
  if (cx == null || cy == null || index !== total - 1) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={`rgba(${color}, 0.16)`} />
      <circle cx={cx} cy={cy} r={3.5} fill={`rgb(${color})`} />
    </g>
  );
}

export function PortfolioValueChart({ series, accentRgb = DEFAULT_ACCENT_RGB }: PortfolioValueChartProps) {
  const gradientId = `portfolio-value-gradient-${series.range}`;

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={series.points} margin={{ top: 12, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`rgb(${accentRgb})`} stopOpacity={0.22} />
              <stop offset="100%" stopColor={`rgb(${accentRgb})`} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["dataMin - 1000000", "dataMax + 1000000"]} />
          <Area
            dataKey="value"
            type="monotone"
            stroke={`rgb(${accentRgb})`}
            strokeWidth={2.25}
            fill={`url(#${gradientId})`}
            dot={(props) => (
              <EndDot key={props.index} {...props} total={series.points.length} color={accentRgb} />
            )}
            isAnimationActive
            animationDuration={650}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
