"use client";

interface BarChartProps {
  data: {
    label: string;
    date: string;
    day: string;
    month: string;
    year: string;
    value: number;
  }[];
}

export default function BarChart({ data }: BarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="p-4 space-y-4">
      {data.map((item, index) => (
        <div key={index} className="group">
          <div className="flex items-center justify-between mb-1">
            <span className="flex w-full text-sm font-medium text-gray-700">
              <span className="w-1_toggle"></span>
              <span className="w-1/2">{item.label}</span>
              <span className="w-1/2 text-right">
                {item.day}/{item.month}/{item.year}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Bar */}
            <div className="relative flex-1 h-4 overflow-hidden rounded-full shadow-inner bg-gradient-to-r from-gray-100 to-gray-200">
              <div
                className="relative h-full overflow-hidden transition-all ease-out rounded-full shadow-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 duration-1500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>

            {/* Value */}
            <span className="text-sm font-bold text-right text-gray-900">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
