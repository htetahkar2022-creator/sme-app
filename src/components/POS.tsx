import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { InventoryItem, CartItem } from '../types';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle, Loader2, Search, Package, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const POS = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .gt('stock', 0)
      .order('item_name');

    if (error) console.error(error);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addToCart = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          alert('Cannot add more than available stock');
          return prev;
        }
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = i.quantity + delta;
        if (newQty < 1) return i;
        if (newQty > i.stock) {
          alert('Cannot exceed available stock');
          return i;
        }
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);

    try {
      // Update stock for each item in the cart
      for (const item of cart) {
        const { error } = await supabase
          .from('inventory')
          .update({ stock: item.stock - item.quantity })
          .eq('id', item.id);

        if (error) throw error;
      }

      // Record as income in finance table
      const { error: financeError } = await supabase
        .from('finance')
        .insert([{
          type: 'Income',
          amount: total,
          description: `POS Sale: ${cart.map(i => `${i.item_name} (x${i.quantity})`).join(', ')}`
        }]);

      if (financeError) throw financeError;

      setCart([]);
      setSuccess(true);
      fetchItems();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)] animate-in fade-in duration-500">
      {/* Product Selection */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Point of Sale</h2>
            <p className="text-slate-400">Select products to add to cart</p>
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

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-6">
              <Package className="w-20 h-20 opacity-10" />
              <p className="text-2xl font-bold">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <motion.button
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.96 }}
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="bg-[#151921] p-5 rounded-[32px] border border-slate-800/50 shadow-xl hover:border-indigo-500/50 transition-all text-left flex flex-col gap-4 group"
                >
                  <div className="w-full aspect-square bg-[#0B0E14] rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                    <Package className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg line-clamp-1">{item.item_name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-indigo-400 font-black text-lg">${item.price.toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.stock} in stock</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="lg:col-span-4 flex flex-col">
        <div className="bg-[#151921] rounded-[32px] border border-slate-800/50 shadow-2xl flex flex-col h-full overflow-hidden">
          <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Cart</h3>
            </div>
            <span className="bg-[#0B0E14] text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-500/20">{cart.length} items</span>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-slate-600 gap-6 py-12"
                >
                  <ShoppingCart className="w-16 h-16 opacity-10" />
                  <p className="text-xl font-bold">Your cart is empty</p>
                </motion.div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={item.id}
                    className="flex items-center gap-5 bg-[#0B0E14] p-5 rounded-2xl group border border-slate-800/30"
                  >
                    <div className="flex-1">
                      <h5 className="font-bold text-white text-lg line-clamp-1">{item.item_name}</h5>
                      <p className="text-sm font-medium text-slate-500">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-3 bg-[#151921] rounded-xl border border-slate-800/50 p-1.5">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 hover:bg-[#1D222B] rounded-lg transition-colors text-slate-400 hover:text-white"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-black text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 hover:bg-[#1D222B] rounded-lg transition-colors text-slate-400 hover:text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="p-8 bg-[#0B0E14] border-t border-slate-800/50 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
              <span className="text-white font-bold text-lg">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-2xl">
              <span className="text-white font-black">Total</span>
              <span className="text-indigo-400 font-black">${total.toFixed(2)}</span>
            </div>
            
            {success ? (
              <div className="bg-emerald-500 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-7 h-7" />
                Checkout Successful!
              </div>
            ) : (
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkingOut}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none text-lg"
              >
                {checkingOut ? <Loader2 className="w-7 h-7 animate-spin" /> : (
                  <>
                    Checkout
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
