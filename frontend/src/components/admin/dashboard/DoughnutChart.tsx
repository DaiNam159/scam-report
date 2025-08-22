"use client";

interface DoughnutChartProps {
  data: { label: string; value: number; color: string }[];
}

export default function DoughnutChart({ data }: DoughnutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <>
      <style jsx>{`
        @keyframes drawChart {
          from {
            stroke-dashoffset: 219.9;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <div className="relative flex flex-col items-center">
        <div className="relative w-56 h-56">
          <div className="absolute inset-0 rounded-full opacity-50 bg-gradient-to-br from-blue-50 to-purple-50"></div>
          <svg
            className="w-full h-full transform -rotate-90 drop-shadow-lg"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="10"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${(percentage * 219.9) / 100} 219.9`;
              const strokeDashoffset = -((cumulativePercentage * 219.9) / 100);
              cumulativePercentage += percentage;

              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all ease-out duration-1500 filter drop-shadow-sm"
                  style={{
                    animation: `drawChart 2s ease-out ${index * 0.3}s both`,
                  }}
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
                {((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
