import type { NextApiRequest, NextApiResponse } from "next";
import { getFilteredStocks } from "@/lib/stockService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { marketCap, riskLevel } = req.body;
    const filteredStocks = await getFilteredStocks(marketCap, riskLevel);
    res.status(200).json({ filteredStocks });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
