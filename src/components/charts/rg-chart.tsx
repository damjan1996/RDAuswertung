'use client';

import { Chart, ChartData, ChartOptions, ChartType, registerables } from 'chart.js';
import React, { useEffect, useRef } from 'react';

// Register all Chart.js components we might need
Chart.register(...registerables);

interface RgChartProps {
  data: Record<string, number>;
  height?: number;
  className?: string;
}

export default function RgChart({ data, height = 300, className = '' }: RgChartProps) {
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

    // Prepare the data for the chart
    const labels = Object.keys(data);
    const values = Object.values(data);

    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: 'Wert pro Monat',
          data: values,
          backgroundColor: 'rgba(240, 140, 0, 0.7)',
          borderColor: 'rgba(217, 126, 0, 1)',
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
          display: true,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed.y as number;
              return `${value.toFixed(2)} €`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: 'Reinigungsgruppe',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Wert pro Monat (€)',
          },
          ticks: {
            callback: function (value) {
              return value + ' €';
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
          type: 'bar' as ChartType,
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
