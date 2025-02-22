"use client";

import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  stockSymbol: string;
  colorTheme?: "light" | "dark";
  showVolume?: boolean;
  chartType?: "candlestick" | "line" | "area";
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  stockSymbol,
  colorTheme = "light",
  showVolume = true,
  chartType = "candlestick",
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !stockSymbol) return;

    chartContainerRef.current.innerHTML = ""; // Clear previous widget

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: stockSymbol,
      theme: colorTheme,
      autosize: true,
      hide_side_toolbar: false,
      style: chartType === "candlestick" ? 1 : chartType === "line" ? 0 : 3,
      interval: "D", // 1-day interval
      show_volume: showVolume,
      allow_symbol_change: true,
      studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
    });

    chartContainerRef.current.appendChild(script);
  }, [stockSymbol, colorTheme, showVolume, chartType]);

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {stockSymbol.toUpperCase()} Stock Chart
      </h2>
      <div ref={chartContainerRef} className="w-full h-[500px]" />
    </div>
  );
};

export default TradingViewChart;
