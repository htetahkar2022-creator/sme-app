import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { InventoryItem } from '../types';
import { Plus, Trash2, Package, Loader2, Search, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({ item_name: '', price: '', stock: '' });

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    const { error } = await supabase
      .from('inventory')
      .insert([{ 
        item_name: newItem.item_name, 
        price: parseFloat(newItem.price), 
        stock: parseInt(newItem.stock) 
      }]);

    if (error) {
      alert(error.message);
    } else {
      setNewItem({ item_name: '', price: '', stock: '' });
      fetchItems();
    }
    setAdding(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) alert(error.message);
    else fetchItems();
  };

  const filteredItems = items.filter(item => 
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Inventory</h2>
          <p className="text-slate-400">Manage your products and stock levels</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-[#151921] border border-slate-800/50 rounded-2xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xl transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Add Item Form */}
        <div className="xl:col-span-1">
          <div className="bg-[#151921] p-8 rounded-[32px] border border-slate-800/50 shadow-xl sticky top-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Add Product</h3>
            </div>
            <form onSubmit={handleAddItem} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={newItem.item_name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, item_name: e.target.value }))}
                  className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  placeholder="e.g. Wireless Mouse"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Stock</label>
                  <input 
                    type="number" 
                    required
                    value={newItem.stock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder="100"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={adding}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
              >
                {adding ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                Add Product
              </button>
            </form>
          </div>
        </div>

        {/* Item List */}
        <div className="xl:col-span-2">
          <div className="bg-[#151921] rounded-[32px] border border-slate-800/50 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1D222B]/50">
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stock</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-500 font-medium">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={item.id} 
                        className="hover:bg-[#1D222B]/30 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#0B0E14] rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                              <Package className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-white text-lg">{item.item_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 font-bold text-slate-300 text-lg">${item.price.toFixed(2)}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <span className={`font-bold text-lg ${item.stock <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>{item.stock}</span>
                            {item.stock <= 5 && (
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
