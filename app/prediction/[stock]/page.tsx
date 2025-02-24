"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TradingViewChart from "@/components/LineChart";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

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
  const { stock } = useParams();
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://magnitudebackend.onrender.com/analyze?ticker=${encodeURIComponent(
          stock
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

  useEffect(() => {
    if (!stock) return;
    fetchPrediction();
  }, [stock]);

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
            Analyzing {stock?.toUpperCase()} data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={fetchPrediction}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-600 text-lg">No prediction data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">
              {prediction.ticker.toUpperCase()}
            </h1>
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <span className="text-slate-600">Analysis</span>
          </div>
          <button
            onClick={fetchPrediction}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* TradingView Chart Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-[600px]">
            <TradingViewChart
              stockSymbol={prediction.ticker.toUpperCase()}
              colorTheme="light"
              showVolume={true}
              chartType="candlestick"
            />
          </div>
        </div>

        {/* Prediction Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Analysis Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Market Analysis
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">
                  Predicted Movement
                </p>
                <div className="flex items-center gap-2 text-2xl font-bold">
                  {prediction.prediction.prediction.includes("Up") ? (
                    <ArrowUp className="w-8 h-8 text-green-600" />
                  ) : prediction.prediction.prediction.includes("Down") ? (
                    <ArrowDown className="w-8 h-8 text-red-600" />
                  ) : (
                    <TrendingUp className="w-8 h-8 text-yellow-600" />
                  )}

                  <span
                    className={
                      prediction.prediction.prediction.includes("Up")
                        ? "text-green-600"
                        : prediction.prediction.prediction.includes("Down")
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {prediction.prediction.prediction}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">
                  Market Sentiment
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {prediction.prediction.sentiment}
                </p>
              </div>
            </div>
          </div>

          {/* News Feed */}
          <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
  Recent News
  <span className="flex items-center gap-2 text-sm">
    <span className="flex items-center gap-1">
      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
      <span className="text-slate-600">Negative</span>
    </span>
    <span className="flex items-center gap-1">
      <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
      <span className="text-slate-600">Neutral</span>
    </span>
    <span className="flex items-center gap-1">
      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
      <span className="text-slate-600">Positive</span>
    </span>
  </span>
</h2>


            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {prediction.news.length > 0 ? (
                prediction.news.map((article, index) => (
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
                  <p className="text-slate-600">No recent news available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;
