"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis } from "recharts";
import { faNum } from "@/lib/faNum";
import type { AffordabilityForecastPoint } from "@/types/shopping";
import styles from "./AffordabilityForecastChart.module.css";

type AffordabilityForecastChartProps = {
  forecast: AffordabilityForecastPoint[];
};

const BAR_COLORS = ["var(--color-success)", "var(--color-neutral-400)"];

export function AffordabilityForecastChart({ forecast }: AffordabilityForecastChartProps) {
  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={forecast} margin={{ top: 26, right: 10, bottom: 0, left: 10 }} barCategoryGap="38%">
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-history-heading)", fontSize: 12, fontFamily: "var(--font-ravi)" }}
            dy={8}
          />
          <Bar dataKey="price" radius={[10, 10, 4, 4]} maxBarSize={68} isAnimationActive animationDuration={750} animationEasing="ease-out">
            {forecast.map((entry, index) => (
              <Cell key={entry.label} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
            <LabelList
              dataKey="price"
              position="top"
              offset={10}
              formatter={(value) => `${faNum(Number(value))} م`}
              style={{
                fill: "var(--color-history-title)",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "var(--font-ravi)",
                letterSpacing: "var(--numeric-letter-spacing)",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
