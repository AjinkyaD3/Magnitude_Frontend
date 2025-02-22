import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET() {
  try {
    // Fetch data for different asset classes
    const [stocks, commodities, currencies, bonds, cryptocurrencies] =
      await Promise.all([
        fetchStockData(),
        fetchCommoditiesData(),
        fetchCurrenciesData(),
        fetchBondsData(),
        fetchCryptocurrencyData(),
      ]);

    // Group all data into a single response
    const groupedData = {
      Stocks: stocks,
      Commodities: commodities,
      Currencies: currencies,
      Bonds: bonds,
      Cryptocurrencies: cryptocurrencies,
    };

    console.log("Grouped Data:", groupedData); // Debugging: Check the final grouped data
    return NextResponse.json(groupedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 }
    );
  }
}

// Fetch stock data
const fetchStockData = async () => {
  try {
    const trendingData = await yahooFinance.trendingSymbols("US");
    const stockSymbols = trendingData.quotes
      .map((stock) => stock.symbol)
      .slice(0, 10); // Limit to 10 stocks

    const stockData = await Promise.all(
      stockSymbols.map(async (symbol) => {
        try {
          const quote = await yahooFinance.quote(symbol);
          console.log("Stock Quote for", symbol, ":", quote); // Debugging

          return {
            symbol: quote.symbol,
            name: quote.shortName || quote.longName,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            marketCap: quote.marketCap,
            volume: quote.regularMarketVolume,
            assetClass: "Stocks",
          };
        } catch (error) {
          console.error(`Error fetching stock quote for ${symbol}:`, error);
          return null;
        }
      })
    );

    return stockData.filter((stock) => stock !== null);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }
};

// Fetch commodities data
const fetchCommoditiesData = async () => {
  const commoditySymbols = [
    "CL=F", // Crude Oil
    "GC=F", // Gold
    "SI=F", // Silver
    "HG=F", // Copper
    "NG=F", // Natural Gas
    "BZ=F", // Brent Crude
  ];

  const commodityData = await Promise.all(
    commoditySymbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        console.log("Commodity Quote for", symbol, ":", quote); // Debugging

        return {
          symbol: quote.symbol,
          name: quote.shortName || quote.longName,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          marketCap: quote.marketCap,
          volume: quote.regularMarketVolume,
          assetClass: "Commodities",
        };
      } catch (error) {
        console.error(`Error fetching commodity quote for ${symbol}:`, error);
        return null;
      }
    })
  );

  return commodityData.filter((commodity) => commodity !== null);
};

// Fetch currencies data
const fetchCurrenciesData = async () => {
  const currencySymbols = [
    "EURUSD=X", // EUR/USD
    "JPY=X", // USD/JPY
    "GBPUSD=X", // GBP/USD
    "AUDUSD=X", // AUD/USD
    "CADUSD=X", // CAD/USD
    "MXNUSD=X", // MXN/USD
  ];

  const currencyData = await Promise.all(
    currencySymbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        console.log("Currency Quote for", symbol, ":", quote); // Debugging

        return {
          symbol: quote.symbol,
          name: quote.shortName || quote.longName,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          marketCap: quote.marketCap,
          volume: quote.regularMarketVolume,
          assetClass: "Currencies",
        };
      } catch (error) {
        console.error(`Error fetching currency quote for ${symbol}:`, error);
        return null;
      }
    })
  );

  return currencyData.filter((currency) => currency !== null);
};

// Fetch bonds data
const fetchBondsData = async () => {
  const bondSymbols = [
    "^IRX", // 13-Week Treasury Bill
    "^FVX", // 5-Year Treasury Yield
    "^TNX", // 10-Year Treasury Yield
    "^TYX", // 30-Year Treasury Yield
    "ZT=F", // 2-Year Treasury Note Futures
    "ZN=F", // 10-Year Treasury Note Futures
  ];

  const bondData = await Promise.all(
    bondSymbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        console.log("Bond Quote for", symbol, ":", quote); // Debugging

        return {
          symbol: quote.symbol,
          name: quote.shortName || quote.longName,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          marketCap: quote.marketCap,
          volume: quote.regularMarketVolume,
          assetClass: "Bonds",
        };
      } catch (error) {
        console.error(`Error fetching bond quote for ${symbol}:`, error);
        return null;
      }
    })
  );

  return bondData.filter((bond) => bond !== null);
};

// Fetch cryptocurrency data
const fetchCryptocurrencyData = async () => {
  const cryptoSymbols = [
    "BTC-USD", // Bitcoin
    "ETH-USD", // Ethereum
    "XRP-USD", // XRP
    "USDT-USD", // Tether
    "BNB-USD", // BNB
    "SOL-USD", // Solana
    "USDC-USD", // USD Coin
    "DOGE-USD", // Dogecoin
  ];

  const cryptoData = await Promise.all(
    cryptoSymbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        console.log("Crypto Quote for", symbol, ":", quote); // Debugging

        return {
          symbol: quote.symbol,
          name: quote.shortName || quote.longName,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          marketCap: quote.marketCap,
          volume: quote.regularMarketVolume,
          assetClass: "Cryptocurrencies",
        };
      } catch (error) {
        console.error(`Error fetching crypto quote for ${symbol}:`, error);
        return null;
      }
    })
  );

  return cryptoData.filter((crypto) => crypto !== null);
};