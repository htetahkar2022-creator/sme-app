"use client";

import React, { useState, useEffect } from 'react';
import { getListersFromSupabase, updateListerInSupabase } from '../lib/supabase';
import { ShieldCheck, ShieldAlert, Sparkles, RefreshCw, UserCheck, UserX, AlertCircle, Trash2, Calendar, Search } from 'lucide-react';

interface Lister {
  id: string;
  full_name: string;
  email: string;
  role: 'tenant' | 'lister' | 'admin';
  agent_ref_id?: string;
  is_verified_agent?: boolean;
  subscription_plan?: 'free' | 'premium_pro';
  premium_expiry_date?: string | null;
}

export default function AdminListerManager() {
  const [listers, setListers] = useState<Lister[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchListers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getListersFromSupabase();
      setListers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch listers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListers();
  }, []);

  const handleToggleVerification = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await updateListerInSupabase(id, { is_verified_agent: newStatus });
      setListers(prev => prev.map(l => l.id === id ? { ...l, is_verified_agent: newStatus } : l));
    } catch (err: any) {
      alert("Error updating verification: " + err.message);
    }
  };

  const handleUpgradePremium = async (id: string, currentExpiry: string | null | undefined) => {
    try {
      // Add 3 months to current expiry or start from today
      const start = currentExpiry ? new Date(currentExpiry) : new Date();
      if (isNaN(start.getTime())) {
        // Fallback for invalid formats
        new Date();
      }
      
      const newExpiry = new Date(start);
      newExpiry.setMonth(newExpiry.getMonth() + 3);
      
      const updates = {
        subscription_plan: 'premium_pro',
        premium_expiry_date: newExpiry.toISOString()
      };
      
      await updateListerInSupabase(id, updates);
      setListers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    } catch (err: any) {
      alert("Error upgrading to premium: " + err.message);
    }
  };

  const handleDowngradePremium = async (id: string) => {
    try {
      const updates = {
        subscription_plan: 'free',
        premium_expiry_date: null
      };
      
      await updateListerInSupabase(id, updates);
      setListers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    } catch (err: any) {
      alert("Error downgrading: " + err.message);
    }
  };

  const filteredListers = listers.filter(l => {
    const query = searchQuery.toLowerCase();
    return (
      l.full_name?.toLowerCase().includes(query) ||
      l.email?.toLowerCase().includes(query) ||
      l.agent_ref_id?.toLowerCase().includes(query)
    );
  });

  const getDaysLeft = (dateStr: string | null | undefined) => {
    if (!dateStr) return 0;
    const expiry = new Date(dateStr);
    const diff = expiry.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Lister Directory...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      
      {/* Header Panel with Stats & Search */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Lister & Agent Subscription Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor verified agents, upgrade subscriptions, and regulate the platform’s real estate brokers.
          </p>
        </div>

        {/* Local Search input for Listers */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by lister name, email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200"
          />
        </div>
      </div>

      {error && (
        <div className="m-6 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 p-4 rounded-xl flex items-start gap-3 text-red-655 dark:text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Error loading directory:</span> {error}
            <button onClick={fetchListers} className="ml-2 underline font-bold hover:text-red-800 block mt-1">Retry Fetch</button>
          </div>
        </div>
      )}

      {/* Listers Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-650 dark:text-slate-300">
          <thead className="text-[10px] uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-extrabold tracking-wider">
            <tr>
              <th className="px-6 py-4">Lister Info</th>
              <th className="px-6 py-4">Agent Ref ID</th>
              <th className="px-6 py-4">Verification Status</th>
              <th className="px-6 py-4">Subscription Standard</th>
              <th className="px-6 py-4 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredListers.map((lister) => {
              const daysLeft = getDaysLeft(lister.premium_expiry_date);
              const isPremium = lister.subscription_plan === 'premium_pro';
              const isVerified = lister.is_verified_agent;

              return (
                <tr key={lister.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors">
                  
                  {/* Name & Email */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {lister.full_name}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {lister.email}
                      </span>
                    </div>
                  </td>

                  {/* Agent Code */}
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 py-1 px-2.5 rounded-md">
                      {lister.agent_ref_id || 'AG-N/A'}
                    </span>
                  </td>

                  {/* Verification Slider/ToggleButton */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleVerification(lister.id, !!isVerified)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          isVerified
                            ? 'bg-emerald-50 dark:bg-emerald-950/45 border-emerald-200 dark:border-emerald-900 text-emerald-70s dark:text-emerald-400'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                        title={isVerified ? "Revoke Verification badge" : "Verify Lister Profile"}
                      >
                        {isVerified ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-550" />
                            <span>Verified Broker</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                            <span>Unverified</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Premium indicator layout */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          isPremium
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {isPremium ? 'Premium Pro' : 'Free Standard'}
                        </span>
                        {isPremium && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        )}
                      </div>

                      {isPremium && lister.premium_expiry_date && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleUpgradePremium(lister.id, lister.premium_expiry_date)}
                        className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-400 text-xs font-black rounded-lg transition-colors cursor-pointer"
                        title="Extend subscription plan by +3 months"
                      >
                        {isPremium ? '+3 Months Plan' : 'Activate Premium'}
                      </button>

                      {isPremium && (
                        <button
                          onClick={() => handleDowngradePremium(lister.id)}
                          className="px-3 py-1.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200/50 dark:border-red-900 text-red-650 dark:text-red-400 text-xs font-bold rounded-lg transition-all"
                          title="Downgrade profile to free standard"
                        >
                          Downgrade Free
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              );
            })}

            {filteredListers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-450 dark:text-slate-500 font-medium font-mono text-xs">
                  No registered listers fit this search parameter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
