import { useState } from "react";

interface StockFilterProps {
  onFilter: (marketCap: string, riskLevel: string) => void;
}

export default function StockFilter({ onFilter }: StockFilterProps) {
  const [marketCap, setMarketCap] = useState("Large");
  const [riskLevel, setRiskLevel] = useState("Low");

  return (
    <div className="flex gap-4">
      <select
        value={marketCap}
        onChange={(e) => setMarketCap(e.target.value)}
        className="p-2 border rounded"
      >
        <option>Large</option>
        <option>Mid</option>
        <option>Small</option>
      </select>
      <select
        value={riskLevel}
        onChange={(e) => setRiskLevel(e.target.value)}
        className="p-2 border rounded"
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button
        onClick={() => onFilter(marketCap, riskLevel)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Filter
      </button>
    </div>
  );
}
