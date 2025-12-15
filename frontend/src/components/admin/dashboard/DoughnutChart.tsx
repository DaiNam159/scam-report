"use client";

interface DoughnutChartProps {
  data: { label: string; value: number; color: string }[];
}

export default function DoughnutChart({ data }: DoughnutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const circumference = 2 * Math.PI * 35; // ~219.91

  // Pre-calculate cumulative percentages
  let cumulativePercent = 0;
  const segments = data.map((item) => {
    const percent = total > 0 ? (item.value / total) * 100 : 0;
    const segment = {
      ...item,
      percent,
      offset: cumulativePercent,
    };
    cumulativePercent += percent;
    return segment;
  });

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-56 h-56">
        <div className="absolute inset-0 rounded-full opacity-50 bg-gradient-to-br from-blue-50 to-purple-50"></div>
        <svg
          className="w-full h-full transform -rotate-90 drop-shadow-lg"
          viewBox="0 0 100 100"
        >
          {segments.map((segment, index) => {
            const strokeDasharray = `${
              (segment.percent * circumference) / 100
            } ${circumference}`;
            const strokeDashoffset = -((segment.offset * circumference) / 100);

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke={segment.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-4 text-center rounded-full shadow-lg bg-white/80 backdrop-blur-sm">
            <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {total}
            </p>
            <p className="text-xs font-medium text-gray-600">Tổng cộng</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-2 border rounded-full shadow-sm bg-white/70 backdrop-blur-sm border-white/50"
          >
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              {item.label}: {item.value} (
              {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
