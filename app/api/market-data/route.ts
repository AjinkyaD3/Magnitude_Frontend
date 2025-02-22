import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET() {
  try {
    const symbols = ["^NSEI", "^BSESN", "^GSPC", "^IXIC"];
    const marketData = await yahooFinance.quote(symbols);

    return NextResponse.json(marketData);
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
