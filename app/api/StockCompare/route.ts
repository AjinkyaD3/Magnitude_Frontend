import { NextResponse,NextRequest} from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(request:NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  try {
    const quote = await yahooFinance.quote(symbol);
    const historicalData = await yahooFinance.historical(symbol, {
      period1: "2022-01-01",
      period2: new Date().toISOString().split("T")[0],
      interval: "1d",
    });

    const chartData = historicalData.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      price: item.close,
    }));

    return NextResponse.json({
      symbol: quote.symbol,
      name: quote.shortName || quote.longName,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      volume: quote.regularMarketVolume,
      chartData,
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}