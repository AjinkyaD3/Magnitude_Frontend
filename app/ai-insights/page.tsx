"use client";

import { useState } from "react";
import StockFilter from "@/components/filterStock";
import StockList from "@/components/stockList";

interface Stock {
  ticker: string;
  name: string;
  price: number;
  marketCap: string;
  riskLevel: string;
}

export default function StockFilterPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilteredStocks = async (marketCap: string, riskLevel: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/filter-stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketCap, riskLevel }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stocks");
      }

      const data = await response.json();
      setStocks(data.filteredStocks || []);
    } catch (err) {
      setError("Error fetching stocks. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Stock Market AI Filter
      </h1>

      <StockFilter onFilter={fetchFilteredStocks} />

      {loading && <p className="text-blue-600 mt-4">Fetching stocks...</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      <StockList stocks={stocks} />
    </div>
  );
}
