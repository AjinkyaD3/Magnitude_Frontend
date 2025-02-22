import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET() {
  try {
    // Fetch trending stock symbols dynamically for US
    const trendingData = await yahooFinance.trendingSymbols("US");
    const stockSymbols = trendingData.quotes.map((stock) => stock.symbol).slice(0, 10); // Limit to 10 stocks

    // Fetch stock data for trending symbols
    const stockData = await Promise.all(
      stockSymbols.map(async (symbol) => {
        const quote = await yahooFinance.quote(symbol);
        console.log(quote); // Debugging: Check available fields
    
        return {
          symbol: quote.symbol,
          name: quote.shortName,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          volume: quote.regularMarketVolume,
          fiftyTwoWeekChange: quote.fiftyTwoWeekLowChange ?? 0,  // Alternative property
          fiftyTwoWeekChangePercent: quote.fiftyTwoWeekLowChangePercent ?? 0, // Alternative property
        };
      })
    );
    

    // Categorize stock data dynamically
    const stockCategories = [
      {
        category: "Trending Now",
        description: "Stocks that are currently trending in the market.",
        stocks: stockData.slice(0, 5),
      },
      {
        category: "Most Active Stocks",
        description: "Discover the most traded equities in the trading day.",
        stocks: stockData.sort((a, b) => b.volume - a.volume).slice(0, 5),
      },
      {
        category: "Day Gainer Stocks",
        description: "Discover the equities with the greatest gains today.",
        stocks: stockData.sort((a, b) => b.changePercent - a.changePercent).slice(0, 5),
      },
      {
        category: "Day Loser Stocks",
        description: "Discover the equities with the greatest losses today.",
        stocks: stockData.sort((a, b) => a.changePercent - b.changePercent).slice(0, 5),
      },
      {
        category: "52-Week Gainers",
        description: "Stocks with the highest gains over the past year.",
        stocks: stockData
          .filter((stock) => stock.fiftyTwoWeekChangePercent !== undefined)
          .sort((a, b) => b.fiftyTwoWeekChangePercent - a.fiftyTwoWeekChangePercent)
          .slice(0, 5),
      },
    ];

    console.log(stockCategories);
    return NextResponse.json(stockCategories);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
