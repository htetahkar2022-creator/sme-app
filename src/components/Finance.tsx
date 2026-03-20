import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FinanceRecord } from '../types';
import { TrendingUp, TrendingDown, Wallet, Plus, Trash2, Loader2, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Finance = () => {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({ type: 'Income' as 'Income' | 'Expense', amount: '', description: '' });

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('finance')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setRecords(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    const { error } = await supabase
      .from('finance')
      .insert([{ 
        type: newRecord.type, 
        amount: parseFloat(newRecord.amount), 
        description: newRecord.description 
      }]);

    if (error) {
      alert(error.message);
    } else {
      setNewRecord({ type: 'Income', amount: '', description: '' });
      fetchRecords();
    }
    setAdding(false);
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const { error } = await supabase
      .from('finance')
      .delete()
      .eq('id', id);

    if (error) alert(error.message);
    else fetchRecords();
  };

  const totalIncome = records.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Finance</h2>
        <p className="text-slate-500">Track your income, expenses, and overall balance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Income</p>
            <h4 className="text-2xl font-black text-slate-900">${totalIncome.toFixed(2)}</h4>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
            <TrendingDown className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Expense</p>
            <h4 className="text-2xl font-black text-slate-900">${totalExpense.toFixed(2)}</h4>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-200 flex items-center gap-4 text-white"
        >
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Net Balance</p>
            <h4 className="text-2xl font-black">${netBalance.toFixed(2)}</h4>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Add Record Form */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Add Transaction</h3>
            </div>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setNewRecord(prev => ({ ...prev, type: 'Income' }))}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${newRecord.type === 'Income' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    Income
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewRecord(prev => ({ ...prev, type: 'Expense' }))}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${newRecord.type === 'Expense' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    Expense
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={newRecord.amount}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Description</label>
                <textarea 
                  required
                  value={newRecord.description}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-24 resize-none"
                  placeholder="What was this for?"
                />
              </div>
              <button 
                type="submit" 
                disabled={adding}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Save Transaction
              </button>
            </form>
          </div>
        </div>

        {/* Transaction History */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Transaction History</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                </div>
              ) : records.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No transactions recorded yet
                </div>
              ) : (
                records.map((record) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={record.id} 
                    className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${record.type === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {record.type === 'Income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{record.description}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{new Date(record.created_at).toLocaleDateString()} • {new Date(record.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`text-lg font-black ${record.type === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {record.type === 'Income' ? '+' : '-'}${record.amount.toFixed(2)}
                      </span>
                      <button 
                        onClick={() => handleDeleteRecord(record.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
