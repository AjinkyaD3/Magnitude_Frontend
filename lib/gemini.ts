import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyDjZPdyrxHbhXE8AWdUDhNYlRE783rlT3E');

export async function filterStocksWithAI(stockData: any[], marketCap: string, riskLevel: string) {
  const prompt = `
    Filter the following stocks based on user preference:
    User wants ${marketCap} cap stocks with ${riskLevel} risk.
    Stocks: ${JSON.stringify(stockData)}
    Return only the matching stocks as a JSON array.
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const response = await model.generateContent(prompt);

  return JSON.parse(response.text());
}
