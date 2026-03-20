import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FinanceRecord } from '../types';
import { TrendingUp, TrendingDown, Wallet, Plus, Trash2, Loader2, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export const Finance = () => {
  const { t } = useLanguage();
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
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('User not authenticated');
      setAdding(false);
      return;
    }

    const { error } = await supabase
      .from('finance')
      .insert([{ 
        type: newRecord.type, 
        amount: parseFloat(newRecord.amount), 
        description: newRecord.description,
        user_id: user.id
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{t('finance')}</h2>
        <p className="text-slate-400">Track your income, expenses, and overall balance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#151921] p-8 rounded-[32px] border border-slate-800/50 shadow-xl flex items-center gap-6"
        >
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('income')}</p>
            <h4 className="text-3xl font-black text-white">${totalIncome.toFixed(2)}</h4>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#151921] p-8 rounded-[32px] border border-slate-800/50 shadow-xl flex items-center gap-6"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
            <TrendingDown className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('expense')}</p>
            <h4 className="text-3xl font-black text-white">${totalExpense.toFixed(2)}</h4>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-600 p-8 rounded-[32px] shadow-xl shadow-indigo-600/20 flex items-center gap-6 text-white"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Net Balance</p>
            <h4 className="text-3xl font-black">${netBalance.toFixed(2)}</h4>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Add Record Form */}
        <div className="xl:col-span-1">
          <div className="bg-[#151921] p-8 rounded-[32px] border border-slate-800/50 shadow-xl sticky top-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">{t('addTransaction')}</h3>
            </div>
            <form onSubmit={handleAddRecord} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setNewRecord(prev => ({ ...prev, type: 'Income' }))}
                    className={`py-4 rounded-2xl font-bold text-sm transition-all ${newRecord.type === 'Income' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-[#0B0E14] text-slate-500 hover:bg-[#1D222B]'}`}
                  >
                    {t('income')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewRecord(prev => ({ ...prev, type: 'Expense' }))}
                    className={`py-4 rounded-2xl font-bold text-sm transition-all ${newRecord.type === 'Expense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-[#0B0E14] text-slate-500 hover:bg-[#1D222B]'}`}
                  >
                    {t('expense')}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t('amount')}</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={newRecord.amount}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t('description')}</label>
                <textarea 
                  required
                  value={newRecord.description}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium h-32 resize-none"
                  placeholder="What was this for?"
                />
              </div>
              <button 
                type="submit" 
                disabled={adding}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
              >
                {adding ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                {t('addTransaction')}
              </button>
            </form>
          </div>
        </div>

        {/* Transaction History */}
        <div className="xl:col-span-2">
          <div className="bg-[#151921] rounded-[32px] border border-slate-800/50 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-800/50 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0B0E14] rounded-2xl flex items-center justify-center text-slate-400">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">{t('transactionHistory')}</h3>
            </div>
            <div className="divide-y divide-slate-800/50">
              {loading ? (
                <div className="p-20 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
                </div>
              ) : records.length === 0 ? (
                <div className="p-20 text-center text-slate-500 font-medium">
                  {t('noTransactions')}
                </div>
              ) : (
                records.map((record) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={record.id} 
                    className="p-8 flex items-center justify-between hover:bg-[#1D222B]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${record.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {record.type === 'Income' ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownLeft className="w-7 h-7" />}
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{record.description}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{new Date(record.created_at).toLocaleDateString()} • {new Date(record.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className={`text-2xl font-black ${record.type === 'Income' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {record.type === 'Income' ? '+' : '-'}${record.amount.toFixed(2)}
                      </span>
                      <button 
                        onClick={() => handleDeleteRecord(record.id)}
                        className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
                      >
                        <Trash2 className="w-6 h-6" />
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
