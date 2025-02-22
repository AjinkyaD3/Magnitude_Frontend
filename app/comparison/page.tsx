"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Search,
} from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import TradingViewChart from "@/components/LineChart";

interface NewsArticle {
  datetime: string;
  sentiment_score: number;
  title: string;
}

interface PredictionData {
  average_sentiment: number;
  news: NewsArticle[];
  prediction: {
    prediction: string;
    sentiment: string;
  };
  ticker: string;
}

const PredictionPage = () => {
  const [stockSymbol1, setStockSymbol1] = useState("");
  const [stockSymbol2, setStockSymbol2] = useState("");
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [prediction1, setPrediction1] = useState<PredictionData | null>(null);
  const [prediction2, setPrediction2] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async (
    symbol: string,
    setPrediction: (data: PredictionData) => void
  ) => {
    if (!symbol) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://magnitudebackend.onrender.com/analyze?ticker=${encodeURIComponent(
          symbol
        )}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: PredictionData = await response.json();
      setPrediction(data);
    } catch (error) {
      setError("Failed to fetch prediction data. Please try again.");
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue1.trim() && inputValue2.trim()) {
      fetchPrediction(inputValue1.trim().toUpperCase(), setPrediction1);
      fetchPrediction(inputValue2.trim().toUpperCase(), setPrediction2);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.5) return "text-green-600 bg-green-50";
    if (score < -0.5) return "text-red-600 bg-red-50";
    return "text-yellow-600 bg-yellow-50";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">
            Analyzing {stockSymbol1} and {stockSymbol2} data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Search Form */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={inputValue1}
                  onChange={(e) => setInputValue1(e.target.value)}
                  placeholder="Enter first stock symbol (e.g., AAPL)"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={inputValue2}
                  onChange={(e) => setInputValue2(e.target.value)}
                  placeholder="Enter second stock symbol (e.g., TSLA)"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              Compare
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {error ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-red-600">{error}</p>
            <button
              onClick={() => {
                fetchPrediction(stockSymbol1, setPrediction1);
                fetchPrediction(stockSymbol2, setPrediction2);
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !prediction1 && !prediction2 && !loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg text-slate-600">
              Enter two stock symbols above to begin comparison
            </p>
          </div>
        ) : prediction1 || prediction2 ? (
          <>
            {/* TradingView Charts Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {prediction1 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="h-[400px]">
                    <TradingViewChart
                      stockSymbol={prediction1.ticker.toUpperCase()}
                      colorTheme="light"
                      showVolume={true}
                      chartType="candlestick"
                    />
                  </div>
                </div>
              )}
              {prediction2 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="h-[400px]">
                    <TradingViewChart
                      stockSymbol={prediction2.ticker.toUpperCase()}
                      colorTheme="light"
                      showVolume={true}
                      chartType="candlestick"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Prediction Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Analysis Summary for Stock 1 */}
              {prediction1 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {prediction1.ticker.toUpperCase()} Analysis
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">
                        Predicted Movement
                      </p>
                      <div className="flex items-center gap-2 text-2xl font-bold">
                        {prediction1.prediction.prediction.includes("Up") ? (
                          <ArrowUp className="w-8 h-8 text-green-600" />
                        ) : prediction1.prediction.prediction.includes(
                            "Down"
                          ) ? (
                          <ArrowDown className="w-8 h-8 text-red-600" />
                        ) : (
                          <TrendingUp className="w-8 h-8 text-yellow-600" />
                        )}
                        <span
                          className={
                            prediction1.prediction.prediction.includes("Up")
                              ? "text-green-600"
                              : prediction1.prediction.prediction.includes(
                                  "Down"
                                )
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
                        >
                          {prediction1.prediction.prediction}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">
                        Market Sentiment
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {prediction1.prediction.sentiment}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Summary for Stock 2 */}
              {prediction2 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {prediction2.ticker.toUpperCase()} Analysis
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">
                        Predicted Movement
                      </p>
                      <div className="flex items-center gap-2 text-2xl font-bold">
                        {prediction2.prediction.prediction.includes("Up") ? (
                          <ArrowUp className="w-8 h-8 text-green-600" />
                        ) : prediction2.prediction.prediction.includes(
                            "Down"
                          ) ? (
                          <ArrowDown className="w-8 h-8 text-red-600" />
                        ) : (
                          <TrendingUp className="w-8 h-8 text-yellow-600" />
                        )}
                        <span
                          className={
                            prediction2.prediction.prediction.includes("Up")
                              ? "text-green-600"
                              : prediction2.prediction.prediction.includes(
                                  "Down"
                                )
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
                        >
                          {prediction2.prediction.prediction}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">
                        Market Sentiment
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {prediction2.prediction.sentiment}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* News Feed Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {prediction1 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-6">
                    Recent News for {prediction1.ticker.toUpperCase()}
                  </h2>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {prediction1.news.length > 0 ? (
                      prediction1.news.map((article, index) => (
                        <div
                          key={index}
                          className="group hover:bg-slate-50 p-4 rounded-lg transition-colors border border-slate-100"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <p className="text-sm text-slate-500">
                                {formatDate(article.datetime)}
                              </p>
                              <p className="text-base font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                                {article.title === "No Title"
                                  ? "Unnamed News Article"
                                  : article.title}
                              </p>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                                article.sentiment_score
                              )}`}
                            >
                              {(article.sentiment_score * 100).toFixed(1)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600">
                          No recent news available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {prediction2 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-6">
                    Recent News for {prediction2.ticker.toUpperCase()}
                  </h2>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {prediction2.news.length > 0 ? (
                      prediction2.news.map((article, index) => (
                        <div
                          key={index}
                          className="group hover:bg-slate-50 p-4 rounded-lg transition-colors border border-slate-100"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <p className="text-sm text-slate-500">
                                {formatDate(article.datetime)}
                              </p>
                              <p className="text-base font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                                {article.title === "No Title"
                                  ? "Unnamed News Article"
                                  : article.title}
                              </p>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                                article.sentiment_score
                              )}`}
                            >
                              {(article.sentiment_score * 100).toFixed(1)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600">
                          No recent news available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PredictionPage;
