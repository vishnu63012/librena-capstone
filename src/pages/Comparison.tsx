import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Library } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import type { ChartOptions } from "chart.js";

Chart.register(ChartDataLabels);

const Comparison = () => {
  const navigate = useNavigate();
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [activeChart, setActiveChart] = useState<"bar" | "pie" | "doughnut" | null>("bar");
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("comparedLibraries");
    if (saved) setLibraries(JSON.parse(saved));
  }, []);

  const exportAsImage = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
    pdf.save("chart-comparison.pdf");
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (val: number) => val.toLocaleString(),
        font: { weight: "bold" },
        color: "#000",
      },
      legend: {
        position: "top",
      },
    },
  };

  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (val: number) => val.toLocaleString(),
        color: "#000",
      },
      legend: {
        position: "top",
      },
    },
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (val: number) => val.toLocaleString(),
        color: "#000",
      },
      legend: {
        position: "top",
      },
    },
  };

  const barData = {
    labels: libraries.map((lib) => lib.name),
    datasets: [
      {
        label: "Stars",
        data: libraries.map((lib) => parseInt(lib.stars || "0")),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Size (MB)",
        data: libraries.map((lib) => {
          const size = parseFloat(lib.size?.replace("MB", "") || "0");
          return size < 1 ? 0.5 : size; 
        }),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: libraries.map((lib) => lib.name),
    datasets: [
      {
        label: "Size",
        data: libraries.map((lib) => parseFloat(lib.size?.replace("MB", "") || "0")),
        backgroundColor: libraries.map((_, i) =>
          `hsl(${(i * 60) % 360}, 70%, 60%)`
        ),
      },
    ],
  };

  const doughnutData = {
    labels: libraries.map((lib) => lib.name),
    datasets: [
      {
        label: "Stars",
        data: libraries.map((lib) => parseInt(lib.stars || "0")),
        backgroundColor: libraries.map((_, i) =>
          `hsl(${(i * 60) % 360}, 70%, 60%)`
        ),
      },
    ],
  };

  const fields: (keyof Library)[] = [
    "name",
    "description",
    "category",
    "license",
    "cost",
    "size",
    "stars",
    "tags",
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">Library Comparison</h1>

        {/* 📊 Table */}
       {/* 📊 Card-Based Comparison Layout */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
  {libraries.map((lib) => (
    <div key={lib.id} className="bg-white border rounded-lg shadow p-6 space-y-3">
      <h2 className="text-xl font-bold text-blue-600">{lib.name}</h2>
      <div><strong>Description:</strong> {lib.description}</div>
      <div><strong>Category:</strong> {lib.category}</div>
      <div><strong>License:</strong> {lib.license}</div>
      <div><strong>Cost:</strong> {lib.cost}</div>
      <div><strong>Size:</strong> {lib.size}</div>
      <div><strong>Stars:</strong> {lib.stars}</div>
      <div><strong>Tags:</strong> {Array.isArray(lib.tags) ? lib.tags.join(', ') : lib.tags}</div>
    </div>
  ))}
</div>


        {/* 🎛️ Chart Toggle */}
        <div className="flex gap-4 mb-6">
          <Button onClick={() => setActiveChart("bar")} variant={activeChart === "bar" ? "default" : "outline"}>
            Bar
          </Button>
          <Button onClick={() => setActiveChart("pie")} variant={activeChart === "pie" ? "default" : "outline"}>
            Pie
          </Button>
          <Button onClick={() => setActiveChart("doughnut")} variant={activeChart === "doughnut" ? "default" : "outline"}>
            Doughnut
          </Button>
        </div>

        {/* 📈 Chart View */}
        <div ref={chartRef} className="bg-white rounded shadow p-6 max-w-4xl mx-auto">
          {activeChart === "bar" && (
            <>
              <h3 className="text-lg font-semibold mb-2">Stars + Size Comparison</h3>
              <Bar data={barData} options={barOptions} />
              <Button onClick={exportAsImage} className="mt-4">
                <Download className="w-4 h-4 mr-2" /> Export PNG
              </Button>
            </>
          )}
          {activeChart === "pie" && (
            <>
              <h3 className="text-lg font-semibold mb-2">Size Distribution</h3>
              <Pie data={pieData} options={pieOptions} />
              <Button onClick={exportAsImage} className="mt-4">
                <Download className="w-4 h-4 mr-2" /> Export PNG
              </Button>
            </>
          )}
          {activeChart === "doughnut" && (
            <>
              <h3 className="text-lg font-semibold mb-2">Stars Distribution</h3>
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <Button onClick={exportAsImage} className="mt-4">
                <Download className="w-4 h-4 mr-2" /> Export PNG
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comparison;
