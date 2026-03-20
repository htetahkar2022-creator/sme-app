import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FinanceRecord, InventoryItem } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Package, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard = () => {
  const [financeData, setFinanceData] = useState<FinanceRecord[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [financeRes, inventoryRes] = await Promise.all([
        supabase.from('finance').select('*').order('created_at', { ascending: true }),
        supabase.from('inventory').select('*')
      ]);

      if (financeRes.data) setFinanceData(financeRes.data);
      if (inventoryRes.data) setInventoryData(inventoryRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Process Finance Data for Bar Chart (Group by Date)
  const chartData = financeData.reduce((acc: any[], curr) => {
    const date = new Date(curr.created_at).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      if (curr.type === 'Income') existing.income += curr.amount;
      else existing.expense += curr.amount;
    } else {
      acc.push({
        date,
        income: curr.type === 'Income' ? curr.amount : 0,
        expense: curr.type === 'Expense' ? curr.amount : 0
      });
    }
    return acc;
  }, []).slice(-7); // Last 7 days

  // Process Inventory Data for Pie Chart
  const lowStockThreshold = 10;
  const lowStockItems = inventoryData.filter(item => item.stock <= lowStockThreshold).length;
  const healthyStockItems = inventoryData.length - lowStockItems;

  const pieData = [
    { name: 'Healthy Stock', value: healthyStockItems, color: '#10b981' },
    { name: 'Low Stock', value: lowStockItems, color: '#f43f5e' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  const totalIncome = financeData.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = financeData.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#151921] p-6 rounded-3xl border border-slate-200 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Income</p>
              <h4 className="text-2xl font-black dark:text-white text-slate-900">${totalIncome.toFixed(2)}</h4>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#151921] p-6 rounded-3xl border border-slate-200 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Expense</p>
              <h4 className="text-2xl font-black dark:text-white text-slate-900">${totalExpense.toFixed(2)}</h4>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#151921] p-6 rounded-3xl border border-slate-200 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Products</p>
              <h4 className="text-2xl font-black dark:text-white text-slate-900">{inventoryData.length}</h4>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-[#151921] p-6 rounded-3xl border border-slate-200 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Low Stock</p>
              <h4 className="text-2xl font-black dark:text-white text-slate-900">{lowStockItems}</h4>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-[#151921] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800/50 shadow-xl">
          <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-8">Income vs Expense (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151921', border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-[#151921] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800/50 shadow-xl">
          <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-8">Inventory Summary</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151921', border: 'none', borderRadius: '16px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
