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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory</h2>
          <p className="text-slate-500">Manage your products and stock levels</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Item Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Add New Product</h3>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={newItem.item_name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, item_name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. Wireless Mouse"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Stock</label>
                  <input 
                    type="number" 
                    required
                    value={newItem.stock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="100"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={adding}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Add Product
              </button>
            </form>
          </div>
        </div>

        {/* Item List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
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
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                              <Package className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-slate-900">{item.item_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${item.stock <= 5 ? 'text-red-500' : 'text-slate-900'}`}>{item.stock}</span>
                            {item.stock <= 5 && (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
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
