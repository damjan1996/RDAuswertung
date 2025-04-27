'use client';

import { Chart, ChartData, ChartOptions, ChartType, registerables } from 'chart.js';
import React, { useEffect, useRef } from 'react';

// Register all Chart.js components we might need
Chart.register(...registerables);

interface BereichChartProps {
  data: Record<string, number>;
  height?: number;
  className?: string;
}

export default function BereichChart({ data, height = 300, className = '' }: BereichChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    // Clean up function to destroy chart instance on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !data || Object.keys(data).length === 0) return;

    // Generate colors for the chart
    const generateColors = (count: number) => {
      const colors = [];
      const hueStep = 360 / count;

      for (let i = 0; i < count; i++) {
        const hue = (i * hueStep) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }

      return colors;
    };

    // Prepare the data for the chart
    const labels = Object.keys(data);
    const values = Object.values(data);
    const backgroundColor = generateColors(labels.length);

    const chartData: ChartData = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor,
          borderColor: backgroundColor.map(color => color.replace('60%', '50%')),
          borderWidth: 1,
        },
      ],
    };

    // Chart options
    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 11,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed as number;
              const label = context.label || '';
              return `${label}: ${value.toFixed(2)} m²`;
            },
          },
        },
      },
    };

    // Create or update chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data = chartData;
      chartInstanceRef.current.options = options;
      chartInstanceRef.current.update();
    } else {
      if (chartRef.current) {
        chartInstanceRef.current = new Chart(chartRef.current, {
          type: 'pie' as ChartType,
          data: chartData,
          options,
        });
      }
    }
  }, [data]);

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      {!data || Object.keys(data).length === 0 ? (
        <div className="flex items-center justify-center h-full bg-gray-50 rounded-md">
          <p className="text-gray-500">Keine Daten verfügbar</p>
        </div>
      ) : (
        <canvas ref={chartRef} />
      )}
    </div>
  );
}
