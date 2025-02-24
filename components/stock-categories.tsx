import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, ChevronDown, TrendingUp } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Stock {
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface Category {
  category: string;
  description: string;
  stocks: Stock[];
}

const TradingPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch("/api/popular");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const StockCard = ({ stock }: { stock: Stock }) => (
    <Card className="min-w-[280px] hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{stock.name}</CardTitle>
            <p className="text-sm text-gray-500">NSE</p>
          </div>
          <TrendingUp
            className={`w-5 h-5 ${
              stock.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold">
              ${stock.price.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`flex items-center ${
                  stock.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stock.change >= 0 ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  ${Math.abs(stock.change).toLocaleString()}
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  stock.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ({stock.changePercent}%)
              </span>
            </div>
          </div>
          <div className="text-right">
            {/* <p className="text-sm text-gray-500">Volume</p> */}
            {/* <p className="font-medium">
              {(Math.random() * 1000000).toFixed(0).toLocaleString()}
            </p> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {[1, 2].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-4">
              {[1, 2, 3].map((_, j) => (
                <div
                  key={j}
                  className="w-[280px] h-[180px] bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {categories.map((category, index) => (
        <div key={index}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {category.category}
            </h2>
            <p className="text-gray-600">{category.description}</p>
          </div>

          <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex space-x-4 pb-4">
              {category.stocks.map((stock, stockIndex) => (
                <StockCard key={stockIndex} stock={stock} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}
    </div>
  );
};

export default TradingPage;