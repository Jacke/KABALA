'use client';

/**
 * InflationChart component for displaying inflation rates.
 * Uses Recharts for bar chart visualization.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { InflationDataPoint } from '@/types';

export interface InflationChartProps {
  /** Inflation data points to display */
  data: InflationDataPoint[];
  /** Chart height in pixels (default: 200) */
  height?: number;
}

/**
 * Get color based on inflation rate.
 */
function getInflationColor(rate: number): string {
  if (rate >= 5) return '#ef4444'; // red - high inflation
  if (rate >= 3) return '#f59e0b'; // amber - moderate
  return '#22c55e'; // green - low
}

/**
 * Bar chart for displaying yearly inflation rates.
 */
export function InflationChart({ data, height = 200 }: InflationChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No inflation data available
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        Inflation Rate (%)
      </h4>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            unit="%"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Inflation']}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getInflationColor(entry.rate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
