import { filterStocksWithAI } from "./gemini";

// Mocked stock data (replace with API call to Yahoo Finance)
const stockData = [
  { name: "AAPL", cap: "Large", risk: "Low" },
  { name: "TSLA", cap: "Large", risk: "High" },
  { name: "NVDA", cap: "Mid", risk: "Medium" },
];

export async function getFilteredStocks(marketCap: string, riskLevel: string) {
  return await filterStocksWithAI(stockData, marketCap, riskLevel);
}
