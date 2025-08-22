"use client";

interface LineChartProps {
  data: { label: string; value: number }[];
}

export default function LineChart({ data }: LineChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const minValue = Math.min(...data.map((item) => item.value));
  const range = maxValue - minValue;

  return (
    <>
      <style jsx>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="relative">
        <div className="relative p-6 h-72 rounded-2xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          <svg className="w-full h-full" viewBox="0 0 300 200">
            {/* Enhanced grid */}
            <defs>
              <pattern
                id="grid"
                width="30"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 20"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="300" height="200" fill="url(#grid)" />

            {/* Gradient area */}
            <path
              d={`M ${data
                .map((item, index) => {
                  const x = (index / (data.length - 1)) * 300;
                  const y = 200 - ((item.value - minValue) / range) * 180;
                  return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")} L 300 200 L 0 200 Z`}
              fill="url(#areaGradient)"
              opacity="0.4"
              className="filter drop-shadow-sm"
            />

            {/* Main line */}
            <path
              d={`M ${data
                .map((item, index) => {
                  const x = (index / (data.length - 1)) * 300;
                  const y = 200 - ((item.value - minValue) / range) * 180;
                  return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}`}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="filter drop-shadow-lg"
              style={{
                strokeDasharray: "1000",
                strokeDashoffset: "1000",
                animation: "drawLine 3s ease-out forwards",
              }}
            />

            {/* Enhanced data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 300;
              const y = 200 - ((item.value - minValue) / range) * 180;
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="white"
                    stroke="url(#pointGradient)"
                    strokeWidth="3"
                    className="transition-transform cursor-pointer filter drop-shadow-md hover:scale-110"
                    style={{
                      animation: `fadeInScale 0.8s ease-out ${
                        index * 0.2 + 1.5
                      }s both`,
                    }}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="url(#pointGradient)"
                    className="cursor-pointer"
                    style={{
                      animation: `fadeInScale 0.8s ease-out ${
                        index * 0.2 + 1.7
                      }s both`,
                    }}
                  />
                </g>
              );
            })}

            {/* Enhanced gradients */}
            <defs>
              <linearGradient
                id="areaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="rgb(168, 85, 247)"
                  stopOpacity="0.8"
                />
                <stop
                  offset="50%"
                  stopColor="rgb(59, 130, 246)"
                  stopOpacity="0.4"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(168, 85, 247)"
                  stopOpacity="0"
                />
              </linearGradient>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" />
              </linearGradient>
              <radialGradient id="pointGradient">
                <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                <stop offset="100%" stopColor="rgb(59, 130, 246)" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Enhanced labels */}
        <div className="flex justify-between px-2 mt-4">
          {data.map((item, index) => (
            <div key={index} className="text-center">
              <span className="px-2 py-1 text-xs font-medium text-gray-600 rounded-full bg-white/70">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
