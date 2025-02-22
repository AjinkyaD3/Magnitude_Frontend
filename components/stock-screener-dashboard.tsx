import React, { useState, useEffect } from 'react';
import { Search, Bell, ShoppingCart, Settings, ChevronDown, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const StockScreenerDashboard = () => {
  const [marketIndices, setMarketIndices] = useState([
    { name: 'NIFTY', value: '22,795.90', change: '0.00', changePercent: '0.00' },
    { name: 'SENSEX', value: '75,311.06', change: '0.00', changePercent: '0.00' },
    { name: 'S&P 500', value: '6,013.13', change: '-104.39', changePercent: '-1.71' },
    { name: 'Nasdaq', value: '19,524.01', change: '-438.36', changePercent: '-2.20' }
  ]);

  const [mostTraded, setMostTraded] = useState([
    { name: 'Godrej Industries', price: '1,131.50', change: '119.75', changePercent: '11.84' },
    { name: 'Godfrey Phillips', price: '5,786.35', change: '-180.25', changePercent: '-3.02' },
    { name: 'JSW Energy', price: '496.60', change: '28.05', changePercent: '5.99' },
    { name: 'Rail Vikas Nigam', price: '371.70', change: '-9.85', changePercent: '-2.58' }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <div className="text-2xl font-bold">Stock Screener</div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Stocks</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Mutual Funds</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">F&O</button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search stocks..."
              className="w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
          <Bell className="w-6 h-6 text-gray-600" />
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          <Settings className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {marketIndices.map((index) => (
          <Card key={index.name}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-600">{index.name}</div>
                <div className={`text-sm ${parseFloat(index.changePercent) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {index.changePercent}%
                </div>
              </div>
              <div className="text-xl font-bold mt-1">{index.value}</div>
              <div className={`text-sm ${parseFloat(index.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {parseFloat(index.change) >= 0 ? '+' : ''}{index.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Screener Categories */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Active Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostTraded.map((stock) => (
                <div key={stock.name} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{stock.name}</div>
                    <div className="text-sm text-gray-500">₹{stock.price}</div>
                  </div>
                  <div className={`text-sm ${parseFloat(stock.changePercent) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {parseFloat(stock.changePercent) >= 0 ? '+' : ''}{stock.changePercent}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Undervalued Growth Stocks</div>
                <div className="text-sm text-gray-500">Stocks with earnings growth rates better than 25% and low PE ratios</div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Day Gainer Stocks</div>
                <div className="text-sm text-gray-500">Discover the equities with the greatest gains in the trading day</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Screener Button */}
      <div className="flex justify-center">
        <button className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Create Custom Screener</span>
        </button>
      </div>
    </div>
  );
};

export default StockScreenerDashboard;
