import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Library } from '@/lib/type';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  libraries: Library[];
}

const VisualComparison: React.FC<Props> = ({ libraries }) => {
  console.log("📊 Chart libraries input:", libraries);

  if (!libraries || libraries.length === 0) {
    return <p className="text-center text-gray-500">No data to show.</p>;
  }

  const labels = libraries.map((lib) => lib.name);
  const stars = libraries.map((lib) => Number(lib.stars ?? 0));
  const sizes = libraries.map((lib) =>
    parseFloat(lib.size?.replace(/[^0-9.]/g, '') || '0')
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'GitHub Stars',
        data: stars,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
      {
        label: 'Size (MB)',
        data: sizes,
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-md border shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Stars vs Size</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default VisualComparison;
