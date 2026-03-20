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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
      {/* Product Selection */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Point of Sale</h2>
            <p className="text-slate-500">Select products to add to cart</p>
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

        <div className="flex-1 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
              <Package className="w-16 h-16 opacity-20" />
              <p className="text-xl font-medium">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left flex flex-col gap-3 group"
                >
                  <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Package className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{item.item_name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-indigo-600 font-bold">${item.price.toFixed(2)}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.stock} in stock</span>
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Current Cart</h3>
            </div>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">{cart.length} items</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 py-12"
                >
                  <ShoppingCart className="w-12 h-12 opacity-20" />
                  <p className="font-medium">Your cart is empty</p>
                </motion.div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={item.id}
                    className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group"
                  >
                    <div className="flex-1">
                      <h5 className="font-bold text-slate-900 line-clamp-1">{item.item_name}</h5>
                      <p className="text-sm font-medium text-slate-500">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-slate-900 font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xl">
              <span className="text-slate-900 font-black">Total</span>
              <span className="text-indigo-600 font-black">${total.toFixed(2)}</span>
            </div>
            
            {success ? (
              <div className="bg-emerald-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                <CheckCircle className="w-6 h-6" />
                Checkout Successful!
              </div>
            ) : (
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkingOut}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
              >
                {checkingOut ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    Checkout
                    <ArrowRight className="w-5 h-5" />
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
