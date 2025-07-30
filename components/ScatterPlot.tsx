
'use client';
// components/ScatterPlot.tsx
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

type ScatterPlotProps = {
  xValues: number[];
  yValues: number[];
};

export function ScatterPlot({ xValues, yValues }: ScatterPlotProps) {
  const data = {
    datasets: [
      {
        label: 'Points',
        data: xValues.map((x, i) => ({ x, y: yValues[i] })),
        backgroundColor: 'hsl(221.2 83.2% 53.3%)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
// <Scatter data={data} options={options} />
  return (
    <div className="w-full h-96">
        <Scatter data={data} options={options} />
    </div>
  );
}