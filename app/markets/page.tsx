"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Loader2,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type MarketIndex = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string | number;
  volume: string | number;
  assetClass: string;
  chartData?: { value: number }[]; // Add chartData for sparkline
};

// Sparkline Component
const Sparkline = ({ data }: { data: { value: number }[] }) => {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default function MarketsOverview() {
  const [marketData, setMarketData] = useState<Record<string, MarketIndex[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/Markets");
      if (!response.ok) {
        throw new Error("Failed to fetch market data");
      }
      const data = await response.json();
      console.log("API Response:", data); // Debugging

      // Ensure `data` is in the correct format
      if (typeof data !== "object" || !data.Stocks) {
        throw new Error(
          "Invalid API response: Expected grouped data by asset class"
        );
      }

      // Add mock chart data for demonstration
      const dataWithChart = Object.entries(data).reduce(
        (acc, [assetClass, indices]) => {
          if (!Array.isArray(indices)) {
            return acc; // Ensure indices is an array
          }
          
          acc[assetClass as keyof typeof acc] = indices.map((item) => ({
            ...item,
            chartData: generateMockChartData(), // Add mock chart data
          }));
      
          return acc;
        },
        {} as Record<string, MarketIndex[]>
      );
      

      setMarketData(dataWithChart);
    } catch (error) {
      console.error("Error fetching market data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load market data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Generate mock chart data for demonstration
  const generateMockChartData = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      value: Math.random() * 100, // Random data for the sparkline
    }));
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatMarketCap = (marketCap: string | number) => {
    if (typeof marketCap === "string") {
      return marketCap; // Return as-is if it's already formatted
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(marketCap);
  };

  const formatVolume = (volume: string | number) => {
    if (typeof volume === "string") {
      return volume; // Return as-is if it's already formatted
    }
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(volume);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-gray-600">Loading market data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Markets Overview
          </h1>
          <div className="flex items-center text-blue-600 hover:text-blue-700 cursor-pointer">
            {/* <span className="text-lg">World Indices</span> */}
            {/* <ChevronRight className="w-5 h-5" /> */}
          </div>
        </div>

        {Object.entries(marketData).map(([assetClass, indices]) => (
          <div key={assetClass} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {assetClass}
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-12 text-sm font-medium text-gray-500 p-3 border-b">
                  <div className="col-span-2">Symbol</div>
                  <div className="col-span-2">Name</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Change</div>
                  <div className="col-span-2 text-right">Change %</div>
                  <div className="col-span-2 text-right">Graph</div>
                </div>

                {indices.map((item, index) => (
                  <div
                    key={item.symbol}
                    className={`grid grid-cols-12 items-center p-3 hover:bg-gray-50 ${
                      index !== indices.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="col-span-2 font-medium text-blue-600">
                      {item.symbol}
                    </div>
                    <div className="col-span-2 text-gray-700">{item.name}</div>
                    <div className="col-span-2 text-right font-mono">
                      {formatNumber(item.price)}
                    </div>
                    <div className="col-span-2 text-right font-mono">
                      {formatNumber(item.change)}
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      {item.changePercent > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`font-medium ${
                          item.changePercent > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.changePercent > 0 ? "+" : ""}
                        {formatNumber(item.changePercent)}%
                      </span>
                    </div>
                    <div className="col-span-2 pl-4"> {/* Added padding here */}
                      <Sparkline data={item.chartData || []} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}