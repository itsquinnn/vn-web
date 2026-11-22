'use client';

import React from 'react';

export interface WeatherData {
  region: string;
  temp: string;
  status: string;
  alert: string;
}

export interface WeatherTelemetryProps {
  rightCollapsed: boolean;
  weather: WeatherData;
}

export default function WeatherTelemetry({ rightCollapsed, weather }: WeatherTelemetryProps) {
  if (rightCollapsed) {
    return (
      <div className="flex justify-center text-lg py-2 text-[#0552A2]" title={weather.region}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] leading-snug">
            {weather.region}
          </h4>
          <span className="text-xs text-slate-500 block mt-0.5">{weather.status}</span>
        </div>
        <div className="text-right shrink-0">
          <span className="font-[family-name:var(--font-quicksand)] text-xl font-bold tracking-tight text-[#0552A2] leading-none block">
            {weather.temp}
          </span>
        </div>
      </div>
    </div>
  );
}
