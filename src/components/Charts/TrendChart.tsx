'use client';

/**
 * TrendChart component for displaying historical data trends.
 * Uses Recharts for line chart visualization.
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HistoricalDataPoint } from '@/types';

export interface TrendChartProps {
  /** Historical data points to display */
  data: HistoricalDataPoint[];
  /** Chart title */
  title: string;
  /** Line color (default: blue) */
  color?: string;
  /** Show USD values instead of local (default: true) */
  showUsd?: boolean;
  /** Chart height in pixels (default: 200) */
  height?: number;
  /** Value prefix for tooltip (default: $) */
  valuePrefix?: string;
}

/**
 * Line chart for displaying historical trends over time.
 */
export function TrendChart({
  data,
  title,
  color = '#2563eb',
  showUsd = true,
  height = 200,
  valuePrefix = '$',
}: TrendChartProps) {
  // Transform data for Recharts
  const chartData = data.map((point) => ({
    year: point.year,
    value: showUsd ? point.value.usd : point.value.local,
  }));

  // Format values for tooltip
  const formatValue = (value: number) => {
    return `${valuePrefix}${value.toLocaleString()}`;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No historical data available
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
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
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(val) => `${valuePrefix}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip
            formatter={(value) => [formatValue(Number(value)), 'Value']}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, fill: color }}
            activeDot={{ r: 6, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
