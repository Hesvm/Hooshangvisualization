"use client";

import type { ReactNode } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import styles from "./DonutChart.module.css";

export type DonutSlice = {
  id: string;
  percentage: number;
  color: string;
};

type DonutChartProps = {
  slices: DonutSlice[];
  size?: number;
  centerContent?: ReactNode;
  className?: string;
};

export function DonutChart({ slices, size = 160, centerContent, className = "" }: DonutChartProps) {
  const chartData = slices.map((slice) => ({
    id: slice.id,
    value: slice.percentage,
    fill: slice.color,
  }));

  return (
    <div className={`${styles.wrapper} ${className}`} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart accessibilityLayer margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="id"
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={58}
            cornerRadius={10}
            paddingAngle={6}
            stroke="none"
            isAnimationActive
            animationBegin={120}
            animationDuration={850}
            animationEasing="ease-out"
          >
            {chartData.map((entry) => (
              <Cell key={entry.id} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerContent && <div className={styles.center}>{centerContent}</div>}
    </div>
  );
}
