// frontend/src/components/admin/MarketChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', price: 1200000 },
  { month: 'Feb', price: 1250000 },
  { month: 'Mar', price: 1320000 },
  { month: 'Apr', price: 1290000 },
];

export default function MarketChart() {
  return (
    <div className="h-64 w-full bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100">
      <h3 className="text-lg font-bold mb-4">Market Valuation Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
          <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}