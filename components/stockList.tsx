interface StockListProps {
  stocks: { name: string; cap: string; risk: string }[];
}

export default function StockList({ stocks }: StockListProps) {
  return (
    <div className="mt-6">
      {stocks.length > 0 ? (
        <ul className="space-y-2">
          {stocks.map((stock) => (
            <li key={stock.name} className="p-3 bg-gray-100 rounded">
              {stock.name} - {stock.cap} Cap - {stock.risk} Risk
            </li>
          ))}
        </ul>
      ) : (
        <p>No stocks found.</p>
      )}
    </div>
  );
}
