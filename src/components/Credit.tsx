import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CreditRecord } from '../types';
import { Users, Plus, Trash2, Loader2, CreditCard, ChevronRight, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export const Credit = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<CreditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState({ customer_name: '', balance: '' });
  const [selectedCustomer, setSelectedCustomer] = useState<CreditRecord | null>(null);
  const [updateAmount, setUpdateAmount] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('credit')
      .select('*')
      .order('customer_name');

    if (error) console.error(error);
    else setCustomers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('User not authenticated');
      setAdding(false);
      return;
    }

    const { error } = await supabase
      .from('credit')
      .insert([{ 
        customer_name: newCustomer.customer_name, 
        balance: parseFloat(newCustomer.balance || '0'),
        user_id: user.id
      }]);

    if (error) {
      alert(error.message);
    } else {
      setNewCustomer({ customer_name: '', balance: '' });
      fetchCustomers();
    }
    setAdding(false);
  };

  const handleUpdateBalance = async (type: 'Add Debt' | 'Make Payment') => {
    if (!selectedCustomer || !updateAmount) return;
    const amount = parseFloat(updateAmount);
    const newBalance = type === 'Add Debt' ? selectedCustomer.balance + amount : selectedCustomer.balance - amount;

    const { error } = await supabase
      .from('credit')
      .update({ balance: newBalance })
      .eq('id', selectedCustomer.id);

    if (error) {
      alert(error.message);
    } else {
      setUpdateAmount('');
      setSelectedCustomer(null);
      fetchCustomers();
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    const { error } = await supabase
      .from('credit')
      .delete()
      .eq('id', id);

    if (error) alert(error.message);
    else fetchCustomers();
  };

  const filteredCustomers = customers.filter(c => 
    c.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{t('credit')}</h2>
          <p className="text-slate-400">Manage customer debts and payments</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-[#151921] border border-slate-800/50 rounded-2xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xl transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Customer Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#151921] p-8 rounded-[32px] border border-slate-800/50 shadow-xl sticky top-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Register Customer</h3>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newCustomer.customer_name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, customer_name: e.target.value }))}
                  className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Initial Balance ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={newCustomer.balance}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, balance: e.target.value }))}
                  className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  placeholder="0.00"
                />
              </div>
              <button 
                type="submit" 
                disabled={adding}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
              >
                {adding ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                Register Customer
              </button>
            </form>
          </div>
        </div>

        {/* Customer List */}
        <div className="lg:col-span-2">
          <div className="bg-[#151921] rounded-[32px] border border-slate-800/50 shadow-xl overflow-hidden">
            <div className="divide-y divide-slate-800/50">
              {loading ? (
                <div className="p-20 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-20 text-center text-slate-500 font-medium">
                  No customers found
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={customer.id} 
                    className="p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#1D222B]/30 transition-colors group gap-6"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-[#0B0E14] rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                        <Users className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{customer.customer_name}</p>
                        <p className="text-sm font-medium text-slate-500">Balance: <span className={`font-bold ${customer.balance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>${customer.balance.toFixed(2)}</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {selectedCustomer?.id === customer.id ? (
                        <div className="flex items-center gap-3 bg-[#0B0E14] p-2 rounded-2xl border border-slate-800/50 shadow-xl">
                          <input 
                            type="number" 
                            placeholder="Amount"
                            value={updateAmount}
                            onChange={(e) => setUpdateAmount(e.target.value)}
                            className="w-28 bg-transparent px-4 py-2 outline-none text-white font-bold placeholder:text-slate-700"
                          />
                          <button 
                            onClick={() => handleUpdateBalance('Add Debt')}
                            className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors"
                          >
                            Add Debt
                          </button>
                          <button 
                            onClick={() => handleUpdateBalance('Make Payment')}
                            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-colors"
                          >
                            Payment
                          </button>
                          <button 
                            onClick={() => setSelectedCustomer(null)}
                            className="px-4 py-2 text-slate-500 hover:text-slate-300 text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => setSelectedCustomer(customer)}
                            className="px-6 py-3 bg-[#0B0E14] text-slate-300 rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 border border-slate-800/50"
                          >
                            Manage Balance
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </>
                      )}
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
