import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CreditRecord } from '../types';
import { Users, Plus, Trash2, Loader2, CreditCard, ChevronRight, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Credit = () => {
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
    const { error } = await supabase
      .from('credit')
      .insert([{ 
        customer_name: newCustomer.customer_name, 
        balance: parseFloat(newCustomer.balance || '0') 
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Credit Ledger</h2>
          <p className="text-slate-500">Manage customer debts and payments</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Customer Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Register Customer</h3>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newCustomer.customer_name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, customer_name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Initial Balance ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={newCustomer.balance}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, balance: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="0.00"
                />
              </div>
              <button 
                type="submit" 
                disabled={adding}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Register Customer
              </button>
            </form>
          </div>
        </div>

        {/* Customer List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No customers found
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={customer.id} 
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-colors group gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{customer.customer_name}</p>
                        <p className="text-sm font-medium text-slate-500">Balance: <span className={`font-bold ${customer.balance > 0 ? 'text-red-500' : 'text-emerald-600'}`}>${customer.balance.toFixed(2)}</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {selectedCustomer?.id === customer.id ? (
                        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                          <input 
                            type="number" 
                            placeholder="Amount"
                            value={updateAmount}
                            onChange={(e) => setUpdateAmount(e.target.value)}
                            className="w-24 px-3 py-2 outline-none text-sm font-bold"
                          />
                          <button 
                            onClick={() => handleUpdateBalance('Add Debt')}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                          >
                            Add Debt
                          </button>
                          <button 
                            onClick={() => handleUpdateBalance('Make Payment')}
                            className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                          >
                            Payment
                          </button>
                          <button 
                            onClick={() => setSelectedCustomer(null)}
                            className="px-3 py-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => setSelectedCustomer(customer)}
                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                          >
                            Manage Balance
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
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
