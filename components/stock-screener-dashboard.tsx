"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, ShoppingCart, Settings, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TradingPage from "./stock-categories";

type StockData = {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
};

export default function StockScreenerDashboard() {
  const [marketIndices, setMarketIndices] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stock, setStock] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/market-data")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setMarketIndices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching market data:", error);
        setError("Failed to load market data.");
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (stock.trim() !== "") {
      router.push(`/prediction/${stock}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Stock Screener</h1>

          <div className="flex items-center gap-6">
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter stock symbol (e.g. AAPL)"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-72 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                  autoComplete="off"
                  spellCheck={false}
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!stock.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Predict
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <Settings className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Market Data Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {marketIndices.map((index) => (
              <Card
                key={index.symbol}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-700">
                      {index.symbol}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        index.regularMarketChangePercent >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {index.regularMarketChangePercent >= 0 ? "+" : ""}
                      {index.regularMarketChangePercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {index.regularMarketPrice.toLocaleString()}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      index.regularMarketChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {index.regularMarketChange >= 0 ? "+" : ""}
                    {index.regularMarketChange.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stock Categories */}
        <TradingPage />
      </div>
    </div>
  );
}
