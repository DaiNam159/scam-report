"use client";

import { FaArrowUp } from "react-icons/fa";
import { IconType } from "react-icons";

interface StatsCardProps {
  title: string;
  value: number;
  change: string;
  icon: IconType;
  gradient: string;
  bgGradient: string;
  changeColor: string;
  index: number;
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  gradient,
  bgGradient,
  changeColor,
  index,
}: StatsCardProps) {
  return (
    <div
      className={`group relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-white/50`}
    >
      <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-white/10 to-transparent group-hover:opacity-100"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {index === 3 && (
            <div className="w-3 h-3 rounded-full shadow-lg bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
          )}
        </div>
        <p className="mb-1 text-sm font-semibold text-gray-600">{title}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900">
          {value.toLocaleString()}
        </p>
        <div className="flex items-center gap-2">
          <FaArrowUp className={`w-3 h-3 ${changeColor}`} />
          <span className={`text-sm font-medium ${changeColor}`}>
            {change} {index < 2 && "hôm nay"}
          </span>
        </div>
      </div>
    </div>
  );
}
